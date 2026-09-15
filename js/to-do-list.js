const userNameElement = document.getElementById("userName");

const savedName =
    localStorage.getItem("userName") ||
    localStorage.getItem("username") ||
    localStorage.getItem("name");

if (userNameElement) {
    userNameElement.textContent = savedName || "there";
}

function getDateAfter(days) {
    const date = new Date();

    date.setDate(date.getDate() + days);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getToday() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

function escapeHTML(text) {
    const div = document.createElement("div");

    div.textContent = text || "";

    return div.innerHTML;
}

const defaultTasks = [
    {
        id: 1,
        title: "Study JavaScript",
        category: "study",
        priority: "important",
        deadline: getDateAfter(0),
        description: "Review DOM, events and functions.",
        completed: false
    },
    {
        id: 2,
        title: "Finish university assignment",
        category: "work",
        priority: "important",
        deadline: getDateAfter(0),
        description: "Complete the remaining tasks.",
        completed: false
    },
    {
        id: 3,
        title: "Read 20 pages",
        category: "reading",
        priority: "normal",
        deadline: getDateAfter(0),
        description: "Spend some quiet time reading.",
        completed: true
    },
    {
        id: 4,
        title: "Workout for 30 minutes",
        category: "health",
        priority: "normal",
        deadline: getDateAfter(1),
        description: "Move your body and stay active.",
        completed: false
    },
    {
        id: 5,
        title: "Plan tomorrow",
        category: "personal",
        priority: "normal",
        deadline: getDateAfter(1),
        description: "Write down the most important things.",
        completed: false
    }
];

function getTasks() {
    try {
        const savedTasks = JSON.parse(
            localStorage.getItem("yomTasks")
        );

        if (Array.isArray(savedTasks) && savedTasks.length > 0) {
            return savedTasks;
        }
    } catch (error) {
        console.log("Could not load tasks.");
    }

    return defaultTasks;
}

let tasks = getTasks();

function saveTasks() {
    localStorage.setItem(
        "yomTasks",
        JSON.stringify(tasks)
    );
}

const categoryIcons = {
    study: {
        icon: "bi-book-fill",
        className: "category-study"
    },
    work: {
        icon: "bi-briefcase-fill",
        className: "category-work"
    },
    health: {
        icon: "bi-heart-pulse-fill",
        className: "category-health"
    },
    personal: {
        icon: "bi-person-fill",
        className: "category-personal"
    },
    reading: {
        icon: "bi-book-half",
        className: "category-reading"
    }
};

const tasksList = document.getElementById("tasksList");
const searchInput = document.getElementById("searchInput");

function renderTasks(searchTerm = "") {
    const search = searchTerm.toLowerCase().trim();

    const filteredTasks = tasks.filter(task => {
        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();

        return (
            title.includes(search) ||
            description.includes(search)
        );
    });

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-check2-circle"></i>
                <strong>No tasks found</strong>
                <span>Add a new task and start your day.</span>
            </div>
        `;

        updateStats();
        renderCalendar();

        return;
    }

    tasksList.innerHTML = filteredTasks.map(task => {
        const category =
            categoryIcons[task.category] ||
            categoryIcons.personal;

        return `
            <div
                class="task-item ${task.completed ? "completed" : ""}"
                data-id="${task.id}"
            >
                <button class="task-check" data-action="complete">
                    ${task.completed
                ? '<i class="bi bi-check-lg"></i>'
                : ""
            }
                </button>

                <div class="category-icon ${category.className}">
                    <i class="bi ${category.icon}"></i>
                </div>

                <div class="task-details">
                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>

                    <div class="task-description">
                        ${escapeHTML(task.description)}
                    </div>

                    <div class="task-meta">
                        <span class="task-deadline">
                            <i class="bi bi-calendar3"></i>
                            ${formatDate(task.deadline)}
                        </span>

                        <span class="priority ${task.priority === "important"
                ? "priority-important"
                : "priority-normal"
            }">
                            <span class="priority-dot"></span>
                            ${task.priority === "important"
                ? "Important"
                : "Normal"
            }
                        </span>
                    </div>
                </div>

                <button
                    class="delete-task"
                    data-action="delete"
                    title="Delete task"
                >
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </div>
        `;
    }).join("");

    updateStats();
    renderCalendar();
}

tasksList.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const taskItem = button.closest(".task-item");

    if (!taskItem) {
        return;
    }

    const taskId = Number(taskItem.dataset.id);
    const action = button.dataset.action;

    if (action === "complete") {
        const task = tasks.find(item => item.id === taskId);

        if (task) {
            task.completed = !task.completed;
        }

        saveTasks();
        renderTasks(searchInput.value);
    }

    if (action === "delete") {
        tasks = tasks.filter(item => item.id !== taskId);

        saveTasks();
        renderTasks(searchInput.value);
    }
});

function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const important = tasks.filter(
        task =>
            task.priority === "important" &&
            !task.completed
    ).length;

    const dueToday = tasks.filter(
        task =>
            task.deadline === getToday() &&
            !task.completed
    ).length;

    const percentage =
        total === 0
            ? 0
            : Math.round((completed / total) * 100);

    document.getElementById("totalCount").textContent = total;
    document.getElementById("completedCount").textContent = completed;
    document.getElementById("importantCount").textContent = important;
    document.getElementById("dueTodayCount").textContent = dueToday;

    document.getElementById("progressPercent").textContent =
        `${percentage}%`;

    const degrees = percentage * 3.6;

    document.getElementById("progressCircle").style.background =
        `conic-gradient(
            var(--caramel) ${degrees}deg,
            #e7ddd6 ${degrees}deg
        )`;
}

searchInput.addEventListener("input", function () {
    renderTasks(this.value);
});

const modal = document.getElementById("taskModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

openModal.addEventListener("click", function () {
    modal.classList.add("show");
    document.getElementById("taskTitle").focus();
});

closeModal.addEventListener("click", function () {
    modal.classList.remove("show");
});

modal.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        modal.classList.remove("show");
        noteModal.classList.remove("show");
    }
});

document
    .getElementById("taskForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        const title =
            document.getElementById("taskTitle").value.trim();

        const category =
            document.getElementById("taskCategory").value;

        const priority =
            document.getElementById("taskPriority").value;

        const deadline =
            document.getElementById("taskDeadline").value;

        const description =
            document.getElementById("taskDescription").value.trim();

        if (!title || !deadline) {
            return;
        }

        tasks.unshift({
            id: Date.now(),
            title,
            category,
            priority,
            deadline,
            description,
            completed: false
        });

        saveTasks();

        this.reset();
        modal.classList.remove("show");

        renderTasks(searchInput.value);
    });

let timerSeconds = 25 * 60;
let timerInterval = null;

const timerDisplay =
    document.getElementById("timerDisplay");

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;

    timerDisplay.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

document
    .getElementById("startTimer")
    .addEventListener("click", function () {
        if (timerInterval !== null) {
            return;
        }

        timerInterval = setInterval(function () {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                timerDisplay.textContent = "00:00";
                alert("Focus session completed!");
            }
        }, 1000);
    });

document
    .getElementById("pauseTimer")
    .addEventListener("click", function () {
        clearInterval(timerInterval);
        timerInterval = null;
    });

document
    .getElementById("resetTimer")
    .addEventListener("click", function () {
        clearInterval(timerInterval);
        timerInterval = null;
        timerSeconds = 25 * 60;
        updateTimerDisplay();
    });

let notes = [];

const notesList =
    document.getElementById("notesList");

const addNoteBtn =
    document.getElementById("addNoteBtn");

const noteModal =
    document.getElementById("noteModal");

const closeNoteBtn =
    document.getElementById("closeNoteBtn");

const saveNoteBtn =
    document.getElementById("saveNoteBtn");

const noteTitle =
    document.getElementById("noteTitle");

const noteInput =
    document.getElementById("noteInput");

const noteCounter =
    document.getElementById("noteCounter");

function loadNotes() {
    try {
        const savedNotes =
            JSON.parse(localStorage.getItem("yomNotes"));

        if (Array.isArray(savedNotes)) {
            notes = savedNotes;
        }
    } catch (error) {
        notes = [];
    }
}

function saveNotes() {
    localStorage.setItem(
        "yomNotes",
        JSON.stringify(notes)
    );
}

function renderNotes() {
    if (notes.length === 0) {
        notesList.innerHTML = `
            <div class="empty-notes">
                <i class="bi bi-journal-text"></i>
                <p>No notes yet</p>
                <span>Click + to add your first note</span>
            </div>
        `;

        return;
    }

    notesList.innerHTML = notes.map(note => `
        <div class="note-card">
            <div class="note-card-header">
                <h3 class="note-card-title">
                    ${escapeHTML(note.title)}
                </h3>

                <button
                    class="note-delete-btn"
                    data-note-id="${note.id}"
                >
                    <i class="bi bi-trash3"></i>
                </button>
            </div>

            <p class="note-card-text">
                ${escapeHTML(note.text)}
            </p>

            <div class="note-card-date">
                ${escapeHTML(note.date)}
            </div>
        </div>
    `).join("");
}

addNoteBtn.addEventListener("click", function () {
    noteModal.classList.add("show");

    noteTitle.value = "";
    noteInput.value = "";

    updateNoteCounter();

    setTimeout(function () {
        noteTitle.focus();
    }, 100);
});

closeNoteBtn.addEventListener("click", function () {
    noteModal.classList.remove("show");
});

noteModal.addEventListener("click", function (event) {
    if (event.target === noteModal) {
        noteModal.classList.remove("show");
    }
});

noteInput.addEventListener(
    "input",
    updateNoteCounter
);

function updateNoteCounter() {
    noteCounter.textContent =
        `${noteInput.value.length} / 250`;
}

saveNoteBtn.addEventListener(
    "click",
    saveNote
);

function saveNote() {
    const title = noteTitle.value.trim();
    const text = noteInput.value.trim();

    if (!text) {
        noteInput.focus();
        return;
    }

    notes.unshift({
        id: Date.now(),
        title: title || "Untitled Note",
        text,
        date: new Date().toLocaleDateString(
            "en-US",
            {
                day: "numeric",
                month: "short"
            }
        )
    });

    saveNotes();
    renderNotes();

    noteModal.classList.remove("show");

    noteTitle.value = "";
    noteInput.value = "";

    updateNoteCounter();
}

notesList.addEventListener("click", function (event) {
    const button =
        event.target.closest(".note-delete-btn");

    if (!button) {
        return;
    }

    const noteId =
        Number(button.dataset.noteId);

    notes = notes.filter(
        note => note.id !== noteId
    );

    saveNotes();
    renderNotes();
});

const motivations = [
    "Progress, not perfection.",
    "One task at a time.",
    "You are capable of more than you think.",
    "Start small and keep going.",
    "Your future self will thank you.",
    "Consistency creates results.",
    "Make today count."
];

function showMotivation() {
    const randomIndex =
        Math.floor(
            Math.random() * motivations.length
        );

    document.getElementById(
        "motivationText"
    ).textContent =
        motivations[randomIndex];
}

document
    .getElementById("newMotivation")
    .addEventListener(
        "click",
        showMotivation
    );

let calendarDate = new Date();

function renderCalendar() {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    document.getElementById(
        "calendarMonth"
    ).textContent =
        calendarDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );

    const firstDay =
        new Date(year, month, 1).getDay();

    const daysInMonth =
        new Date(year, month + 1, 0).getDate();

    const calendarDays =
        document.getElementById("calendarDays");

    calendarDays.innerHTML = "";

    for (let i = 0; i < firstDay; i++) {
        calendarDays.innerHTML +=
            `<span class="calendar-day empty"></span>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        const hasTask =
            tasks.some(
                task => task.deadline === dateString
            );

        const isToday =
            dateString === getToday();

        calendarDays.innerHTML += `
            <span class="
                calendar-day
                ${isToday ? "today" : ""}
                ${hasTask ? "has-task" : ""}
            ">
                ${day}
            </span>
        `;
    }
}

document
    .getElementById("prevMonth")
    .addEventListener("click", function () {
        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );

        renderCalendar();
    });

document
    .getElementById("nextMonth")
    .addEventListener("click", function () {
        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );

        renderCalendar();
    });

document
    .querySelectorAll(".nav-item")
    .forEach(item => {
        item.addEventListener("click", function () {
            document
                .querySelectorAll(".nav-item")
                .forEach(nav => {
                    nav.classList.remove("active");
                });

            this.classList.add("active");
        });
    });

loadNotes();
renderNotes();
renderTasks();
updateTimerDisplay();
showMotivation();
renderCalendar();