/* =====================================================
   YOM-B-YOM TO DO LIST
   Main JavaScript
===================================================== */


/* ================= TASK DATA ================= */

let tasks = [

    {
        id: 1,
        title: "Study JavaScript",
        tag: "Study",
        when: "Today",
        time: "10:00 AM",
        completed: false,
        important: true
    },

    {
        id: 2,
        title: "Finish UI Design",
        tag: "Project",
        when: "Today",
        time: "02:00 PM",
        completed: false,
        important: false
    },

    {
        id: 3,
        title: "Submit Assignment",
        tag: "University",
        when: "Yesterday",
        time: "09:00 PM",
        completed: true,
        important: false
    },

    {
        id: 4,
        title: "Team Meeting",
        tag: "Work",
        when: "Today",
        time: "04:00 PM",
        completed: false,
        important: true
    },

    {
        id: 5,
        title: "Read a Book",
        tag: "Personal",
        when: "Tomorrow",
        time: "11:00 AM",
        completed: false,
        important: false
    },

    {
        id: 6,
        title: "Workout",
        tag: "Health",
        when: "Yesterday",
        time: "07:00 AM",
        completed: true,
        important: false
    },

    {
        id: 7,
        title: "Plan Next Week",
        tag: "Personal",
        when: "Tomorrow",
        time: "06:00 PM",
        completed: true,
        important: false
    }

];


let nextId = 8;

let currentFilter = "all";

let activeTaskId = null;

let userName = null;


/* ================= TAG COLORS ================= */

const TAG_STYLES = {

    Study: {
        bg: "var(--study-bg)",
        color: "var(--study-text)"
    },

    Project: {
        bg: "var(--project-bg)",
        color: "var(--project-text)"
    },

    University: {
        bg: "var(--uni-bg)",
        color: "var(--uni-text)"
    },

    Work: {
        bg: "var(--work-bg)",
        color: "var(--work-text)"
    },

    Personal: {
        bg: "var(--personal-bg)",
        color: "var(--personal-text)"
    },

    Health: {
        bg: "var(--health-bg)",
        color: "var(--health-text)"
    }

};


/* ================= TIMER ================= */

const FOCUS_SECONDS = 25 * 60;

let secondsLeft = FOCUS_SECONDS;

let timerRunning = true;

let timerInterval = null;

const TIMER_CIRC = 2 * Math.PI * 108;


/* ================= DOM ELEMENTS ================= */

const timerText =
    document.getElementById("timerText");

const timerRing =
    document.getElementById("timerRing");

const timerTaskLabel =
    document.getElementById("timerTaskLabel");

const playPauseBtn =
    document.getElementById("playPauseBtn");

const stopBtn =
    document.getElementById("stopBtn");


/* ================= TIMER FUNCTIONS ================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");

    const secs =
        (seconds % 60)
            .toString()
            .padStart(2, "0");

    return `${minutes}:${secs}`;
}


function renderTimer() {

    timerText.textContent =
        formatTime(secondsLeft);


    const progress =
        1 - secondsLeft / FOCUS_SECONDS;


    timerRing.style.strokeDashoffset =
        TIMER_CIRC * (1 - progress);


    const activeTask =
        tasks.find(task => task.id === activeTaskId);


    if (activeTask) {

        timerTaskLabel.textContent =
            activeTask.title;

    } else {

        timerTaskLabel.textContent =
            "Focus Session";

    }


    playPauseBtn.innerHTML =
        timerRunning
            ? "⏸ Pause"
            : "▶ Resume";
}


function tick() {

    if (secondsLeft > 0) {

        secondsLeft--;

        renderTimer();

    } else {

        clearInterval(timerInterval);

        timerRunning = false;

        if (activeTaskId !== null) {

            const task =
                tasks.find(t => t.id === activeTaskId);

            if (task) {

                task.completed = true;

            }

            activeTaskId = null;

            renderTaskList();

            renderProgress();

            renderTodaysFocus();

        }

        renderTimer();
    }

}


function startTimer() {

    timerRunning = true;

    clearInterval(timerInterval);

    timerInterval =
        setInterval(tick, 1000);

    renderTimer();

    renderProgress();
}


function pauseTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    renderTimer();

    renderProgress();
}


function stopTimer() {

    timerRunning = false;

    clearInterval(timerInterval);

    secondsLeft = FOCUS_SECONDS;

    activeTaskId = null;

    renderTimer();

    renderTaskList();

    renderProgress();

    renderTodaysFocus();
}


playPauseBtn.addEventListener(
    "click",
    () => {

        if (timerRunning) {

            pauseTimer();

        } else {

            startTimer();

        }

    }
);


stopBtn.addEventListener(
    "click",
    stopTimer
);


/* ================= START TASK ================= */

