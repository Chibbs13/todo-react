import { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import "./App.css";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableTaskCard({ t, deleteTask, openTaskEditor }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: t.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="task-card" {...attributes} {...listeners}>
        <CardContent className="task-card-content">
          <div className="task-left">
            <span className="drag-indicator">⋮⋮</span>

            <span className={`task-text ${t.completed ? "completed" : ""}`}>
              {t.text}
            </span>
          </div>

          <div
            className="task-actions"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="secondary" onClick={() => openTaskEditor(t)}>
              Edit
            </Button>

            <Button variant="destructive" onClick={() => deleteTask(t.id)}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = task.findIndex((t) => t.id === active.id);
    const newIndex = task.findIndex((t) => t.id === over.id);

    setTask((items) => arrayMove(items, oldIndex, newIndex));
  }

  return (
    <main className="app">
      <div className="todo-container">
        <h1 className="todo-title">Todo List</h1>

        <p className="todo-subtitle">
          Stay on top of your tasks with a clean workflow!
        </p>

        <p className="drag-help-text">
          Hold and drag a task card to reorder it.
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

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={task.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="task-list">
              {task.length === 0 ? (
                <p className="empty-state">No tasks yet. Add one above.</p>
              ) : (
                task.map((t) => (
                  <SortableTaskCard
                    key={t.id}
                    t={t}
                    deleteTask={deleteTask}
                    openTaskEditor={openTaskEditor}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {selectedTask && (
        <div className="task-overlay" onClick={closeTaskEditor}>
          <Card className="task-modal" onClick={(e) => e.stopPropagation()}>
            <CardContent className="task-modal-content">
              <div className="task-modal-header">
                <span className="drag-indicator">⋮⋮</span>
                <h2 className="modal-title">Edit Task</h2>
              </div>

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
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}

export default App;
