import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

function App() {
  const [text, setText] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>(() => {
    // 初期値を localStorage から読み込む
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });  
  
  // todos が変わるたびに localStorage に保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleAdd = (): void => {
    if (text.trim() === "") return;
    const newTodo: Todo = { id: Date.now(), text, done: false }; // 初期は未完了
    setTodos([...todos, newTodo]);
    setText("");
  };

  const handleDelete = (id: number): void => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleToggle = (id: number): void => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const incompleteTodos = todos.filter((todo) => !todo.done);
  const completedTodos = todos.filter((todo) => todo.done);

  return (
    <>
      <h1>ToDoリスト</h1>
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder="タスクを入力"
      />
      <button onClick={handleAdd}>追加</button>

      <h2>未完了</h2>
      <ul>
        {incompleteTodos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
              />
              {todo.text}
            </label>
            <button onClick={() => handleDelete(todo.id)}>削除</button>
          </li>
        ))}
      </ul>

      <h2>完了済み</h2>
      <ul>
        {completedTodos.map((todo) => (
          <li key={todo.id}>
            <label style={{ textDecoration: "line-through" }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
              />
              {todo.text}
            </label>
            <button onClick={() => handleDelete(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
