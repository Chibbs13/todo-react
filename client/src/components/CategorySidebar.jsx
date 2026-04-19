import { Pencil, Trash2 } from "lucide-react";
import { getCategoryStyle } from "../lib/categoryColors";
import { getCategoryIcon } from "../lib/categoryIcons";

function CategorySidebar({
  categories,
  categoryIcons,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  return (
    <aside className="category-sidebar">
      <h2 className="category-title">Categories</h2>

      <div className="category-list">
        {categories.map((category) => {
          const CategoryIcon = getCategoryIcon(category, categoryIcons);
          const canManageCategory = category !== "General";

          return (
            <div
              key={category}
              className={`category-row ${
                selectedCategory === category ? "active" : ""
              }`}
              style={getCategoryStyle(category)}
            >
              <button
                className="category-item"
                type="button"
                onClick={() => onSelectCategory(category)}
              >
                <CategoryIcon size={16} strokeWidth={2.4} />
                <span>{category}</span>
              </button>

              {canManageCategory && (
                <div className="category-row-actions">
                  <button
                    type="button"
                    aria-label={`Edit ${category}`}
                    onClick={() => onEditCategory(category)}
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${category}`}
                    onClick={() => onDeleteCategory(category)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="category-add-button"
        onClick={onAddCategory}
        type="button"
      >
        + Add New
      </button>
    </aside>
  );
}

export default CategorySidebar;
