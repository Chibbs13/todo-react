function CategorySidebar({ categories, onAddCategory }) {
  return (
    <aside className="category-sidebar">
      <h2 className="category-title">Categories</h2>

      <div className="category-list">
        {categories.map((category, index) => (
          <button key={index} className="category-item" type="button">
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
