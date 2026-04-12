import { useState, useEffect } from "react";
import "./App.css";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import TaskEditModal from "./components/TaskEditModal";

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

        <TaskForm
          newTask={newTask}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />

        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <TaskList
            tasks={task}
            deleteTask={deleteTask}
            openTaskEditor={openTaskEditor}
          />
        </DndContext>
      </div>

      <TaskEditModal
        selectedTask={selectedTask}
        editText={editText}
        setEditText={setEditText}
        closeTaskEditor={closeTaskEditor}
        saveTaskEdit={saveTaskEdit}
      />
    </main>
  );
}

export default App;
