// Dark Mode
var themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }

});


// Projects
var projects = [
    {
        id: 1,
        name: "Website Design",
        description: "Design and develop a simple personal website.",
        deadline: "2026-09-20",
        status: "in-progress",

        tasks: [
            {
                name: "Choose website design",
                completed: true
            },
            {
                name: "Create HTML pages",
                completed: false
            }
        ]
    },

    {
        id: 2,
        name: "Study Project",
        description: "Organize study materials and finish important tasks.",
        deadline: "2026-10-01",
        status: "not-started",

        tasks: [
            {
                name: "Prepare materials",
                completed: false
            }
        ]
    },

    {
        id: 3,
        name: "Life Dashboard",
        description: "Create a dashboard to organize daily life.",
        deadline: "2026-09-05",
        status: "completed",

        tasks: [
            {
                name: "Finish all pages",
                completed: true
            }
        ]
    }
];


// Elements
var projectsContainer =
    document.getElementById("projectsContainer");

var addProjectBtn =
    document.getElementById("addProjectBtn");

var projectModal =
    document.getElementById("projectModal");

var closeModal =
    document.getElementById("closeModal");

var projectForm =
    document.getElementById("projectForm");

var projectName =
    document.getElementById("projectName");

var projectDescription =
    document.getElementById("projectDescription");

var projectDeadline =
    document.getElementById("projectDeadline");

var projectStatus =
    document.getElementById("projectStatus");

var projectProgress =
    document.getElementById("projectProgress");

var progressValue =
    document.getElementById("progressValue");

var searchInput =
    document.getElementById("searchInput");

var currentFilter = "all";


// Calculate Progress
function calculateProgress(project) {

    if (project.tasks.length == 0) {
        return 0;
    }

    var completedTasks = 0;

    for (var i = 0; i < project.tasks.length; i++) {

        if (project.tasks[i].completed == true) {
            completedTasks++;
        }

    }

    var progress =
        (completedTasks / project.tasks.length) * 100;

    return Math.round(progress);
}


// Show Projects
function showProjects() {

    projectsContainer.innerHTML = "";

    for (var i = 0; i < projects.length; i++) {

        var project = projects[i];

        // Calculate Progress Automatically
        var projectProgressValue =
            calculateProgress(project);


        // Search
        var searchText =
            searchInput.value.toLowerCase();

        if (
            searchText != "" &&
            project.name.toLowerCase().indexOf(searchText) == -1
        ) {
            continue;
        }


        // Filter
        if (
            currentFilter != "all" &&
            project.status != currentFilter
        ) {
            continue;
        }


        // Project Card
        var card =
            document.createElement("div");

        card.className = "project-card";


        // Project Top
        var top =
            document.createElement("div");

        top.className = "project-top";


        var title =
            document.createElement("h2");

        title.textContent =
            project.name;


        var status =
            document.createElement("span");

        status.className =
            "status " + project.status;


        if (project.status == "in-progress") {

            status.textContent =
                "In Progress";

        } else if (project.status == "completed") {

            status.textContent =
                "Completed";

        } else {

            status.textContent =
                "Not Started";
        }


        top.appendChild(title);
        top.appendChild(status);

        card.appendChild(top);


        // Description
        var description =
            document.createElement("p");

        description.className =
            "project-description";

        description.textContent =
            project.description;

        card.appendChild(description);


        // Project Info
        var info =
            document.createElement("div");

        info.className =
            "project-info";


        var deadline =
            document.createElement("p");

        deadline.innerHTML =
            "<strong>Deadline:</strong> " +
            project.deadline;


        var progressText =
            document.createElement("p");

        progressText.innerHTML =
            "<strong>Progress:</strong> " +
            projectProgressValue +
            "%";


        info.appendChild(deadline);
        info.appendChild(progressText);

        card.appendChild(info);


        // Progress Bar
        var progressBar =
            document.createElement("div");

        progressBar.className =
            "progress-bar";


        var progress =
            document.createElement("div");

        progress.className =
            "progress";

        progress.style.width =
            projectProgressValue + "%";


        progressBar.appendChild(progress);

        card.appendChild(progressBar);


        // Buttons
        var buttons =
            document.createElement("div");

        buttons.className =
            "project-buttons";


        var addTask =
            document.createElement("button");

        addTask.className =
            "add-task-btn";

        addTask.textContent =
            "+ Add Task";


        // Project ID
        addTask.setAttribute(
            "data-project-id",
            project.id
        );


        addTask.addEventListener(
            "click",
            function () {

                var projectId =
                    Number(
                        this.getAttribute(
                            "data-project-id"
                        )
                    );

                openTaskModal(projectId);
            }
        );


        var edit =
            document.createElement("button");

        edit.className =
            "edit-btn";

        edit.textContent =
            "Edit";


        edit.setAttribute(
            "data-project-id",
            project.id
        );


        edit.addEventListener(
            "click",
            function () {

                var projectId =
                    Number(
                        this.getAttribute(
                            "data-project-id"
                        )
                    );

                editProject(projectId);
            }
        );


        var deleteBtn =
            document.createElement("button");

        deleteBtn.className =
            "delete-btn";

        deleteBtn.textContent =
            "Delete";


        deleteBtn.setAttribute(
            "data-project-id",
            project.id
        );


        deleteBtn.addEventListener(
            "click",
            function () {

                var projectId =
                    Number(
                        this.getAttribute(
                            "data-project-id"
                        )
                    );

                deleteProject(projectId);
            }
        );


        buttons.appendChild(addTask);
        buttons.appendChild(edit);
        buttons.appendChild(deleteBtn);

        card.appendChild(buttons);


        // Tasks
        var tasks =
            document.createElement("div");

        tasks.className =
            "tasks";


        var tasksTitle =
            document.createElement("h3");

        tasksTitle.textContent =
            "Project Tasks";

        tasks.appendChild(tasksTitle);


        // Show Tasks
        for (
            var j = 0;
            j < project.tasks.length;
            j++
        ) {

            var task =
                document.createElement("div");

            task.className =
                "task";


            var taskLeft =
                document.createElement("div");

            taskLeft.className =
                "task-left";


            // Checkbox
            var checkbox =
                document.createElement("input");

            checkbox.type =
                "checkbox";

            checkbox.checked =
                project.tasks[j].completed;


            checkbox.setAttribute(
                "data-project-id",
                project.id
            );

            checkbox.setAttribute(
                "data-task-index",
                j
            );


            checkbox.addEventListener(
                "change",
                function () {

                    var projectId =
                        Number(
                            this.getAttribute(
                                "data-project-id"
                            )
                        );

                    var taskIndex =
                        Number(
                            this.getAttribute(
                                "data-task-index"
                            )
                        );


                    for (
                        var x = 0;
                        x < projects.length;
                        x++
                    ) {

                        if (
                            projects[x].id ==
                            projectId
                        ) {

                            projects[x]
                                .tasks[taskIndex]
                                .completed =
                                this.checked;
                        }
                    }


                    // Update Progress Automatically
                    showProjects();

                }
            );


            var taskText =
                document.createElement("span");

            taskText.textContent =
                project.tasks[j].name;


            if (
                project.tasks[j].completed
            ) {

                taskText.className =
                    "completed-task";
            }


            taskLeft.appendChild(checkbox);
            taskLeft.appendChild(taskText);


            task.appendChild(taskLeft);

            tasks.appendChild(task);
        }


        card.appendChild(tasks);

        projectsContainer.appendChild(card);
    }


    updateStats();
}


