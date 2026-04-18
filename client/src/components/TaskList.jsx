import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";

function TaskList({
  tasks,
  selectedCategory,
  deleteTask,
  openTaskEditor,
  toggleTaskCompleted,
}) {
  const emptyMessage =
    selectedCategory === "All Tasks"
      ? "Nothing here yet. Add a task and give your brain some breathing room."
      : `No ${selectedCategory} tasks. A rare and beautiful sight.`;

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
