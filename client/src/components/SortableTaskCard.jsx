import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useSortable } from "@dnd-kit/sortable";
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

export default SortableTaskCard;
