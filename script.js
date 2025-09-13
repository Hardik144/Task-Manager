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

// Browser storage functions (simplified for demo)
function saveTasks() {
  // In a real implementation, this would use localStorage
  // For demo purposes, we'll just keep in memory
  console.log("Tasks saved:", tasks);
}

function getTasks() {
  // In a real implementation, this would retrieve from localStorage
  return tasks;
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
