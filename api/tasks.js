const express = require("express");
const sqlite3 = require("better-sqlite3");

const router = express.Router();
const db = sqlite3("./todo.db");

// Ensure the table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0
  )
`);

// GET all tasks
router.get("/", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();
  res.json(tasks);
});

// POST a new task
router.post("/", (req, res) => {
  let { task } = req.body;
  if (!task || task.trim() === "") {
      return res.status(400).json({ error: "Task content is required." });
  }
  task = task.slice(0, 50); // Limit task title to 50 characters
  const stmt = db.prepare("INSERT INTO tasks (title) VALUES (?)");
  const info = stmt.run(task);
  res.status(201).json({ id: info.lastInsertRowid, title: task, completed: false });
});


// PUT (toggle task completion)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("UPDATE tasks SET completed = NOT completed WHERE id = ?");
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json({ message: "Task status updated successfully!" });
});

// DELETE a task
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = stmt.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Task not found." });
  }
  res.json({ message: "Task deleted successfully!" });
});

module.exports = router;
