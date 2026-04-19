import { createElement } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, Pencil, Trash2 } from "lucide-react";
import { getCategoryStyle } from "../lib/categoryColors";
import { getCategoryIcon } from "../lib/categoryIcons";

function getDateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDueDateMeta(dueDate) {
  if (!dueDate) return null;

  const [year, month, day] = dueDate.split("-").map(Number);
  const due = getDateOnly(new Date(year, month - 1, day));
  const longFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const fullLabel = longFormatter.format(due);

  return { fullLabel };
}

function SortableTaskCard({
  t,
  categoryIcons,
  deleteTask,
  openTaskEditor,
  toggleTaskCompleted,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: t.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const CategoryIcon = getCategoryIcon(t.category, categoryIcons);
  const dueDateMeta = getDueDateMeta(t.dueDate);

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`task-card ${t.completed ? "completed" : ""}`}
        style={getCategoryStyle(t.category)}
        {...attributes}
        {...listeners}
      >
        <CardContent className="task-card-content">
          <div className="task-left">
            <button
              className="task-icon-button"
              type="button"
              aria-label={`Mark ${t.title || t.text || "task"} as ${
                t.completed ? "incomplete" : "complete"
              }`}
              aria-pressed={t.completed}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => toggleTaskCompleted(t.id)}
            >
              {t.completed ? (
                <Check size={17} strokeWidth={2.45} />
              ) : (
                createElement(CategoryIcon, {
                  size: 17,
                  strokeWidth: 2.35,
                })
              )}
            </button>

            <div className="task-text-group">
              <span className={`task-title ${t.completed ? "completed" : ""}`}>
                {t.title || t.text || "Untitled Task"}
              </span>

              {dueDateMeta && (
                <span className="task-date-line">{dueDateMeta.fullLabel}</span>
              )}

              {t.details && <span className="task-details">{t.details}</span>}

              {t.category && (
                <div className="task-meta-row">
                  <span
                    className="task-category-badge"
                    style={getCategoryStyle(t.category)}
                  >
                    {t.category}
                  </span>
                </div>
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
