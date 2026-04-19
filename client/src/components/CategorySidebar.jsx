import { getCategoryStyle } from "../lib/categoryColors";
import { getCategoryIcon } from "../lib/categoryIcons";

function CategorySidebar({
  categories,
  categoryIcons,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}) {
  return (
    <aside className="category-sidebar">
      <h2 className="category-title">Categories</h2>

      <div className="category-list">
        {categories.map((category) => {
          const CategoryIcon = getCategoryIcon(category, categoryIcons);

          return (
            <button
              key={category}
              className={`category-item ${
                selectedCategory === category ? "active" : ""
              }`}
              style={getCategoryStyle(category)}
              type="button"
              onClick={() => onSelectCategory(category)}
            >
              <CategoryIcon size={16} strokeWidth={2.4} />
              <span>{category}</span>
            </button>
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
