import { useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { CATEGORY_ICON_OPTIONS } from "../lib/categoryIcons";

function CategoryModal({
  isOpen,
  modalTitle,
  newCategory,
  setNewCategory,
  newCategoryIcon,
  setNewCategoryIcon,
  closeCategoryModal,
  saveCategory,
  saveLabel,
}) {
  const inputRef = useRef(null);
  const selectedIconLabel =
    CATEGORY_ICON_OPTIONS.find((option) => option.id === newCategoryIcon)
      ?.label || "Tag";

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
                {modalTitle}
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

            <fieldset className="modal-field icon-selector">
              <legend className="modal-label">
                Icon <span className="selected-icon-label">{selectedIconLabel}</span>
              </legend>

              <div className="icon-choice-list">
                {CATEGORY_ICON_OPTIONS.map((option) => {
                  const CategoryIcon = option.Icon;

                  return (
                    <button
                      key={option.id}
                      className={`icon-choice ${
                        newCategoryIcon === option.id ? "active" : ""
                      }`}
                      type="button"
                      aria-label={option.label}
                      aria-pressed={newCategoryIcon === option.id}
                      onClick={() => setNewCategoryIcon(option.id)}
                    >
                      <CategoryIcon size={17} strokeWidth={2.35} />
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="modal-actions">
              <Button className="modal-primary-button" type="submit">
                {saveLabel}
              </Button>
              <Button
                className="modal-secondary-button"
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
