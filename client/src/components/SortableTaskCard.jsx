import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Pencil, Trash2 } from "lucide-react";
import { getCategoryStyle } from "../lib/categoryColors";

function SortableTaskCard({
  t,
  deleteTask,
  openTaskEditor,
  toggleTaskCompleted,
}) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: t.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`task-card ${t.completed ? "completed" : ""}`}
        style={getCategoryStyle(t.category)}
      >
        <CardContent className="task-card-content">
          <div className="task-left">
            <button
              className="task-drag-button"
              type="button"
              aria-label={`Reorder ${t.title || t.text || "task"}`}
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
            >
              <GripVertical size={18} />
            </button>

            <button
              className="task-complete-button"
              type="button"
              aria-label={`Mark ${t.title || t.text || "task"} as ${
                t.completed ? "incomplete" : "complete"
              }`}
              aria-pressed={t.completed}
              onClick={() => toggleTaskCompleted(t.id)}
            >
              {t.completed && <Check size={16} />}
            </button>

            <div className="task-text-group">
              <span className={`task-title ${t.completed ? "completed" : ""}`}>
                {t.title || t.text || "Untitled Task"}
              </span>

              {t.details && <span className="task-details">{t.details}</span>}

              {t.category && (
                <span
                  className="task-category-badge"
                  style={getCategoryStyle(t.category)}
                >
                  {t.category}
                </span>
              )}
            </div>
          </div>

          <div
            className="task-actions"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="secondary"
              size="icon"
              aria-label={`Edit ${t.title || t.text || "task"}`}
              onClick={() => openTaskEditor(t)}
            >
              <Pencil size={16} />
            </Button>

            <Button
              variant="destructive"
              size="icon"
              aria-label={`Delete ${t.title || t.text || "task"}`}
              onClick={() => deleteTask(t.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SortableTaskCard;
