import { use } from 'react';
import { Container } from './components/Container';
import { Dialog } from './components/dialog';
import { Header } from './components/Header';
import { Heading } from './components/Heading';
import { IconPlus, IconChecklist } from './components/icons';
import { TodoForm } from './components/TodoForm';
import TodoContext from './components/TodoProvider/TodoContext';
import { TodoGroup } from './components/TodoGroup';
import { EmptyState } from './components/EmptyState';
import { Button } from './components/Button';

function App() {
  const { todos, addTodo, showDialog, openFormTodoDialog, closeFormTodoDialog, selectedTodo, editTodo, storageMessage, ready } = use(TodoContext);
  const pending = todos.filter(t => !t.completed);
  const completed = todos.filter(t => t.completed);
  function handleFormSubmit(formData) {
    if (selectedTodo) editTodo(formData);
    else addTodo(formData);
    closeFormTodoDialog();
  }
  return <>
    <a className="skip-link" href="#tasks">Pular para as tarefas</a>
    <main>
      <Container>
        <Header>
          <div className="brand-mark"><IconChecklist /></div>
          <p className="eyebrow">UM PASSO DE CADA VEZ</p>
          <Heading>To Do List</Heading>
          <p className="intro">Organize o dia. Abra espaço para o que importa.</p>
        </Header>
        <section className="task-area" id="tasks" tabIndex={-1} aria-label="Suas tarefas">
          <div className="list-toolbar">
            <p className="list-summary" role="status">{todos.length ? completed.length + ' de ' + todos.length + (todos.length === 1 ? ' tarefa concluída' : ' tarefas concluídas') : 'Seu dia, no seu ritmo.'}</p>
            <span className="local-badge"><span aria-hidden="true" />{storageMessage ? 'Nesta sessão' : 'Salvo neste navegador'}</span>
          </div>
          {storageMessage && <p role="status" className="storage-message">{storageMessage}</p>}
          {todos.length === 0 ? <EmptyState /> : <>
            <TodoGroup heading="A fazer" items={pending} />
            {completed.length > 0 && <TodoGroup heading="Concluídas" items={completed} />}
          </>}
          <Button className="add-task" id="add-task" disabled={!ready} onClick={() => openFormTodoDialog()}><IconPlus /> Nova tarefa</Button>
        </section>
        <footer className="sheet-footer">Menos na cabeça. Mais no papel.</footer>
      </Container>
      <p className="privacy-note">Um espaço só seu. As tarefas ficam neste navegador.</p>
    </main>
    <Dialog isOpen={showDialog} onClose={closeFormTodoDialog} title={selectedTodo ? 'Editar tarefa' : 'Nova tarefa'}>
      <TodoForm key={selectedTodo?.id || 'new'} onSubmit={handleFormSubmit} defaultValue={selectedTodo?.description} />
    </Dialog>
  </>;
}
export default App;