// Add Project
addProjectBtn.addEventListener(
    "click",
    function () {

        projectForm.reset();

        projectProgress.value = 0;

        progressValue.textContent = "0";

        projectModal.style.display = "flex";
    }
);


// Close Project Modal
closeModal.addEventListener(
    "click",
    function () {

        projectModal.style.display =
            "none";

    }
);


// Progress Range
projectProgress.addEventListener(
    "input",
    function () {

        progressValue.textContent =
            projectProgress.value;

    }
);


// Save Project
projectForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        var newProject = {

            id: Date.now(),

            name:
                projectName.value,

            description:
                projectDescription.value,

            deadline:
                projectDeadline.value,

            status:
                projectStatus.value,

            tasks: []

        };


        projects.push(newProject);

        projectModal.style.display =
            "none";

        showProjects();

    }
);


// Delete Project
function deleteProject(id) {

    var newProjects = [];


    for (
        var i = 0;
        i < projects.length;
        i++
    ) {

        if (projects[i].id != id) {

            newProjects.push(
                projects[i]
            );
        }
    }


    projects = newProjects;

    showProjects();
}


// Edit Project
function editProject(id) {

    var project;


    for (
        var i = 0;
        i < projects.length;
        i++
    ) {

        if (projects[i].id == id) {

            project =
                projects[i];
        }
    }


    if (project) {

        projectName.value =
            project.name;

        projectDescription.value =
            project.description;

        projectDeadline.value =
            project.deadline;

        projectStatus.value =
            project.status;

        projectProgress.value =
            calculateProgress(project);

        progressValue.textContent =
            calculateProgress(project);

        projectModal.style.display =
            "flex";
    }
}


// Search
searchInput.addEventListener(
    "input",
    function () {

        showProjects();

    }
);


// Filters
var filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


for (
    var i = 0;
    i < filterButtons.length;
    i++
) {

    filterButtons[i].addEventListener(
        "click",
        function () {

            currentFilter =
                this.getAttribute(
                    "data-filter"
                );

            showProjects();

        }
    );
}


// Statistics
function updateStats() {

    var total =
        projects.length;

    var inProgress =
        0;

    var completed =
        0;

    var upcoming =
        0;


    for (
        var i = 0;
        i < projects.length;
        i++
    ) {

        if (
            projects[i].status ==
            "in-progress"
        ) {

            inProgress++;
        }


        if (
            projects[i].status ==
            "completed"
        ) {

            completed++;
        }


        if (
            projects[i].status !=
            "completed"
        ) {

            upcoming++;
        }

    }


    document.getElementById(
        "totalProjects"
    ).textContent = total;


    document.getElementById(
        "inProgress"
    ).textContent = inProgress;


    document.getElementById(
        "completedProjects"
    ).textContent = completed;


    document.getElementById(
        "upcomingProjects"
    ).textContent = upcoming;
}


// Task Modal
var taskModal =
    document.getElementById(
        "taskModal"
    );


var closeTaskModal =
    document.getElementById(
        "closeTaskModal"
    );


var taskForm =
    document.getElementById(
        "taskForm"
    );


var taskNameInput =
    document.getElementById(
        "taskName"
    );


var selectedProjectId =
    null;


// Open Task Modal
function openTaskModal(projectId) {

    selectedProjectId =
        projectId;

    taskForm.reset();

    taskModal.style.display =
        "flex";
}


// Close Task Modal
closeTaskModal.addEventListener(
    "click",
    function () {

        taskModal.style.display =
            "none";

    }
);


// Add Task
taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        for (
            var i = 0;
            i < projects.length;
            i++
        ) {

            if (
                projects[i].id ==
                selectedProjectId
            ) {

                projects[i].tasks.push({

                    name:
                        taskNameInput.value,

                    completed:
                        false
                });
            }
        }


        taskModal.style.display =
            "none";


        showProjects();

    }
);


// Start
showProjects();