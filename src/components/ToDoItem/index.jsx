import './todo-item.style.css';
import { IconPencil, IconTrash } from '../icons';
import { use } from 'react';
import TodoContext from '../TodoProvider/TodoContext';
export function ToDoItem({ item }) {
  const { toggleTodoCompleted, deleteTodo, openFormTodoDialog } = use(TodoContext);
  const focusAfter = (action, selector) => { action(); requestAnimationFrame(() => document.querySelector(selector)?.focus()); };
  return <li className={'todo-item' + (item.completed ? ' completed' : '')}>
    <div className="details">
      <label className="task-label">
        <input type="checkbox" className="checkbox" checked={item.completed} data-todo-id={item.id} onChange={() => focusAfter(() => toggleTodoCompleted(item), '[data-todo-id="' + CSS.escape(item.id) + '"]')} />
        <span className="description">{item.description}</span>
      </label>
      <div className="actions">
        <button type="button" className="btn" aria-label={'Editar: ' + item.description} onClick={() => openFormTodoDialog(item)}><IconPencil /></button>
        <button type="button" className="btn btn-delete" aria-label={'Excluir: ' + item.description} onClick={() => focusAfter(() => deleteTodo(item), '#add-task')}><IconTrash /></button>
      </div>
    </div>
    <time className="date" dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</time>
  </li>;
}
