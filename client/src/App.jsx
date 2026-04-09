import { useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import "./App.css";

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

  function editTask(id) {
    const currentTask = task.find((t) => t.id === id);
    const updatedText = prompt("Edit your task:", currentTask.text);

    if (updatedText === null || updatedText.trim() === "") return;

    setTask(task.map((t) => (t.id === id ? { ...t, text: updatedText } : t)));
  }

  function moveTaskToFront(id) {
    const taskToMove = task.find((t) => t.id === id);
    if (taskToMove) {
      setTask([taskToMove, ...task.filter((t) => t.id !== id)]);
    }
  }

  return (
    <main className="app">
      <div className="todo-container">
        <h1 className="todo-title">Todo List</h1>

        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            value={newTask}
            onChange={handleChange}
            placeholder="Add a new task"
            className="todo-input"
          />
          <button type="submit" className="todo-add-button">
            Add Task
          </button>
        </form>

        <div className="task-list">
          {task.map((t) => (
            <Card key={t.id} className="task-card">
              <CardContent className="task-card-content">
                <span className="task-text">{t.text}</span>

                <div className="task-actions">
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="task-button delete-button"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => editTask(t.id)}
                    className="task-button edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => moveTaskToFront(t.id)}
                    className="task-button move-button"
                  >
                    Move to Front
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
