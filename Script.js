function loadTasks() {
  const storedTasks = JSON.parse(localStorage.getItem("tasks"));
  if (storedTasks) {
    storedTasks.sort((a, b) => parseInt(a.priority) - parseInt(b.priority));
    storedTasks.forEach((task) => {
      createTask(task.text, task.dueDate, task.priority);
    });
  }
}

function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(
    (taskItem) => {
      const taskText = taskItem.querySelector("span").textContent;
      const dueDate = taskItem.querySelector(".due-date").textContent;
      const priority = taskItem.getAttribute("data-priority");

      return {
        text: taskText,
        dueDate: dueDate,
        priority: priority,
      };
    }
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

window.addEventListener("load", loadTasks);

const taskInput = document.getElementById("task");
const addBtn = document.getElementById("add");

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();

  if (taskText !== "") {
    createTask(taskText);
    taskInput.value = "";
    saveTasks();
  }
});

function createTask(text, dueDate = "", priority = 3) {
  const taskItem = document.createElement("li");
  taskItem.innerHTML = `
        <input type="checkbox" class="check"/>
        <span>${text}</span>
        <span class="due-date">${dueDate}</span>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
        <button class="dropdown-btn">...</button>
        <div id="dropdown-content">
                <a href="#" class="set-due-date">Set Due Date</a>
                <a href="#" class="prioritize-task">Prioritize task</a>
            </div>
        
        
    `;

  taskList.appendChild(taskItem);

  const deleteBtn = taskItem.querySelector(".delete");
  deleteBtn.addEventListener("click", () => {
    taskItem.remove();
    saveTasks();
  });

  const editBtn = taskItem.querySelector(".edit");
  editBtn.addEventListener("click", () => {
    const spanElement = taskItem.querySelector("span");
    const currentText = spanElement.textContent;
    const newText = prompt("Edit the task:", currentText);
    if (newText !== null && newText.trim() !== "") {
      spanElement.textContent = newText;
    }
    saveTasks();
  });
  taskItem.addEventListener("change", (event) => {
    if (event.target.classList.contains("check")) {
      taskItem.classList.toggle("completed");
      if (taskItem.classList.contains("completed")) {
        const buttons = taskItem.querySelector(".edit");
        buttons.disabled = true;
        const button2 = taskItem.querySelector(".dropdown-btn");
        button2.disabled = true;
      } else {
        const buttons = taskItem.querySelector(".edit");
        buttons.disabled = false;
        const button2 = taskItem.querySelector(".dropdown-btn");
        button2.disabled = false;
      }
    }
  });

  const setDueDateLink = taskItem.querySelector(".set-due-date");
  setDueDateLink.addEventListener("click", (event) => {
    event.preventDefault();
    const dueDate = prompt("Set the due date for this task (YYYY-MM-DD):");
    if (dueDate) {
      const dueDateSpan = taskItem.querySelector(".due-date");
      const check = new Date(dueDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      check.setHours(0, 0, 0, 0);
      if (isValidDate(dueDate) && check >= currentDate) {
        if (check.toDateString() === currentDate.toDateString()) {
          taskItem.style.backgroundColor = "red";
          const checkbox = taskItem.querySelector(".check");
          checkbox.style.display = "none";
          const buttons = taskItem.querySelector(".edit");
          buttons.disabled = true;
          alert("Task expired");
          saveTasks();
        }
        dueDateSpan.textContent = dueDate;
        console.log(dueDateSpan);
        saveTasks();
      } else {
        alert("Enter a valid date");
      }
    }
  });

  const prioritizeTaskLink = taskItem.querySelector(".prioritize-task");
  prioritizeTaskLink.addEventListener("click", (event) => {
    event.preventDefault();

    const priority = prompt("Set the priority (1-3) for this task:");
    if (priority >= 1 && priority <= 3) {
      taskItem.setAttribute("data-priority", priority);
      prioritizeTasks();
      saveTasks();
    } else {
      alert("Please enter a priority between 1 and 3.");
    }
  });
  taskItem.setAttribute("data-priority", priority);
  const dropdownBtn = taskItem.querySelector(".dropdown-btn");
  const dropdownContent = taskItem.querySelector("#dropdown-content");

  dropdownBtn.addEventListener("click", () => {
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  });

  // dropdownBtn.addEventListener("mouseover", () => {
  //   dropdownContent.style.display = "block";
  // });

  // dropdownContent.addEventListener("mouseleave", () => {
  //   dropdownContent.style.display = "none";
  // });
}
function prioritizeTasks() {
  const taskList = document.getElementById("taskList");
  const tasks = Array.from(taskList.querySelectorAll("li"));

  tasks.sort((a, b) => {
    return (
      parseInt(a.getAttribute("data-priority")) -
      parseInt(b.getAttribute("data-priority"))
    );
  });

  tasks.forEach((task) => taskList.appendChild(task));
}
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date);
}
