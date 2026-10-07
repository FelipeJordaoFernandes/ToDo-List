import fs from 'node:fs/promises';
import { createServer } from 'node:net';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';
import { chromium } from 'playwright-core';

const url = process.env.AUDIT_URL || 'http://127.0.0.1:4174/';
const phase = process.env.AUDIT_PHASE || 'final';
const runs = Number(process.env.AUDIT_RUNS || 3);
if (!/^[a-z0-9-]+$/.test(phase) || !Number.isInteger(runs) || runs < 1) throw Error('Configuração inválida');
const directory = `artifacts/lighthouse/${phase}`;
await fs.mkdir(directory, { recursive: true });
const results = [];
for (const mode of ['mobile', 'desktop']) {
  for (let run = 1; run <= runs; run++) {
    const server = createServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    await new Promise(resolve => server.close(resolve));
    const browser = await chromium.launch({ channel: 'chrome', headless: true, args: [`--remote-debugging-port=${port}`] });
    try {
      const { lhr, report } = await lighthouse(url, { port, output: ['json', 'html'], logLevel: 'error', locale: 'pt-BR', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, mode === 'desktop' ? desktopConfig : undefined);
      if (lhr.runtimeError) throw Error(JSON.stringify(lhr.runtimeError));
      await fs.writeFile(`${directory}/${mode}-${run}.json`, report[0]);
      await fs.writeFile(`${directory}/${mode}-${run}.html`, report[1]);
      const result = { mode, run, version: lhr.lighthouseVersion, date: lhr.fetchTime, scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, Math.round(v.score * 100)])), metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift'].map(k => [k, lhr.audits[k].numericValue])), findings: Object.values(lhr.audits).filter(a => a.score !== null && a.score < 1 && a.scoreDisplayMode !== 'informative').map(a => ({ id: a.id, title: a.title, display: a.displayValue })) };
      results.push(result);
      await fs.writeFile(`${directory}/summary.json`, JSON.stringify({ url, phase, results }, null, 2));
      console.log(JSON.stringify(result));
    } finally { await browser.close(); }
  }
}
