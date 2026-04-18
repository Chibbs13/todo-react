import { useCallback, useState, useEffect } from "react";
import "./App.css";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import CategorySidebar from "./components/CategorySidebar";
import CategoryModal from "./components/CategoryModal";
import { getCategoryStyle } from "./lib/categoryColors";

const DEFAULT_CATEGORIES = ["All Tasks", "Work", "Home", "Gym"];

function formatTaskCount(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function App() {
  const [task, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) return [];

    try {
      return JSON.parse(savedTasks);
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");

    if (!savedCategories) return DEFAULT_CATEGORIES;

    try {
      const parsedCategories = JSON.parse(savedCategories);

      if (!Array.isArray(parsedCategories)) return DEFAULT_CATEGORIES;

      return Array.from(new Set(["All Tasks", ...parsedCategories]));
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState("All Tasks");

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskCategory, setTaskCategory] = useState("All Tasks");

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(task));
  }, [task]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const visibleTasks =
    selectedCategory === "All Tasks"
      ? task
      : task.filter((taskItem) => taskItem.category === selectedCategory);
  const completedTaskCount = visibleTasks.filter(
    (taskItem) => taskItem.completed,
  ).length;
  const remainingTaskCount = visibleTasks.length - completedTaskCount;
  const todayLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());
  const defaultTaskCategory =
    selectedCategory === "All Tasks" ? categories[1] || "All Tasks" : selectedCategory;

  function openAddTaskModal() {
    setIsAddingTask(true);
    setSelectedTask(null);
    setTaskTitle("");
    setTaskDetails("");
    setTaskCategory(defaultTaskCategory);
  }

  function openTaskEditor(taskItem) {
    setIsAddingTask(false);
    setSelectedTask(taskItem);
    setTaskTitle(taskItem.title || taskItem.text || "");
    setTaskDetails(taskItem.details || "");
    setTaskCategory(taskItem.category || "All Tasks");
  }

  const closeTaskModal = useCallback(function closeTaskModal() {
    setIsAddingTask(false);
    setSelectedTask(null);
    setTaskTitle("");
    setTaskDetails("");
    setTaskCategory("All Tasks");
  }, []);

  function saveTask() {
    if (!taskTitle.trim()) return;

    if (isAddingTask) {
      const newTaskObj = {
        id: Date.now(),
        title: taskTitle,
        details: taskDetails,
        category: taskCategory,
        completed: false,
      };

      setTask([...task, newTaskObj]);
    } else if (selectedTask) {
      setTask(
        task.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t,
                title: taskTitle,
                details: taskDetails,
                category: taskCategory,
              }
            : t,
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

  function toggleTaskCompleted(id) {
    setTask(
      task.map((taskItem) =>
        taskItem.id === id
          ? { ...taskItem, completed: !taskItem.completed }
          : taskItem,
      ),
    );
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = task.findIndex((t) => t.id === active.id);
    const newIndex = task.findIndex((t) => t.id === over.id);

    setTask((items) => arrayMove(items, oldIndex, newIndex));
  }

  function openAddCategoryModal() {
    setIsAddingCategory(true);
    setNewCategory("");
  }

  const closeCategoryModal = useCallback(function closeCategoryModal() {
    setIsAddingCategory(false);
    setNewCategory("");
  }, []);

  function saveCategory() {
    const trimmed = newCategory.trim();

    if (!trimmed) return;
    if (categories.includes(trimmed)) return;
    if (categories.length >= 8) return;

    setCategories([...categories, trimmed]);
    setSelectedCategory(trimmed);
    closeCategoryModal();
  }

  return (
    <main className="app">
      <div className="dashboard-layout">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={openAddCategoryModal}
        />

        <div className="todo-container">
          <div className="todo-header">
            <div className="todo-heading">
              <p className="todo-date">{todayLabel}</p>
              <h1 className="todo-title">
                Today's <span className="title-gradient">Focus</span>
              </h1>

              <p className="todo-subtitle">
                A clean list for the few things that actually need your
                attention.
              </p>
            </div>

            <div className="task-stats" aria-label="Task summary">
              <span>{formatTaskCount(visibleTasks.length, "task")}</span>
              <span>{formatTaskCount(completedTaskCount, "done", "done")}</span>
              <span>{formatTaskCount(remainingTaskCount, "left", "left")}</span>
            </div>
          </div>

          <button className="todo-add-button" onClick={openAddTaskModal}>
            Add Task
          </button>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <TaskList
              tasks={visibleTasks}
              selectedCategory={selectedCategory}
              deleteTask={deleteTask}
              openTaskEditor={openTaskEditor}
              toggleTaskCompleted={toggleTaskCompleted}
            />
          </DndContext>
        </div>
      </div>

      <TaskModal
        isOpen={isAddingTask || !!selectedTask}
        modalTitle={isAddingTask ? "Add New Task" : "Edit Task"}
        taskTitle={taskTitle}
        setTaskTitle={setTaskTitle}
        taskDetails={taskDetails}
        setTaskDetails={setTaskDetails}
        taskCategory={taskCategory}
        setTaskCategory={setTaskCategory}
        categories={categories}
        getCategoryStyle={getCategoryStyle}
        closeTaskModal={closeTaskModal}
        saveTask={saveTask}
        saveLabel={isAddingTask ? "Add Task" : "Save"}
      />

      <CategoryModal
        isOpen={isAddingCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        closeCategoryModal={closeCategoryModal}
        saveCategory={saveCategory}
      />
    </main>
  );
}

export default App;
