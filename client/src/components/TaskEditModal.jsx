import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

function TaskEditModal({
  selectedTask,
  editText,
  setEditText,
  closeTaskEditor,
  saveTaskEdit,
}) {
  if (!selectedTask) return null;

  return (
    <div className="task-overlay" onClick={closeTaskEditor}>
      <Card className="task-modal" onClick={(e) => e.stopPropagation()}>
        <CardContent className="task-modal-content">
          <div className="task-modal-header">
            <span className="drag-indicator">⋮⋮</span>
            <h2 className="modal-title">Edit Task</h2>
          </div>

          <textarea
            className="modal-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows="5"
          />

          <div className="modal-actions">
            <Button onClick={saveTaskEdit}>Save</Button>
            <Button variant="secondary" onClick={closeTaskEditor}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TaskEditModal;
