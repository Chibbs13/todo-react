import { useState, useEffect } from "react";
import "./App.css";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";

function App() {
  const [task, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskText, setTaskText] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(task));
  }, [task]);

  function openAddTaskModal() {
    setIsAddingTask(true);
    setSelectedTask(null);
    setTaskText("");
  }

  function openTaskEditor(taskItem) {
    setIsAddingTask(false);
    setSelectedTask(taskItem);
    setTaskText(taskItem.text);
  }

  function closeTaskModal() {
    setIsAddingTask(false);
    setSelectedTask(null);
    setTaskText("");
  }

  function saveTask() {
    if (!taskText.trim()) return;

    if (isAddingTask) {
      const newTaskObj = {
        id: Date.now(),
        text: taskText,
        completed: false,
      };

      setTask([...task, newTaskObj]);
    } else if (selectedTask) {
      setTask(
        task.map((t) =>
          t.id === selectedTask.id ? { ...t, text: taskText } : t,
        ),
      );
    }

    closeTaskModal();
  }

  function deleteTask(id) {
    setTask(task.filter((t) => t.id !== id));

    if (selectedTask && selectedTask.id === id) {
      closeTaskModal();
    }
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

        <button className="todo-add-button" onClick={openAddTaskModal}>
          Add Task
        </button>

        <p className="drag-help-text">
          Hold and drag a task card to reorder it.
        </p>

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

      <TaskModal
        isOpen={isAddingTask || !!selectedTask}
        modalTitle={isAddingTask ? "Add New Task" : "Edit Task"}
        taskText={taskText}
        setTaskText={setTaskText}
        closeTaskModal={closeTaskModal}
        saveTask={saveTask}
        saveLabel={isAddingTask ? "Add Task" : "Save"}
      />
    </main>
  );
}

export default App;
