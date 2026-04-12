function TaskForm({ newTask, handleChange, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={newTask}
        onChange={handleChange}
        placeholder="Add a new task"
        className="todo-input"
      />
      <button type="submit" className="todo-add-button">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
