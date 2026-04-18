import { useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

function CategoryModal({
  isOpen,
  newCategory,
  setNewCategory,
  closeCategoryModal,
  saveCategory,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeCategoryModal();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeCategoryModal, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="task-overlay" onClick={closeCategoryModal}>
      <Card
        className="category-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
      >
        <CardContent className="category-modal-content">
          <form
            className="task-modal-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveCategory();
            }}
          >
            <div className="task-modal-header">
              <h2 className="modal-title" id="category-modal-title">
                Add New Category
              </h2>
            </div>

            <label className="modal-field">
              <span className="modal-label">Name</span>
              <input
                type="text"
                className="modal-title-input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                ref={inputRef}
              />
            </label>

            <div className="modal-actions">
              <Button type="submit">Add Category</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={closeCategoryModal}
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

export default CategoryModal;
