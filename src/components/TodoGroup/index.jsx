import { SubHeading } from '../SubHeading';
import { ToDoItem } from '../ToDoItem';
import { ToDoList } from '../ToDoList';
export function TodoGroup({ items, heading }) {
  return <section aria-label={heading}>
    <SubHeading>{heading}<span className="task-count">{items.length}</span></SubHeading>
    {items.length ? <ToDoList>{items.map(t => <ToDoItem key={t.id} item={t} />)}</ToDoList> : <p className="group-empty">Tudo em dia. Que bom ter esse respiro!</p>}
  </section>;
}
