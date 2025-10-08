const input = document.getElementById("text");
const dueTimeInput = document.getElementById("dueTime");
const allTasksDiv = document.getElementById("allTasks");
const completedTasksDiv = document.getElementById("completedTasks");
const deletedTasksDiv = document.getElementById("deletedTasks");

function add() {
  const task = input.value.trim();
  const dueTime = dueTimeInput.value;

  if (task === "") {
    alert("Please enter a task");
    return;
  }
  if (dueTime === "") {
    alert("Please set a due date and time");
    return;
  }

  createTaskBox(task, dueTime, allTasksDiv);
  input.value = "";
  dueTimeInput.value = "";
  input.focus();
}

// Function to create a task box
function createTaskBox(task, dueTime, parentDiv) {
  const newBox = document.createElement("div");
  newBox.className = "task-box";

  const taskText = document.createElement("span");
  taskText.textContent = task;

  const timeSpan = document.createElement("span");
  const formattedTime = new Date(dueTime).toLocaleString();
  timeSpan.textContent = "Due: " + formattedTime;

  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";
  completeBtn.className = "complete";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete";

  newBox.appendChild(taskText);
  newBox.appendChild(timeSpan);
  newBox.appendChild(completeBtn);
  newBox.appendChild(deleteBtn);

  parentDiv.appendChild(newBox);

  //Move to completed tasks
  completeBtn.addEventListener("click", () => {
    const currentTime = new Date();
    const taskDueTime = new Date(dueTime); // the due date/time chosen

    if (currentTime >= taskDueTime) {
        alert(`Task "${task}" is completed after the due time!`);
    }

    // Mark task as complete anyway
    taskText.classList.add("completed");
    newBox.style.backgroundColor = "lightgreen";
    completeBtn.disabled = true;
    completeBtn.textContent = "Done!";

    // Optional: show completion time
    const completionSpan = document.createElement("span");
    completionSpan.textContent = "Completed on: " + currentTime.toLocaleString();
    completionSpan.style.marginLeft = "10px";
    completionSpan.style.fontSize = "12px";
    completionSpan.style.fontStyle = "italic";
    newBox.appendChild(completionSpan);

    // Clone for Completed Tasks section
    const completedCopy = newBox.cloneNode(true);
    const copyCompleteBtn = completedCopy.querySelector(".complete");
    const copyDeleteBtn = completedCopy.querySelector(".delete");
    if (copyCompleteBtn) copyCompleteBtn.remove();
    if (copyDeleteBtn) copyDeleteBtn.remove();
    completedTasksDiv.appendChild(completedCopy);
});

    
   
 

  //  Move to deleted tasks
  deleteBtn.addEventListener("click", () => {
    newBox.remove(); // remove from current section
    deletedTasksDiv.appendChild(newBox);
    completeBtn.remove(); // no need to "complete" after deletion
    deleteBtn.remove();   // avoid repeated deletes
  });
}

//Function to toggle between sections
function showSection(sectionId) {
  allTasksDiv.classList.add("hidden");
  completedTasksDiv.classList.add("hidden");
  deletedTasksDiv.classList.add("hidden");

  document.getElementById(sectionId).classList.remove("hidden");
}