function goTask(id) {

    const task =
        tasks.find(t => t.id === id);

    if (!task) return;


    activeTaskId = id;

    task.inProgress = true;


    secondsLeft = FOCUS_SECONDS;


    startTimer();

    renderTaskList();

    renderProgress();

    renderTodaysFocus();
}


/* ================= FILTER ================= */

function getFilteredTasks() {

    switch (currentFilter) {

        case "today":

            return tasks.filter(
                task => task.when === "Today"
            );


        case "important":

            return tasks.filter(
                task => task.important
            );


        case "completed":

            return tasks.filter(
                task => task.completed
            );


        default:

            return tasks;
    }

}


/* ================= TAG STYLE ================= */

function getTagStyle(tag) {

    return TAG_STYLES[tag]
        || TAG_STYLES.Personal;
}


/* ================= TASK LIST ================= */

function renderTaskList() {

    const list =
        document.getElementById("taskList");


    const items =
        getFilteredTasks();


    if (items.length === 0) {

        list.innerHTML = `
            <div class="empty-tasks">
                No tasks here yet ✨
            </div>
        `;

        return;
    }


    list.innerHTML =
        items.map(task => {

            const style =
                getTagStyle(task.tag);


            const isActive =
                task.id === activeTaskId &&
                timerRunning;


            return `

                <div class="
                    task-item
                    ${isActive ? "active-timer" : ""}
                ">


                    <div
                        class="checkbox ${task.completed ? "checked" : ""}"
                        onclick="toggleComplete(${task.id})">

                        ${task.completed ? "✓" : ""}

                    </div>


                    <div class="task-mid">


                        <div class="task-title-row">


                            <span class="
                                task-title
                                ${task.completed ? "done" : ""}
                            ">

                                ${escapeHTML(task.title)}

                            </span>


                            <span
                                class="tag"
                                style="
                                    background:${style.bg};
                                    color:${style.color};
                                ">

                                ${task.tag}

                            </span>


                            ${
                                task.important
                                    ? `<span class="imp-star">★</span>`
                                    : ""
                            }


                        </div>


                        <div class="task-meta">

                            👤 Personal
                            &nbsp; • &nbsp;
                            📅 ${task.when}
                            &nbsp; • &nbsp;
                            ${task.time}

                        </div>


                    </div>


                    <div class="task-action">


                        ${
                            task.completed

                            ?

                            `
                                <button
                                    class="done-pill"
                                    onclick="toggleComplete(${task.id})">

                                    Done ✓

                                </button>
                            `

                            :

                            `
                                <button
                                    class="go-btn"
                                    onclick="goTask(${task.id})">

                                    ${
                                        isActive
                                            ? "Focusing →"
                                            : "Go →"
                                    }

                                </button>
                            `
                        }


                    </div>


                </div>

            `;

        }).join("");

}


/* ================= COMPLETE TASK ================= */

function toggleComplete(id) {

    const task =
        tasks.find(t => t.id === id);


    if (!task) return;


    task.completed =
        !task.completed;


    if (task.completed) {

        task.inProgress = false;


        if (activeTaskId === id) {

            activeTaskId = null;

            secondsLeft = FOCUS_SECONDS;

            timerRunning = false;

            clearInterval(timerInterval);

        }

    }


    renderTaskList();

    renderProgress();

    renderTodaysFocus();

    renderTimer();
}


/* ================= DELETE TASK ================= */

