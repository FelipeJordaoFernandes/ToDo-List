import { Button } from '../Button';
import { TextInput } from '../TextInput';
import './todoform.style.css';
export function TodoForm({ onSubmit, defaultValue }) {
  function handleSubmit(event) {
    event.preventDefault();
    const input = event.currentTarget.elements.description;
    if (!input.value.trim()) { input.setCustomValidity('Escreva uma tarefa antes de salvar.'); input.reportValidity(); return; }
    onSubmit(new FormData(event.currentTarget));
  }
  return <form onSubmit={handleSubmit} className="todo-form">
    <label htmlFor="description">O que você quer fazer?</label>
    <TextInput id="description" name="description" aria-describedby="task-hint" placeholder="Ex.: Ler algumas páginas" required maxLength={500} defaultValue={defaultValue || ''} onInput={event => event.currentTarget.setCustomValidity('')} />
    <p id="task-hint">Uma tarefa simples já é um bom começo.</p>
    <Button type="submit">Salvar tarefa</Button>
  </form>;
}
