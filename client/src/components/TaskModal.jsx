import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

function TaskModal({
  isOpen,
  modalTitle,
  taskText,
  setTaskText,
  closeTaskModal,
  saveTask,
  saveLabel,
}) {
  if (!isOpen) return null;

  return (
    <div className="task-overlay" onClick={closeTaskModal}>
      <Card className="task-modal" onClick={(e) => e.stopPropagation()}>
        <CardContent className="task-modal-content">
          <div className="task-modal-header">
            <span className="drag-indicator">⋮⋮</span>
            <h2 className="modal-title">{modalTitle}</h2>
          </div>

          <textarea
            className="modal-input"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            rows="5"
            placeholder="Enter your task here..."
          />

          <div className="modal-actions">
            <Button onClick={saveTask}>{saveLabel}</Button>
            <Button variant="secondary" onClick={closeTaskModal}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskModal;
