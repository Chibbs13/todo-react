import { useState } from "react";

function App() {
  const [task, setTask] = useState([]);
  const [newTask, setNewTask] = useState("");

  function handleChange(e) {
    setNewTask(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    addTask();
  }

  function addTask() {
    if (newTask.trim() === "") return;

    const newTaskObj = {
      id: Date.now(),
      text: newTask,
    };

    setTask([...task, newTaskObj]);
    setNewTask("");
  }

  function deleteTask(id) {
    setTask(task.filter((t) => t.id !== id));
  }

  function editTask(id) {}

  function moveTaskToFront(id) {}

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTask}
          onChange={handleChange}
          placeholder="Add a new task"
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {task.map((t) => (
          <li key={t.id}>
            {t.text}
            <button onClick={() => deleteTask(t.id)}>Delete</button>
            <button onClick={() => editTask(t.id)}>Edit</button>
            <button onClick={() => moveTaskToFront(t.id)}>Move to Front</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
