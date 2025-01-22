const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const tasksRouter = require("../api/tasks"); // Path to the tasks router

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Use tasksRouter for /tasks
app.use("/tasks", tasksRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to your persistent To-Do List App!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
