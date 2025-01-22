const apiUrl = "http://localhost:3000/tasks";

// Fetch tasks from the backend
async function fetchTasks() {
    try {
        const response = await fetch(apiUrl);
        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = ""; // Clear existing tasks

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        const taskTitle = document.createElement("span");
        taskTitle.className = `task-title ${task.completed ? "completed" : ""}`;
        taskTitle.textContent = task.title;

        // Ensure task title wraps into two lines if it's longer than 30 characters
        if (task.title.length > 30) {
            const firstLine = task.title.slice(0, 30).trim();
            const secondLine = task.title.slice(30).trim();
            taskTitle.innerHTML = `${firstLine}<br>${secondLine}`;
        }

        const buttonsDiv = document.createElement("div");
        buttonsDiv.className = "buttons";

        // Add toggle button
        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = task.completed ? "Undo" : "Complete";
        toggleBtn.className = "toggle-btn";
        toggleBtn.addEventListener("click", () => toggleTask(task.id));

        // Add delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        buttonsDiv.appendChild(toggleBtn);
        buttonsDiv.appendChild(deleteBtn);

        li.appendChild(taskTitle);
        li.appendChild(buttonsDiv);
        taskList.appendChild(li);
    });
}

// Add a new task
async function addTask() {
    const taskInput = document.getElementById("new-task");
    const task = taskInput.value.trim();

    if (!task) {
        alert("Task content is required!");
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task })
        });

        if (response.ok) {
            fetchTasks(); // Refresh tasks
            taskInput.value = ""; // Clear input field
        }
    } catch (error) {
        console.error("Error adding task:", error);
    }
}

// Toggle task completion
async function toggleTask(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: "PUT" });
        if (response.ok) {
            fetchTasks(); // Refresh tasks
        }
    } catch (error) {
        console.error("Error toggling task:", error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        if (response.ok) {
            fetchTasks(); // Refresh tasks
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// Attach event listeners
document.getElementById("add-task").addEventListener("click", addTask);

// Initial fetch of tasks
fetchTasks();
