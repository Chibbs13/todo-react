import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

function TaskModal({
  isOpen,
  modalTitle,
  taskTitle,
  setTaskTitle,
  taskDetails,
  setTaskDetails,
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

          <input
            className="modal-title-input"
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task title"
          />

          <textarea
            className="modal-input"
            value={taskDetails}
            onChange={(e) => setTaskDetails(e.target.value)}
            rows="5"
            placeholder="Enter task details..."
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
