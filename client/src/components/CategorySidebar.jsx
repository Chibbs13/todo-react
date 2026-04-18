import { getCategoryStyle } from "../lib/categoryColors";

function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}) {
  return (
    <aside className="category-sidebar">
      <h2 className="category-title">Categories</h2>

      <div className="category-list">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-item ${
              selectedCategory === category ? "active" : ""
            }`}
            style={getCategoryStyle(category)}
            type="button"
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
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
