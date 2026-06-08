import { Button } from "../Button";
import { TextInput } from "../TextInput";

import "./todoform.style.css";

export function TodoForm({ onSubmit, defaultValue }) {
  return (
    <form action={onSubmit} className="todo-form">
      <TextInput
        placeholder="Digite o item que deseja adicionar"
        required
        name="description"
        defaultValue={defaultValue}
      />
      <Button type="submit">Salvar item</Button>
    </form>
  );
}
