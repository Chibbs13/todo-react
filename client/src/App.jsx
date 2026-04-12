import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import "./App.css";

function App() {
  const [task, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(task));
  }, [task]);

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
      completed: false,
    };

    setTask([...task, newTaskObj]);
    setNewTask("");
  }

  function deleteTask(id) {
    setTask(task.filter((t) => t.id !== id));

    if (selectedTask && selectedTask.id === id) {
      closeTaskEditor();
    }
  }

  function openTaskEditor(taskItem) {
    setSelectedTask(taskItem);
    setEditText(taskItem.text);
  }

  function closeTaskEditor() {
    setSelectedTask(null);
    setEditText("");
  }

  function saveTaskEdit() {
    if (!editText.trim() || !selectedTask) return;

    setTask(
      task.map((t) =>
        t.id === selectedTask.id ? { ...t, text: editText } : t,
      ),
    );

    closeTaskEditor();
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

        <p className="todo-subtitle">
          Stay on top of your tasks with a clean workflow!
        </p>

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
          {task.length === 0 ? (
            <p className="empty-state">No tasks yet. Add one above.</p>
          ) : (
            task.map((t) => (
              <Card
                key={t.id}
                className="task-card"
                onClick={() => openTaskEditor(t)}
              >
                <CardContent className="task-card-content">
                  <span
                    className={`task-text ${t.completed ? "completed" : ""}`}
                  >
                    {t.text}
                  </span>

                  <div
                    className="task-actions"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button onClick={() => moveTaskToFront(t.id)}>
                      Move to Front
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() => openTaskEditor(t)}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => deleteTask(t.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="task-overlay" onClick={closeTaskEditor}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Edit Task</h2>

            <textarea
              className="modal-input"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows="5"
            />

            <div className="modal-actions">
              <Button onClick={saveTaskEdit}>Save</Button>
              <Button variant="secondary" onClick={closeTaskEditor}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