function deleteTask(id) {

    const task =
        tasks.find(t => t.id === id);


    if (!task) return;


    const confirmed =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!confirmed) return;


    if (activeTaskId === id) {

        activeTaskId = null;

        secondsLeft = FOCUS_SECONDS;

        timerRunning = false;

        clearInterval(timerInterval);

    }


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    renderTaskList();

    renderProgress();

    renderTodaysFocus();

    renderTimer();

}


/* ================= ADD DELETE BUTTON ================= */

function addDeleteButtons() {

    document
        .querySelectorAll(".task-item")
        .forEach(item => {

            const id =
                Number(
                    item
                        .querySelector(".checkbox")
                        ?.getAttribute("onclick")
                        ?.match(/\d+/)?.[0]
                );


            const action =
                item.querySelector(".task-action");


            if (!action || !id) return;


            if (!action.querySelector(".delete-task")) {

                const deleteButton =
                    document.createElement("button");


                deleteButton.className =
                    "delete-task";


                deleteButton.textContent =
                    "🗑";


                deleteButton.title =
                    "Delete task";


                deleteButton.onclick =
                    () => deleteTask(id);


                deleteButton.style.cssText = `
                    width:34px;
                    height:34px;
                    margin-left:6px;
                    border:none;
                    border-radius:10px;
                    background:#f3e5d5;
                    color:#76563d;
                    cursor:pointer;
                `;


                action.appendChild(
                    deleteButton
                );

            }

        });

}


/* ================= FILTER BUTTONS ================= */

document
    .querySelectorAll(".tab")
    .forEach(tab => {

        tab.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".tab")
                    .forEach(button =>
                        button.classList.remove("active")
                    );


                tab.classList.add("active");


                currentFilter =
                    tab.dataset.filter;


                renderTaskList();

            }
        );

    });


/* ================= PROGRESS ================= */

const DONUT_CIRC =
    2 * Math.PI * 37;


function renderProgress() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const inProgress =
        activeTaskId !== null &&
        timerRunning
            ? 1
            : 0;


    const pending =
        Math.max(
            total -
            completed -
            inProgress,
            0
        );


    const percentage =
        total
            ? Math.round(
                completed / total * 100
            )
            : 0;


    document.getElementById(
        "completedCount"
    ).textContent = completed;


    document.getElementById(
        "totalCount"
    ).textContent = total;


    document.getElementById(
        "tasksBarFill"
    ).style.width =
        `${percentage}%`;


    document.getElementById(
        "cntCompleted"
    ).textContent =
        completed;


    document.getElementById(
        "cntProgress"
    ).textContent =
        inProgress;


    document.getElementById(
        "cntPending"
    ).textContent =
        pending;


    document.getElementById(
        "donutPct"
    ).textContent =
        `${percentage}%`;


    document.getElementById(
        "donutRing"
    ).style.strokeDashoffset =
        DONUT_CIRC *
        (1 - percentage / 100);

}


/* ================= TODAY'S FOCUS ================= */

function renderTodaysFocus() {

    const container =
        document.getElementById(
            "todaysFocusList"
        );


    const todayTasks =
        tasks
            .filter(
                task =>
                    task.when === "Today" &&
                    !task.completed
            )
            .slice(0, 4);


    if (todayTasks.length === 0) {

        container.innerHTML = `
            <div class="empty-note">
                Nothing left for today 🎉
            </div>
        `;

        return;
    }


    container.innerHTML =
        todayTasks.map(
            (task, index) => `

                <div class="focus-list-item">

                    <div class="fli-left">

                        <div class="fli-num">
                            ${index + 1}
                        </div>

                        <span>
                            ${escapeHTML(task.title)}
                        </span>

                    </div>

                    <div class="fli-time">
                        ${task.time}
                    </div>

                </div>

            `
        ).join("");

}


/* ================= ADD TASK ================= */

const addTaskModal =
    document.getElementById(
        "addTaskModal"
    );


document
    .getElementById("addTaskBtn")
    .addEventListener(
        "click",
        () => {

            addTaskModal.classList.add(
                "open"
            );

        }
    );


document
    .getElementById("addTaskCancel")
    .addEventListener(
        "click",
        () => {

            addTaskModal.classList.remove(
                "open"
            );

        }
    );


