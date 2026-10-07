import { chromium } from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.env.AUDIT_URL || 'http://127.0.0.1:4174/';
const browser = await chromium.launch({ channel: process.env.AUDIT_BROWSER || 'chrome', headless: true });
const results = [];
const errors = [];
await mkdir('artifacts/ui', { recursive: true });
async function audit(page, state, width) {
  const { violations, incomplete, passes } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
  results.push({ state, width, violations, incomplete, passes: passes.length });
  await writeFile('artifacts/ui/summary.json', JSON.stringify({ base, browser: process.env.AUDIT_BROWSER || 'chrome', results, errors }, null, 2));
  assert.deepEqual(violations, [], state);
  // axe can mistake the native dialog's top layer for overlap at narrow widths.
  // Keep the finding in the report; only this visually reviewed hint is accepted.
  for (const finding of incomplete) {
    assert.equal(finding.id, 'color-contrast');
    for (const node of finding.nodes) assert.deepEqual(node.target, ['#task-hint']);
    const colors = await page.locator('#task-hint').evaluate(el => ({ foreground: getComputedStyle(el).color, background: getComputedStyle(el.closest('dialog')).backgroundColor }));
    assert.deepEqual(colors, { foreground: 'rgb(88, 102, 91)', background: 'rgb(252, 252, 247)' });
    results.at(-1).manualReview = { target: '#task-hint', colors, note: 'Texto visível sem sobreposição na captura do modal; contraste 5,89:1, WCAG AA.' };
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, state + ' overflow');
}
try {
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(base);
    const add = page.getByRole('button', { name: 'Nova tarefa', exact: true });
    await add.waitFor();
    await page.waitForFunction(() => !document.querySelector('#add-task').disabled);
    assert.equal(await page.title(), 'To Do List');
    assert.equal(await page.locator('html').getAttribute('lang'), 'pt-BR');
    await audit(page, 'empty', width);
    await page.screenshot({ path: 'artifacts/ui/empty-' + width + '.png', fullPage: true });
    await add.click();
    const field = page.getByRole('textbox', { name: 'O que você quer fazer?' });
    await audit(page, 'dialog', width);
    await field.fill('   ');
    await page.getByRole('button', { name: 'Salvar tarefa' }).click();
    assert.equal(await field.evaluate(el => el.validity.valid), false);
    await field.fill('Ler algumas páginas');
    assert.equal(await field.evaluate(el => document.activeElement === el), true);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => !!document.activeElement.closest('dialog')), true);
    }
    await page.getByRole('button', { name: 'Salvar tarefa' }).click();
    await page.getByRole('checkbox', { name: 'Ler algumas páginas' }).waitFor();
    assert.equal(await add.evaluate(el => document.activeElement === el), true);
    await page.getByRole('button', { name: 'Editar: Ler algumas páginas', exact: true }).click();
    await field.fill('Revisar tarefas de amanhã');
    await page.getByRole('button', { name: 'Salvar tarefa' }).click();
    const checkbox = page.getByRole('checkbox', { name: 'Revisar tarefas de amanhã', exact: true });
    await checkbox.check();
    await page.waitForFunction(() => document.querySelector('input[type=checkbox]').checked);
    assert.equal(await checkbox.evaluate(el => document.activeElement === el), true);
    await audit(page, 'completed', width);
    await page.reload();
    await page.getByRole('checkbox', { name: 'Revisar tarefas de amanhã', exact: true }).waitFor();
    assert.equal(await checkbox.isChecked(), true);
    await checkbox.uncheck();
    await audit(page, 'pending', width);
    await page.screenshot({ path: 'artifacts/ui/task-' + width + '.png', fullPage: true });
    await page.getByRole('button', { name: 'Editar: Revisar tarefas de amanhã', exact: true }).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog').evaluate(el => el.open), false);
    await page.getByRole('button', { name: 'Excluir: Revisar tarefas de amanhã', exact: true }).click();
    await page.getByRole('heading', { name: 'Um dia cheio de possibilidades.' }).waitFor();
    assert.equal(await add.evaluate(el => document.activeElement === el), true);
    assert.equal(await page.evaluate(() => localStorage.getItem('todos')), '[]');
    await context.close();
  }

  const legacy = [{ id: 'legacy', description: 'Tarefa antiga preservada', completed: true, createdAt: '2026-06-08T17:17:40Z' }];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(value => { if (!localStorage.getItem('todos')) localStorage.setItem('todos', JSON.stringify(value)); }, legacy);
  await page.goto(base);
  await page.getByRole('checkbox', { name: legacy[0].description }).waitFor();
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('todos'))), legacy);
  await page.getByRole('button', { name: 'Nova tarefa', exact: true }).click();
  await page.getByRole('textbox').fill('T'.repeat(500));
  await page.getByRole('button', { name: 'Salvar tarefa' }).click();
  await audit(page, 'legacy-long-text-reduced-motion', 390);
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await audit(page, 'text-200-percent', 390);
  await context.close();

  for (const scenario of ['corrupt', 'blocked', 'quota']) {
    const context = await browser.newContext({ viewport: { width: 320, height: 568 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(value => {
      if (value === 'corrupt') localStorage.setItem('todos', '{invalid');
      if (value === 'blocked') Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Denied', 'SecurityError'); } });
      if (value === 'quota') Storage.prototype.setItem = () => { throw new DOMException('Full', 'QuotaExceededError'); };
    }, scenario);
    await page.goto(base);
    await page.getByText('Nesta sessão', { exact: true }).waitFor();
    await page.getByRole('button', { name: 'Nova tarefa', exact: true }).click();
    await page.getByRole('textbox').fill('Tarefa nesta sessão');
    await page.getByRole('button', { name: 'Salvar tarefa' }).click();
    await page.getByRole('checkbox', { name: 'Tarefa nesta sessão' }).waitFor();
    await audit(page, scenario, 320);
    if (scenario === 'corrupt') assert.equal(await page.evaluate(() => localStorage.getItem('todos')), '{invalid');
    await context.close();
  }
  const noJsContext = await browser.newContext({ javaScriptEnabled: false });
  const noJs = await noJsContext.newPage();
  await noJs.goto(base);
  assert.equal(await noJs.getByRole('heading', { name: 'To Do List', exact: true }).isVisible(), true);
  assert.equal(await noJs.getByRole('button', { name: 'Nova tarefa', exact: true }).isDisabled(), true);
  await noJsContext.close();
  for (const [width, height] of [[844, 390], [320, 568], [768, 600]]) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    await page.goto(base);
    await page.getByRole('button', { name: 'Nova tarefa', exact: true }).click();
    await audit(page, 'short-viewport-' + height, width);
    await page.screenshot({ path: 'artifacts/ui/dialog-' + width + '-' + height + '.png' });
    const modal = await page.locator('dialog').boundingBox();
    assert.ok(modal.y >= 0 && modal.y + modal.height <= height, 'Modal fora da área visível');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(() => !!document.activeElement.closest('dialog')), true);
    await page.keyboard.press('Escape');
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile('artifacts/ui/summary.json', JSON.stringify({ base, browser: process.env.AUDIT_BROWSER || 'chrome', results, errors }, null, 2));
  console.log(JSON.stringify({ checks: results.length, violations: 0, manualReviews: results.filter(r => r.manualReview).length, browserErrors: errors.length, functional: 'CRUD, persistência, legado, teclado, modal, movimento reduzido, 200% texto, dados corrompidos/bloqueio/cota, HTML sem JS' }));
} finally { await browser.close(); }
