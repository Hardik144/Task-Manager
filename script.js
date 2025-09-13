// Task management system with browser storage (using variables instead)
let tasks = [];
let taskIdCounter = 1;

// Initialize with sample data
function initializeTasks() {
  // Check if we have stored tasks
  const storedTasks = getTasks();
  if (storedTasks.length === 0) {
    // Add sample tasks
    tasks = [
      {
        id: 1,
        title: "Plan week study",
        description: "Make a schedule for DSA & Web dev",
        priority: "high",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        time: "09:00",
        completed: false,
      },
      {
        id: 2,
        title: "Finish project README",
        description: "Write docs before push",
        priority: "medium",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        time: "14:00",
        completed: false,
      },
    ];
    taskIdCounter = 3;
  } else {
    tasks = storedTasks;
    taskIdCounter = Math.max(...tasks.map((t) => t.id)) + 1;
  }
  saveTasks();
  updateUI();
}

// Browser storage functions with localStorage
function saveTasks() {
  try {
    localStorage.setItem("taskManager_tasks", JSON.stringify(tasks));
    localStorage.setItem("taskManager_counter", taskIdCounter.toString());
    console.log("Tasks saved to localStorage:", tasks);
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
}

function getTasks() {
  try {
    const savedTasks = localStorage.getItem("taskManager_tasks");
    const savedCounter = localStorage.getItem("taskManager_counter");

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      taskIdCounter = savedCounter ? parseInt(savedCounter) : 1;
      console.log("Tasks loaded from localStorage:", parsedTasks);
      return parsedTasks;
    }
    return [];
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
    return [];
  }
}

// Additional utility functions
function clearAllTasks() {
  try {
    localStorage.removeItem("taskManager_tasks");
    localStorage.removeItem("taskManager_counter");
    tasks = [];
    taskIdCounter = 1;
    updateUI();
    console.log("All tasks cleared from localStorage");
  } catch (error) {
    console.error("Error clearing tasks from localStorage:", error);
  }
}

function exportTasks() {
  try {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks_backup.json";
    link.click();
    URL.revokeObjectURL(url);
    console.log("Tasks exported successfully");
  } catch (error) {
    console.error("Error exporting tasks:", error);
  }
}

function importTasks(file) {
  try {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (Array.isArray(importedTasks)) {
          tasks = importedTasks;
          taskIdCounter = Math.max(...tasks.map((t) => t.id)) + 1;
          saveTasks();
          updateUI();
          console.log("Tasks imported successfully");
        } else {
          throw new Error("Invalid file format");
        }
      } catch (parseError) {
        console.error("Error parsing imported file:", parseError);
        alert("Error: Invalid file format");
      }
    };
    reader.readAsText(file);
  } catch (error) {
    console.error("Error importing tasks:", error);
  }
}

// Theme management
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle");

  if (body.getAttribute("data-theme") === "light") {
    body.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = "☀️ Light Mode";
  } else {
    body.setAttribute("data-theme", "light");
    themeToggle.innerHTML = "🌙 Dark Mode";
  }
}

// Task management functions
function addTask(taskData) {
  const newTask = {
    id: taskIdCounter++,
    title: taskData.title,
    description: taskData.description || "",
    priority: taskData.priority,
    status: "pending",
    date: taskData.date,
    time: taskData.time,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  updateUI();
}

function toggleTaskComplete(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    task.status = task.completed ? "completed" : "pending";
    saveTasks();
    updateUI();
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
  updateUI();
}

// UI update functions
function updateProgress() {
  const completedTasks = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  document.getElementById("progressText").textContent = `${progress}%`;
  document.getElementById("progressFill").style.width = `${progress}%`;
}

function updateStats() {
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const highPriority = tasks.filter((t) => t.priority === "high").length;

  document.getElementById("completedCount").textContent = completed;
  document.getElementById("pendingCount").textContent = pending;
  document.getElementById("highPriorityCount").textContent = highPriority;
}

function renderActiveTasks() {
  const activeTasks = tasks.filter((t) => !t.completed).slice(0, 3);
  const container = document.getElementById("activeTasks");

  container.innerHTML = activeTasks
    .map(
      (task) => `
                <div class="task-item">
                    <div class="task-info">
                        <div class="task-priority ${task.priority}"></div>
                        <div class="task-details">
                            <h4>${task.title}</h4>
                            <p class="task-status ${task.status}">${task.status}</p>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button onclick="toggleTaskComplete(${task.id})" title="Complete">✓</button>
                        <button onclick="editTask(${task.id})" title="Edit">✏️</button>
                        <button onclick="deleteTask(${task.id})" title="Delete">🗑️</button>
                    </div>
                </div>
            `
    )
    .join("");
}

function renderFocusTasks() {
  const focusTasks = tasks.filter((t) => !t.completed).slice(0, 3);
  const container = document.getElementById("focusTasks");

  container.innerHTML = focusTasks
    .map(
      (task) => `
                <div class="focus-task">
                    <div>
                        <h4>${task.title}</h4>
                        <p>${task.priority.toUpperCase()}</p>
                    </div>
                    <div class="checkmark ${task.completed ? "completed" : ""}" 
                         onclick="toggleTaskComplete(${task.id})"></div>
                </div>
            `
    )
    .join("");
}

function renderAllTasks() {
  const container = document.getElementById("allTasks");
  const filter = document.getElementById("filterSelect").value;

  let filteredTasks = tasks;
  if (filter === "pending") filteredTasks = tasks.filter((t) => !t.completed);
  else if (filter === "completed")
    filteredTasks = tasks.filter((t) => t.completed);
  else if (filter === "high")
    filteredTasks = tasks.filter((t) => t.priority === "high");

  container.innerHTML = filteredTasks
    .map(
      (task) => `
                <div class="task-row">
                    <div class="task-info">
                        <div class="task-priority ${task.priority}"></div>
                        <div class="task-details">
                            <h4>${task.title}</h4>
                            <p>${task.description}</p>
                        </div>
                    </div>
                    <div class="priority-badge ${task.priority}">${
        task.priority
      }</div>
                    <div class="action-buttons">
                        <button class="action-btn done" onclick="toggleTaskComplete(${
                          task.id
                        })">
                            ${task.completed ? "Undo" : "Done"}
                        </button>
                        <button class="action-btn" onclick="editTask(${
                          task.id
                        })">Edit</button>
                        <button class="action-btn delete" onclick="deleteTask(${
                          task.id
                        })">Delete</button>
                    </div>
                </div>
            `
    )
    .join("");
}

function updateUI() {
  updateProgress();
  updateStats();
  renderActiveTasks();
  renderFocusTasks();
  renderAllTasks();
}

function filterTasks() {
  renderAllTasks();
}

function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDate").value = task.date;
    document.getElementById("taskTime").value = task.time;
    document.getElementById("taskPriority").value = task.priority;
    deleteTask(taskId);
  }
}

// Form handling
document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    title: document.getElementById("taskTitle").value,
    date: document.getElementById("taskDate").value,
    time: document.getElementById("taskTime").value,
    priority: document.getElementById("taskPriority").value,
  };

  addTask(formData);
  this.reset();
});

// Initialize the app
initializeTasks();
