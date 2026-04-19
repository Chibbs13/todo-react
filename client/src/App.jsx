import { useCallback, useRef, useState, useEffect } from "react";
import "./App.css";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import CategorySidebar from "./components/CategorySidebar";
import CategoryModal from "./components/CategoryModal";
import { getCategoryStyle } from "./lib/categoryColors";
import { DEFAULT_CATEGORY_ICONS } from "./lib/categoryIcons";

const DEFAULT_CATEGORIES = ["All Tasks", "Work", "Home", "Gym"];

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
  const [categoryIcons, setCategoryIcons] = useState(() => {
    const savedCategoryIcons = localStorage.getItem("categoryIcons");

    if (!savedCategoryIcons) return DEFAULT_CATEGORY_ICONS;

    try {
      return { ...DEFAULT_CATEGORY_ICONS, ...JSON.parse(savedCategoryIcons) };
    } catch {
      return DEFAULT_CATEGORY_ICONS;
    }
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskCategory, setTaskCategory] = useState("All Tasks");
  const [isCelebrating, setIsCelebrating] = useState(false);
  const celebrationTimeoutRef = useRef(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("tag");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(task));
  }, [task]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("categoryIcons", JSON.stringify(categoryIcons));
  }, [categoryIcons]);

  const visibleTasks =
    selectedCategory === "All Tasks"
      ? task
      : task.filter((taskItem) => taskItem.category === selectedCategory);
  const completedTaskCount = visibleTasks.filter(
    (taskItem) => taskItem.completed,
  ).length;
  const progressPercent =
    visibleTasks.length === 0
      ? 0
      : Math.round((completedTaskCount / visibleTasks.length) * 100);
  const todayLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());
  const defaultTaskCategory =
    selectedCategory === "All Tasks" ? categories[1] || "All Tasks" : selectedCategory;

  useEffect(() => {
    return () => window.clearTimeout(celebrationTimeoutRef.current);
  }, []);

  function startCelebration() {
    window.clearTimeout(celebrationTimeoutRef.current);
    setIsCelebrating(true);

    celebrationTimeoutRef.current = window.setTimeout(() => {
      setIsCelebrating(false);
    }, 2200);
  }

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
    const nextTasks = task.map((taskItem) =>
      taskItem.id === id
        ? { ...taskItem, completed: !taskItem.completed }
        : taskItem,
    );
    const nextVisibleTasks =
      selectedCategory === "All Tasks"
        ? nextTasks
        : nextTasks.filter((taskItem) => taskItem.category === selectedCategory);
    const wasComplete =
      visibleTasks.length > 0 &&
      visibleTasks.every((taskItem) => taskItem.completed);
    const nextIsComplete =
      nextVisibleTasks.length > 0 &&
      nextVisibleTasks.every((taskItem) => taskItem.completed);

    setTask(nextTasks);

    if (!wasComplete && nextIsComplete) {
      startCelebration();
    }
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
    setNewCategoryIcon("tag");
  }

  const closeCategoryModal = useCallback(function closeCategoryModal() {
    setIsAddingCategory(false);
    setNewCategory("");
    setNewCategoryIcon("tag");
  }, []);

  function saveCategory() {
    const trimmed = newCategory.trim();

    if (!trimmed) return;
    if (categories.includes(trimmed)) return;
    if (categories.length >= 8) return;

    setCategories([...categories, trimmed]);
    setCategoryIcons({ ...categoryIcons, [trimmed]: newCategoryIcon });
    setSelectedCategory(trimmed);
    closeCategoryModal();
  }

  return (
    <main className="app">
      <div className="dashboard-layout">
        <CategorySidebar
          categories={categories}
          categoryIcons={categoryIcons}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={openAddCategoryModal}
        />

        <div className="todo-container">
          <div className="todo-top-row">
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
            </div>

            <div
              className={`progress-card ${isCelebrating ? "celebrating" : ""}`}
              aria-label="Completion progress"
            >
              {isCelebrating && (
                <>
                  <div className="great-job-pop" role="status">
                    Great Job!
                  </div>

                  <div className="confetti-burst" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </>
              )}

              <div>
                <p className="progress-label">Progress</p>
                <p className="progress-value">{progressPercent}%</p>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progressPercent}
              >
                <span style={{ width: `${progressPercent}%` }} />
              </div>

              <p className="progress-copy">
                {visibleTasks.length === 0
                  ? "No tasks yet"
                  : completedTaskCount === 0
                    ? "Let's check off some boxes"
                  : `${completedTaskCount} of ${visibleTasks.length} complete`}
              </p>
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
        newCategoryIcon={newCategoryIcon}
        setNewCategoryIcon={setNewCategoryIcon}
        closeCategoryModal={closeCategoryModal}
        saveCategory={saveCategory}
      />
    </main>
  );
}

export default App;
