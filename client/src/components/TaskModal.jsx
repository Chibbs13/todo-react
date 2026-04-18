import { useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

function TaskModal({
  isOpen,
  modalTitle,
  taskTitle,
  setTaskTitle,
  taskDetails,
  setTaskDetails,
  taskCategory,
  setTaskCategory,
  categories,
  getCategoryStyle,
  closeTaskModal,
  saveTask,
  saveLabel,
}) {
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    titleInputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeTaskModal();
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])',
      );
      const focusable = Array.from(focusableElements || []);

      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeTaskModal, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="task-overlay" onClick={closeTaskModal}>
      <Card
        className="task-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <CardContent className="task-modal-content">
          <form
            ref={modalRef}
            className="task-modal-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveTask();
            }}
          >
            <div className="task-modal-header">
              <h2 className="modal-title" id="task-modal-title">
                {modalTitle}
              </h2>
            </div>

            <label className="modal-field">
              <span className="modal-label">Title</span>
              <input
                className="modal-title-input"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title"
                ref={titleInputRef}
              />
            </label>

            <fieldset className="modal-field category-selector">
              <legend className="modal-label">Category</legend>

              <div className="category-chip-list">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-chip ${
                      taskCategory === cat ? "active" : ""
                    }`}
                    style={getCategoryStyle(cat)}
                    onClick={() => setTaskCategory(cat)}
                    aria-pressed={taskCategory === cat}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="modal-field">
              <span className="modal-label">Details</span>
              <textarea
                className="modal-input"
                value={taskDetails}
                onChange={(e) => setTaskDetails(e.target.value)}
                rows="5"
                placeholder="Enter task details..."
              />
            </label>

            <div className="modal-actions">
              <Button type="submit">{saveLabel}</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={closeTaskModal}
              >
                Close
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskModal;
