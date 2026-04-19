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

const GENERAL_CATEGORY = "General";
const DEFAULT_CATEGORIES = [GENERAL_CATEGORY, "Work", "Home", "Gym"];

function normalizeCategory(category) {
  return category === "All Tasks" ? GENERAL_CATEGORY : category;
}

function App() {
  const [task, setTask] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (!savedTasks) return [];

    try {
      return JSON.parse(savedTasks).map((taskItem) => ({
        ...taskItem,
        category: normalizeCategory(taskItem.category),
      }));
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

      return Array.from(
        new Set([GENERAL_CATEGORY, ...parsedCategories.map(normalizeCategory)]),
      );
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState(GENERAL_CATEGORY);
  const [categoryIcons, setCategoryIcons] = useState(() => {
    const savedCategoryIcons = localStorage.getItem("categoryIcons");

    if (!savedCategoryIcons) return DEFAULT_CATEGORY_ICONS;

    try {
      const parsedCategoryIcons = JSON.parse(savedCategoryIcons);
      const normalizedCategoryIcons = Object.fromEntries(
        Object.entries(parsedCategoryIcons).map(([category, icon]) => [
          normalizeCategory(category),
          icon,
        ]),
      );

      return { ...DEFAULT_CATEGORY_ICONS, ...normalizedCategoryIcons };
    } catch {
      return DEFAULT_CATEGORY_ICONS;
    }
  });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [taskCategory, setTaskCategory] = useState(GENERAL_CATEGORY);
  const [taskDueDate, setTaskDueDate] = useState("");
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [showCleanupPrompt, setShowCleanupPrompt] = useState(false);
  const [categoryNotifications, setCategoryNotifications] = useState([]);
  const celebrationTimeoutRef = useRef(null);
  const cleanupPromptTimeoutRef = useRef(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
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
    selectedCategory === GENERAL_CATEGORY
      ? task
      : task.filter((taskItem) => taskItem.category === selectedCategory);
  const completedTaskCount = visibleTasks.filter(
    (taskItem) => taskItem.completed,
  ).length;
  const progressPercent =
    visibleTasks.length === 0
      ? 0
      : Math.round((completedTaskCount / visibleTasks.length) * 100);
  const visibleTasksComplete =
    visibleTasks.length > 0 && completedTaskCount === visibleTasks.length;
  const todayLabel = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "short",
    day: "numeric",
  }).format(new Date());
  const defaultTaskCategory =
    selectedCategory === GENERAL_CATEGORY
      ? categories[1] || GENERAL_CATEGORY
      : selectedCategory;
  const progressLabel =
    selectedCategory === GENERAL_CATEGORY
      ? "Total Progress"
      : `${selectedCategory} Progress`;

  useEffect(() => {
    return () => {
      window.clearTimeout(celebrationTimeoutRef.current);
      window.clearTimeout(cleanupPromptTimeoutRef.current);
    };
  }, []);

  function startCelebration() {
    window.clearTimeout(celebrationTimeoutRef.current);
    window.clearTimeout(cleanupPromptTimeoutRef.current);
    setIsCelebrating(true);
    setShowCleanupPrompt(false);

    celebrationTimeoutRef.current = window.setTimeout(() => {
      setIsCelebrating(false);
    }, 2200);

    cleanupPromptTimeoutRef.current = window.setTimeout(() => {
      setShowCleanupPrompt(true);
    }, 5200);
  }

  function showCategoryNotification(category) {
    setCategoryNotifications((currentNotifications) =>
      currentNotifications.includes(category)
        ? currentNotifications
        : [...currentNotifications, category],
    );
  }

  function selectCategory(category) {
    setSelectedCategory(category);
    setCategoryNotifications((currentNotifications) =>
      currentNotifications.filter((item) => item !== category),
    );
  }

  function openAddTaskModal() {
    setIsAddingTask(true);
    setSelectedTask(null);
    setTaskTitle("");
    setTaskDetails("");
    setTaskCategory(defaultTaskCategory);
    setTaskDueDate("");
  }

  function openTaskEditor(taskItem) {
    setIsAddingTask(false);
    setSelectedTask(taskItem);
    setTaskTitle(taskItem.title || taskItem.text || "");
    setTaskDetails(taskItem.details || "");
    setTaskCategory(normalizeCategory(taskItem.category) || GENERAL_CATEGORY);
    setTaskDueDate(taskItem.dueDate || "");
  }

  const closeTaskModal = useCallback(function closeTaskModal() {
    setIsAddingTask(false);
    setSelectedTask(null);
    setTaskTitle("");
    setTaskDetails("");
    setTaskCategory(GENERAL_CATEGORY);
    setTaskDueDate("");
  }, []);

  function saveTask() {
    if (!taskTitle.trim()) return;

    if (isAddingTask) {
      const newTaskObj = {
        id: Date.now(),
        title: taskTitle,
        details: taskDetails,
        category: taskCategory,
        dueDate: taskDueDate,
        completed: false,
      };

      setTask([...task, newTaskObj]);
      showCategoryNotification(taskCategory);
    } else if (selectedTask) {
      setTask(
        task.map((t) =>
          t.id === selectedTask.id
            ? {
                ...t,
                title: taskTitle,
                details: taskDetails,
                category: taskCategory,
                dueDate: taskDueDate,
              }
            : t,
        ),
      );
    }

    closeTaskModal();
  }

  function deleteTask(id) {
    setTask(task.filter((t) => t.id !== id));
    setShowCleanupPrompt(false);

    if (selectedTask && selectedTask.id === id) {
      closeTaskModal();
    }
  }

  function deleteCompletedVisibleTasks() {
    const visibleTaskIds = new Set(visibleTasks.map((taskItem) => taskItem.id));

    setTask(
      task.filter(
        (taskItem) =>
          !visibleTaskIds.has(taskItem.id) || !taskItem.completed,
      ),
    );
    setShowCleanupPrompt(false);
  }

  function toggleTaskCompleted(id) {
    const nextTasks = task.map((taskItem) =>
      taskItem.id === id
        ? { ...taskItem, completed: !taskItem.completed }
        : taskItem,
    );
    const nextVisibleTasks =
      selectedCategory === GENERAL_CATEGORY
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
    setEditingCategory(null);
    setNewCategory("");
    setNewCategoryIcon("tag");
  }

  function openEditCategoryModal(category) {
    if (category === GENERAL_CATEGORY) return;

    setIsAddingCategory(true);
    setEditingCategory(category);
    setNewCategory(category);
    setNewCategoryIcon(categoryIcons[category] || "tag");
  }

  const closeCategoryModal = useCallback(function closeCategoryModal() {
    setIsAddingCategory(false);
    setEditingCategory(null);
    setNewCategory("");
    setNewCategoryIcon("tag");
  }, []);

  function saveCategory() {
    const trimmed = newCategory.trim();

    if (!trimmed) return;
    if (trimmed === GENERAL_CATEGORY && editingCategory !== GENERAL_CATEGORY) {
      return;
    }
    if (categories.includes(trimmed) && trimmed !== editingCategory) return;

    if (editingCategory) {
      setCategories(
        categories.map((category) =>
          category === editingCategory ? trimmed : category,
        ),
      );
      setTask(
        task.map((taskItem) =>
          taskItem.category === editingCategory
            ? { ...taskItem, category: trimmed }
            : taskItem,
        ),
      );
      setCategoryIcons((currentIcons) => {
        const { [editingCategory]: _oldIcon, ...remainingIcons } =
          currentIcons;

        return { ...remainingIcons, [trimmed]: newCategoryIcon };
      });

      if (selectedCategory === editingCategory) {
        setSelectedCategory(trimmed);
      }
      if (taskCategory === editingCategory) {
        setTaskCategory(trimmed);
      }

      closeCategoryModal();
      return;
    }

    if (categories.length >= 8) return;

    setCategories([...categories, trimmed]);
    setCategoryIcons({ ...categoryIcons, [trimmed]: newCategoryIcon });
    setSelectedCategory(trimmed);
    closeCategoryModal();
  }

  function deleteCategory(category) {
    if (category === GENERAL_CATEGORY) return;

    setCategories(categories.filter((item) => item !== category));
    setCategoryIcons((currentIcons) => {
      const { [category]: _deletedIcon, ...remainingIcons } = currentIcons;

      return remainingIcons;
    });
    setTask(
      task.map((taskItem) =>
        taskItem.category === category
          ? { ...taskItem, category: GENERAL_CATEGORY }
          : taskItem,
      ),
    );

    if (selectedCategory === category) {
      setSelectedCategory(GENERAL_CATEGORY);
    }
    if (taskCategory === category) {
      setTaskCategory(GENERAL_CATEGORY);
    }
  }

  return (
    <main className="app">
      <div className="dashboard-layout">
        <CategorySidebar
          categories={categories}
          categoryIcons={categoryIcons}
          categoryNotifications={categoryNotifications}
          selectedCategory={selectedCategory}
          onSelectCategory={selectCategory}
          onAddCategory={openAddCategoryModal}
          onEditCategory={openEditCategoryModal}
          onDeleteCategory={deleteCategory}
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
                <p className="progress-label">{progressLabel}</p>
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

              {visibleTasksComplete && showCleanupPrompt && (
                <div className="cleanup-prompt">
                  <span>Nice work. Clear completed tasks?</span>
                  <button type="button" onClick={deleteCompletedVisibleTasks}>
                    Clear completed
                  </button>
                </div>
              )}
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
              categoryIcons={categoryIcons}
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
        taskDueDate={taskDueDate}
        setTaskDueDate={setTaskDueDate}
        categories={categories}
        categoryIcons={categoryIcons}
        getCategoryStyle={getCategoryStyle}
        closeTaskModal={closeTaskModal}
        saveTask={saveTask}
        saveLabel={isAddingTask ? "Add Task" : "Save"}
      />

      <CategoryModal
        isOpen={isAddingCategory}
        modalTitle={editingCategory ? "Edit Category" : "Add New Category"}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newCategoryIcon={newCategoryIcon}
        setNewCategoryIcon={setNewCategoryIcon}
        closeCategoryModal={closeCategoryModal}
        saveCategory={saveCategory}
        saveLabel={editingCategory ? "Save Category" : "Add Category"}
      />
    </main>
  );
}

export default App;
