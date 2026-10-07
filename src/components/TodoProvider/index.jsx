import { useEffect, useRef, useState } from "react";
import TodoContext from "./TodoContext";
import { loadTodos, saveTodos } from '../../storage';

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const writable = useRef(true);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  const openFormTodoDialog = (todo) => {
    setSelectedTodo(todo || null);
    setShowDialog(true);
  };

  const closeFormTodoDialog = () => {
    setShowDialog(false);
    setSelectedTodo(null);
  };

  useEffect(() => {
    const result = loadTodos(() => window.localStorage);
    setTodos(result.todos);
    writable.current = result.writable;
    setStorageMessage(result.message);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !writable.current) return;
    const message = saveTodos(() => window.localStorage, todos);
    if (message) { writable.current = false; setStorageMessage(message); }
  }, [todos, ready]);

  const addTodo = (formData) => {
    const description = formData.get("description").trim();

    if (!description) {
      return;
    }

    setTodos((prevState) => {
      const todo = {
        id: crypto.randomUUID(),
        description,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      return [...prevState, todo];
    });
  };

  const toggleTodoCompleted = (todo) => {
    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id == todo.id) {
          return {
            ...t,
            completed: !t.completed,
          };
        }
        return t;
      });
    });
  };

  const editTodo = (formData) => {
    const description = formData.get("description").trim();

    if (!description) {
      return;
    }

    setTodos((prevState) => {
      return prevState.map((t) => {
        if (t.id == selectedTodo.id) {
          return {
            ...t,
            description,
          };
        }
        return t;
      });
    });
  };

  const deleteTodo = (todo) => {
    setTodos((prevState) => {
      return prevState.filter((t) => t.id != todo.id);
    });
  };

  return (
    <TodoContext
      value={{
        todos,
        addTodo,
        toggleTodoCompleted,
        deleteTodo,
        showDialog,
        openFormTodoDialog,
        closeFormTodoDialog,
        selectedTodo,
        editTodo,
        storageMessage,
        ready
      }}
    >
      {children}
    </TodoContext>
  );
}
