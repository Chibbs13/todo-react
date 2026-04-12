import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskCard from "./SortableTaskCard";

function TaskList({ tasks, deleteTask, openTaskEditor }) {
  return (
    <SortableContext
      items={tasks.map((t) => t.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks yet. Add one above.</p>
        ) : (
          tasks.map((t) => (
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
  );
}

export default TaskList;
