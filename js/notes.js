/**
 * Yom-B-YOM Dashboard JavaScript
 * Simple & Beginner-Friendly Code (Clean, No Emojis)
 */

document.addEventListener('DOMContentLoaded', function () {

    // ================= 1. SAVE & LOAD NOTES IN SQUARE BOXES =================
    const noteTitles = document.querySelectorAll('.square-title-input, .note-input-title');
    const noteTextareas = document.querySelectorAll('.square-textarea, .note-textarea');
    const saveBtn = document.getElementById('saveAllNotesBtn');

    // Load saved notes from LocalStorage on page load
    loadNotesFromStorage();

    // Auto-save when user types in notes
    noteTitles.forEach((input) => {
        input.addEventListener('input', saveNotesToStorage);
    });

    noteTextareas.forEach((textarea) => {
        textarea.addEventListener('input', saveNotesToStorage);
    });

    // Save button click feedback
    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            saveNotesToStorage();
            saveHabitsToStorage();
            saveBtn.innerText = 'Saved!';
            setTimeout(() => {
                saveBtn.innerText = 'Save Notes';
            }, 1200);
        });
    }

    function saveNotesToStorage() {
        const notesData = [];
        noteTitles.forEach((input, index) => {
            notesData.push({
                title: input.value,
                text: noteTextareas[index] ? noteTextareas[index].value : ''
            });
        });
        localStorage.setItem('yombyom_user_notes', JSON.stringify(notesData));
    }

    function loadNotesFromStorage() {
        const saved = localStorage.getItem('yombyom_user_notes');
        if (saved) {
            try {
                const notesData = JSON.parse(saved);
                notesData.forEach((note, index) => {
                    if (noteTitles[index] && note.title !== undefined) {
                        noteTitles[index].value = note.title;
                    }
                    if (noteTextareas[index] && note.text !== undefined) {
                        noteTextareas[index].value = note.text;
                    }
                });
            } catch (e) {
                console.log('Error loading notes:', e);
            }
        }
    }


    // ================= 2. SAVE & LOAD HABITS (TITLES + DETAILS) =================
    const habitTitles = document.querySelectorAll('.habit-title-input');
    const habitDescs = document.querySelectorAll('.habit-desc-input');

    loadHabitsFromStorage();

    habitTitles.forEach((input) => {
        input.addEventListener('input', saveHabitsToStorage);
    });

    habitDescs.forEach((input) => {
        input.addEventListener('input', saveHabitsToStorage);
    });

    function saveHabitsToStorage() {
        const habitsData = [];
        habitTitles.forEach((input, index) => {
            habitsData.push({
                title: input.value,
                desc: habitDescs[index] ? habitDescs[index].value : ''
            });
        });
        localStorage.setItem('yombyom_user_habits_text', JSON.stringify(habitsData));
    }

    function loadHabitsFromStorage() {
        const saved = localStorage.getItem('yombyom_user_habits_text');
        if (saved) {
            try {
                const habitsData = JSON.parse(saved);
                habitsData.forEach((habit, index) => {
                    if (habitTitles[index] && habit.title !== undefined) {
                        habitTitles[index].value = habit.title;
                    }
                    if (habitDescs[index] && habit.desc !== undefined) {
                        habitDescs[index].value = habit.desc;
                    }
                });
            } catch (e) {
                console.log('Error loading habits text:', e);
            }
        }
    }


    // ================= 3. HABITS INTERACTIVITY (DAYS + DONE TOGGLE) =================
    // Click on weekly day circles (S, M, T, W, T, F, S) to toggle active state
    const dayButtons = document.querySelectorAll('.day-btn');
    dayButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    });

    // Click "Done Today" / "Mark Done" buttons
    const doneButtons = document.querySelectorAll('.btn-done');
    doneButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                this.innerText = 'Mark Done';
            } else {
                this.classList.add('active');
                this.innerText = 'Done Today';
            }
            updateHabitProgress();
        });
    });

    // Update Habits Progress Bar
    function updateHabitProgress() {
        const total = doneButtons.length;
        let completed = 0;

        doneButtons.forEach(btn => {
            if (btn.classList.contains('active')) {
                completed++;
            }
        });

        const percent = Math.round((completed / total) * 100);

        const progressBar = document.getElementById('habitsProgressBar');
        const percentBadge = document.getElementById('habitsPercentBadge');
        const statusText = document.getElementById('habitsStatusText');

        if (progressBar) progressBar.style.width = percent + '%';
        if (percentBadge) percentBadge.innerText = percent + '% Done';
        if (statusText) statusText.innerText = completed + ' of ' + total + ' habits completed today';
    }

});
