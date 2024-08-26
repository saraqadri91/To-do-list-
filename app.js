var inputContent = document.getElementById("task-input");
var listContainer = document.getElementById("list-container");
var totalTasks = document.getElementById("total-tasks");
var completedTasks = document.getElementById("completed-tasks");

function updateTaskStats() {
    totalTasks.textContent = listContainer.children.length;
    completedTasks.textContent = document.querySelectorAll('.task-checkbox:checked').length;
}

function addTask() {
    if (inputContent.value.trim() === "") {
        Swal.fire({
            title: "Oops!",
            text: "You can't add an empty task!",
            icon: "warning"
        });
    } else {
        var li = document.createElement("li");
        var now = new Date();
        li.setAttribute('data-date', `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.onclick = function() {
            if (checkbox.checked) {
                taskText.classList.add("completed");
            } else {
                taskText.classList.remove("completed");
            }
            updateTaskStats();
            saveData();  
        };

        var taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = inputContent.value;

        var taskIcons = document.createElement("div");
        taskIcons.className = "task-icons";

        var editIcon = document.createElement("i");
        editIcon.className = "fas fa-edit task-icon edit-icon";
        editIcon.onclick = function() {
            Swal.fire({
                title: "Edit your task",
                input: "text",
                inputValue: taskText.textContent,
                showCancelButton: true,
                confirmButtonText: "Save",
                preConfirm: (newTask) => {
                    if (newTask && newTask.trim() !== "") {
                        taskText.textContent = newTask;
                        saveData();  
                    }
                }
            });
        };

        var deleteIcon = document.createElement("i");
        deleteIcon.className = "fas fa-trash task-icon delete-icon";
        deleteIcon.onclick = function() {
            listContainer.removeChild(li);
            updateTaskStats();
            saveData();  
        };

        taskIcons.append(editIcon);
        taskIcons.append(deleteIcon);

        li.append(checkbox);
        li.append(taskText);
        li.append(taskIcons);

        listContainer.append(li);

        inputContent.value = "";
        updateTaskStats();
        saveData();  
    }
}

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showList() {
    listContainer.innerHTML = localStorage.getItem("data");
    // Reattach event listeners after loading data from localStorage
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.onclick = function() {
            var taskText = this.nextSibling; 
            if (this.checked) {
                taskText.classList.add("completed");
            } else {
                taskText.classList.remove("completed");
            }
            updateTaskStats();
            saveData();
        };
    });

    document.querySelectorAll('.edit-icon').forEach(editIcon => {
        editIcon.onclick = function() {
            var taskText = this.parentElement.previousSibling; 
            Swal.fire({
                title: "Edit your task",
                input: "text",
                inputValue: taskText.textContent,
                showCancelButton: true,
                confirmButtonText: "Save",
                preConfirm: (newTask) => {
                    if (newTask && newTask.trim() !== "") {
                        taskText.textContent = newTask;
                        saveData();
                    }
                }
            });
        };
    });

    document.querySelectorAll('.delete-icon').forEach(deleteIcon => {
        deleteIcon.onclick = function() {
            listContainer.removeChild(this.closest('li'));
            updateTaskStats();
            saveData();
        };
    });

    updateTaskStats();
}

showList();  
