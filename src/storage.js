const warning = 'Não foi possível salvar as tarefas neste navegador. As mudanças ficam apenas nesta sessão.';
export function loadTodos(getStorage) {
  try {
    const raw = getStorage().getItem('todos');
    const todos = raw ? JSON.parse(raw) : [];
    const ids = new Set();
    if (!Array.isArray(todos) || todos.some(todo => {
      if (!todo || typeof todo.id !== 'string' || !todo.id || ids.has(todo.id) || typeof todo.description !== 'string' || typeof todo.completed !== 'boolean' || typeof todo.createdAt !== 'string' || !Number.isFinite(Date.parse(todo.createdAt))) return true;
      ids.add(todo.id);
      return false;
    })) throw Error('Formato inválido');
    return { todos, writable: true, message: '' };
  } catch {
    return { todos: [], writable: false, message: 'Não foi possível ler as tarefas salvas. Os dados originais foram preservados; novas tarefas ficam apenas nesta sessão.' };
  }
}
export function saveTodos(getStorage, todos) {
  try { getStorage().setItem('todos', JSON.stringify(todos)); return ''; }
  catch { return warning; }
}
