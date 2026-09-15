function addActivity(button) {

    const activity = prompt("Enter a new activity:");

    if (activity === null || activity.trim() === "") {
        return;
    }

    const activitiesBox = button.parentElement;
    const list = activitiesBox.querySelector("ul");

    const newActivity = document.createElement("li");

    newActivity.innerHTML = `
        <label>
            <input type="checkbox">
            ${activity}
        </label>
    `;

    list.appendChild(newActivity);
}