document
    .getElementById("addTaskConfirm")
    .addEventListener(
        "click",
        () => {

            const title =
                document
                    .getElementById(
                        "newTaskTitle"
                    )
                    .value
                    .trim();


            if (!title) {

                document
                    .getElementById(
                        "newTaskTitle"
                    )
                    .focus();

                return;
            }


            const tag =
                document
                    .getElementById(
                        "newTaskTag"
                    )
                    .value;


            const when =
                document
                    .getElementById(
                        "newTaskWhen"
                    )
                    .value;


            const time =
                document
                    .getElementById(
                        "newTaskTime"
                    )
                    .value
                    .trim()
                    || "—";


            const important =
                document
                    .getElementById(
                        "newTaskImportant"
                    )
                    .checked;


            tasks.unshift({

                id: nextId++,

                title: title,

                tag: tag,

                when: when,

                time: time,

                completed: false,

                important: important,

                inProgress: false

            });


            document
                .getElementById(
                    "newTaskTitle"
                )
                .value = "";


            document
                .getElementById(
                    "newTaskTime"
                )
                .value = "";


            document
                .getElementById(
                    "newTaskImportant"
                )
                .checked = false;


            addTaskModal.classList.remove(
                "open"
            );


            currentFilter = "all";


            document
                .querySelectorAll(".tab")
                .forEach(tab => {

                    tab.classList.remove(
                        "active"
                    );

                    if (
                        tab.dataset.filter ===
                        "all"
                    ) {

                        tab.classList.add(
                            "active"
                        );

                    }

                });


            renderTaskList();

            renderProgress();

            renderTodaysFocus();

        }
    );


/* ================= SIGN IN ================= */

const profileBtn =
    document.getElementById(
        "profileBtn"
    );


const profileMenu =
    document.getElementById(
        "profileMenu"
    );


profileBtn.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        profileMenu.classList.toggle(
            "open"
        );

    }
);


document.addEventListener(
    "click",
    () => {

        profileMenu.classList.remove(
            "open"
        );

    }
);


const signInModal =
    document.getElementById(
        "signInModal"
    );


document
    .getElementById("signInOpt")
    .addEventListener(
        "click",
        () => {

            profileMenu.classList.remove(
                "open"
            );


            if (userName) {

                userName = null;

                updateGreeting();

            } else {

                signInModal.classList.add(
                    "open"
                );

            }

        }
    );


document
    .getElementById("signInCancel")
    .addEventListener(
        "click",
        () => {

            signInModal.classList.remove(
                "open"
            );

        }
    );


document
    .getElementById("signInConfirm")
    .addEventListener(
        "click",
        () => {

            const name =
                document
                    .getElementById(
                        "signInName"
                    )
                    .value
                    .trim();


            if (!name) {

                document
                    .getElementById(
                        "signInName"
                    )
                    .focus();

                return;
            }


            userName = name;


            document
                .getElementById(
                    "signInName"
                )
                .value = "";


            signInModal.classList.remove(
                "open"
            );


            updateGreeting();

        }
    );


function updateGreeting() {

    const nameElement =
        document.getElementById(
            "greetName"
        );


    const avatar =
        document.getElementById(
            "avatarInit"
        );


    const signInOption =
        document.getElementById(
            "signInOpt"
        );


    if (userName) {

        nameElement.textContent =
            `Good Morning, ${userName} 💗`;


        avatar.textContent =
            userName
                .trim()
                .charAt(0)
                .toUpperCase();


        signInOption.textContent =
            "Sign out";

    } else {

        nameElement.textContent =
            "Good Morning, Guest 💗";


        avatar.textContent =
            "G";


        signInOption.textContent =
            "Sign in";

    }

}


/* ================= MODAL OUTSIDE CLICK ================= */

[
    signInModal,
    addTaskModal
].forEach(modal => {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "open"
                );

            }

        }
    );

});


/* ================= ESCAPE HTML ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


/* ================= INITIALIZE ================= */

renderTimer();

renderTaskList();

renderProgress();

renderTodaysFocus();

addDeleteButtons();

startTimer();


/*
    The delete buttons are added after
    rendering the task list.
*/

const observer =
    new MutationObserver(() => {

        addDeleteButtons();

    });


observer.observe(
    document.getElementById("taskList"),
    {
        childList: true
    }
);