import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

function CategoryModal({
  isOpen,
  newCategory,
  setNewCategory,
  closeCategoryModal,
  saveCategory,
}) {
  if (!isOpen) return null;

  return (
    <div className="task-overlay" onClick={closeCategoryModal}>
      <Card className="category-modal" onClick={(e) => e.stopPropagation()}>
        <CardContent className="category-modal-content">
          <div className="task-modal-header">
            <span className="drag-indicator">⋮⋮</span>
            <h2 className="modal-title">Add New Category</h2>
          </div>

          <input
            type="text"
            className="modal-title-input"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name"
          />

          <div className="modal-actions">
            <Button onClick={saveCategory}>Add Category</Button>
            <Button variant="secondary" onClick={closeCategoryModal}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CategoryModal;
