import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";

function TaskList({
  tasks,
  selectedCategory,
  categoryIcons,
  deleteTask,
  openTaskEditor,
  toggleTaskCompleted,
}) {
  const emptyMessage =
    selectedCategory === "General"
      ? "Let's check off some boxes. Add your first task to get rolling."
      : `No ${selectedCategory} tasks yet. This list is ready when you are.`;

  return (
    <SortableContext
      items={tasks.map((t) => t.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">{emptyMessage}</p>
        ) : (
          tasks.map((t) => (
            <SortableTaskCard
              key={t.id}
              t={t}
              categoryIcons={categoryIcons}
              deleteTask={deleteTask}
              openTaskEditor={openTaskEditor}
              toggleTaskCompleted={toggleTaskCompleted}
            />
          ))
        )}
      </div>
    </SortableContext>
  );
}

export default TaskList;
