import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTodos, saveTodos } from '../src/storage.js';
const legacy = [{ id: 'old-id', description: 'Tarefa antiga', completed: true, createdAt: '2026-06-08T17:17:40Z', extra: 'preservado' }];
test('lê dados legados sem mudar identificadores, campos ou chave', () => {
  const result = loadTodos(() => ({ getItem(key) { assert.equal(key, 'todos'); return JSON.stringify(legacy); } }));
  assert.deepEqual(result.todos, legacy);
  assert.equal(result.writable, true);
});
test('dados corrompidos ou inválidos bloqueiam gravação e avisam', () => {
  for (const raw of ['{broken', '{}', '[null]', JSON.stringify([...legacy, ...legacy]), JSON.stringify([{ ...legacy[0], createdAt: 'invalid' }])]) {
    const result = loadTodos(() => ({ getItem: () => raw }));
    assert.equal(result.writable, false);
    assert.ok(result.message);
  }
});
test('acesso negado ao armazenamento não derruba a aplicação', () => {
  assert.equal(loadTodos(() => { throw Error('SecurityError'); }).writable, false);
});
test('cota esgotada retorna aviso; gravação válida mantém o contrato', () => {
  assert.ok(saveTodos(() => ({ setItem() { throw Error('QuotaExceededError'); } }), legacy));
  assert.equal(saveTodos(() => ({ setItem(key, value) { assert.equal(key, 'todos'); assert.deepEqual(JSON.parse(value), legacy); } }), legacy), '');
});
