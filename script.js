const todoInput = document.getElementById("todoInput");
const clearInputBtn = document.getElementById("clearInputBtn");
const addBtn = document.getElementById("addBtn");
const cancelBtn = document.getElementById("cancelBtn");
const todoList = document.getElementById("todoList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

function toggleClearButton() {
  if (todoInput.value.length > 0) {
    clearInputBtn.style.display = "block";
  } else {
    clearInputBtn.style.display = "none";
  }
}

todoInput.addEventListener("input", toggleClearButton);

clearInputBtn.addEventListener("click", () => {
  todoInput.value = "";
  toggleClearButton();
  todoInput.focus();
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  todoList.innerHTML = "";

  if (tasks.length === 0) {
    todoList.innerHTML = "<p class='no-task'>There is no task</p>";
    updateStats();
    return;
  }

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.classList.add("task-checkbox");

    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;
    span.classList.add("task-text");
    if (task.completed) {
      span.classList.add("completed");
    }

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("todo-actions");

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.classList.add("editBtn");
    editBtn.addEventListener("click", () => {
      todoInput.value = task.text;
      editIndex = index;
      addBtn.textContent = "Update Task";
      cancelBtn.style.display = "inline-block";
      toggleClearButton();
      todoInput.focus();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actionsDiv);

    todoList.appendChild(li);
  });

  updateStats();
}

function updateStats() {
  const stats = document.getElementById("taskStats");
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = total - completed;

  if (total > 0) {
    stats.classList.add("active-stats");
    stats.innerHTML = `<strong>${completed}</strong> completed, <strong>${pending}</strong> pending`;
  } else {
    stats.classList.remove("active-stats");
    stats.innerHTML = "";
  }
}

addBtn.addEventListener("click", () => {
  const taskText = todoInput.value.trim();
  if (taskText !== "") {
    if (editIndex !== null) {
      tasks[editIndex].text = taskText;
      editIndex = null;
      addBtn.textContent = "Add Task";
      cancelBtn.style.display = "none";
    } else {
      tasks.push({ text: taskText, completed: false });
    }
    todoInput.value = "";
    toggleClearButton();
    saveTasks();
    renderTasks();
  }
});

cancelBtn.addEventListener("click", () => {
  editIndex = null;
  todoInput.value = "";
  addBtn.textContent = "Add Task";
  cancelBtn.style.display = "none";
  toggleClearButton();
});

renderTasks();
toggleClearButton();

