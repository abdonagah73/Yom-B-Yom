/**
 * =========================================================
 * YOM-B-YOM PROFILE CONTROLLER
 * - Connects to SocialAPI
 * - Manages Privacy (Public / Private)
 * - Manages Showcase Items (Hobbies, Tasks, Projects, Habits)
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", async function () {
    if (!window.SocialAPI) return;

    // Elements
    const avatarBig = document.getElementById("profileAvatarBig");
    const nameDisplay = document.getElementById("profileNameDisplay");
    const emailDisplay = document.getElementById("profileEmailDisplay");
    const privacyBadge = document.getElementById("profilePrivacyBadge");

    const usernameInput = document.getElementById("profileUsername");
    const emailInput = document.getElementById("profileEmail");
    const bioInput = document.getElementById("profileBio");

    // Privacy Radio Inputs
    const privacyPublicRadio = document.getElementById("privacyPublic");
    const privacyPrivateRadio = document.getElementById("privacyPrivate");

    // Showcase Checkboxes & Text Inputs
    const showHobbiesCheck = document.getElementById("showHobbiesCheck");
    const hobbiesInput = document.getElementById("hobbiesInput");

    const showTasksCheck = document.getElementById("showTasksCheck");
    const tasksInput = document.getElementById("tasksInput");

    const showProjectsCheck = document.getElementById("showProjectsCheck");
    const projectsInput = document.getElementById("projectsInput");

    const showHabitsCheck = document.getElementById("showHabitsCheck");
    const habitsInput = document.getElementById("habitsInput");

    const saveBtn = document.getElementById("saveProfileBtn");
    const toast = document.getElementById("profileToast");

    // 1. Load Current Profile from SocialAPI
    const myProfile = await SocialAPI.getMyProfile();

    if (myProfile) {
        if (avatarBig) avatarBig.textContent = (myProfile.name || "U").charAt(0).toUpperCase();
        if (nameDisplay) nameDisplay.textContent = myProfile.name || "Friend";
        if (emailDisplay) emailDisplay.textContent = myProfile.email || "user@yombyom.com";

        if (usernameInput) usernameInput.value = myProfile.name || "";
        if (emailInput) emailInput.value = myProfile.email || "";
        if (bioInput) bioInput.value = myProfile.bio || "";

        // Privacy status
        if (myProfile.isPublic) {
            if (privacyPublicRadio) privacyPublicRadio.checked = true;
            updatePrivacyUI(true);
        } else {
            if (privacyPrivateRadio) privacyPrivateRadio.checked = true;
            updatePrivacyUI(false);
        }

        // Showcase settings
        const sc = myProfile.showcase || {};

        if (showHobbiesCheck) showHobbiesCheck.checked = Boolean(sc.showHobbies);
        if (hobbiesInput) hobbiesInput.value = (sc.hobbies || []).join(", ");

        if (showTasksCheck) showTasksCheck.checked = Boolean(sc.showTasks);
        if (tasksInput) tasksInput.value = (sc.tasks || []).join(", ");

        if (showProjectsCheck) showProjectsCheck.checked = Boolean(sc.showProjects);
        if (projectsInput) projectsInput.value = (sc.projects || []).join(", ");

        if (showHabitsCheck) showHabitsCheck.checked = Boolean(sc.showHabits);
        if (habitsInput) habitsInput.value = (sc.habits || []).join(", ");
    }

    // Toggle Privacy Radio listener
    if (privacyPublicRadio) {
        privacyPublicRadio.addEventListener("change", () => updatePrivacyUI(true));
    }
    if (privacyPrivateRadio) {
        privacyPrivateRadio.addEventListener("change", () => updatePrivacyUI(false));
    }

    function updatePrivacyUI(isPublic) {
        if (!privacyBadge) return;
        if (isPublic) {
            privacyBadge.innerHTML = `<i class="bi bi-globe-americas"></i> Public Profile (Visible on Social Feed)`;
            privacyBadge.style.color = "#4E7C59";
            privacyBadge.style.borderColor = "#4E7C59";
            privacyBadge.style.backgroundColor = "rgba(78, 124, 89, 0.12)";
        } else {
            privacyBadge.innerHTML = `<i class="bi bi-lock-fill"></i> Private Profile (Hidden from Social Feed)`;
            privacyBadge.style.color = "#C8615D";
            privacyBadge.style.borderColor = "#C8615D";
            privacyBadge.style.backgroundColor = "rgba(200, 97, 93, 0.12)";
        }
    }

    // Helper: Parse Comma Separated Strings into Array
    function parseList(str) {
        if (!str) return [];
        return str.split(",")
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    // 2. Save Profile Changes
    if (saveBtn) {
        saveBtn.addEventListener("click", async function () {
            const newName = usernameInput ? usernameInput.value.trim() : "Friend";
            const newEmail = emailInput ? emailInput.value.trim() : "user@yombyom.com";
            const newBio = bioInput ? bioInput.value.trim() : "";
            const isPublic = privacyPublicRadio ? privacyPublicRadio.checked : true;

            const updatedData = {
                name: newName,
                username: newName,
                email: newEmail,
                bio: newBio,
                isPublic: isPublic,
                showcase: {
                    showHobbies: showHobbiesCheck ? showHobbiesCheck.checked : true,
                    hobbies: parseList(hobbiesInput ? hobbiesInput.value : ""),
                    showTasks: showTasksCheck ? showTasksCheck.checked : true,
                    tasks: parseList(tasksInput ? tasksInput.value : ""),
                    showProjects: showProjectsCheck ? showProjectsCheck.checked : true,
                    projects: parseList(projectsInput ? projectsInput.value : ""),
                    showHabits: showHabitsCheck ? showHabitsCheck.checked : true,
                    habits: parseList(habitsInput ? habitsInput.value : "")
                }
            };

            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Saving...';

            const res = await SocialAPI.updateMyProfile(updatedData);

            saveBtn.disabled = false;
            saveBtn.innerHTML = '<i class="bi bi-floppy2-fill"></i> Save All Changes';

            if (res.success) {
                // Show notification / toast
                if (toast) {
                    toast.classList.add("show");
                    setTimeout(() => toast.classList.remove("show"), 3000);
                } else {
                    alert("Profile & Social settings saved successfully!");
                }

                // Update UI on the page
                if (avatarBig) avatarBig.textContent = newName.charAt(0).toUpperCase();
                if (nameDisplay) nameDisplay.textContent = newName;
                if (emailDisplay) emailDisplay.textContent = newEmail;
                updatePrivacyUI(isPublic);
            }
        });
    }
});
