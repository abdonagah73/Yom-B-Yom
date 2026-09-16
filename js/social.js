/**
 * =========================================================
 * YOM-B-YOM SOCIAL COMMUNITY CONTROLLER
 * - Loads public profiles dynamically from SocialAPI
 * - Upgraded showcase design (Hobbies, Tasks, Projects, Habits)
 * - Interactive Like/Cheer & Filtering System
 * =========================================================
 */

document.addEventListener("DOMContentLoaded", async function () {
    if (!window.SocialAPI) return;

    const container = document.getElementById("socialFeedContainer");
    const countEl = document.getElementById("publicMembersCount");
    const searchInput = document.getElementById("socialSearchInput");
    const filterBtns = document.querySelectorAll(".social-filter-btn");

    let publicProfiles = [];
    let currentFilter = "all";
    let searchQuery = "";

    // Cheers storage in localStorage
    const cheersState = JSON.parse(localStorage.getItem("yombyom_cheers_v1") || "{}");

    // 1. Fetch Public Profiles from SocialAPI
    async function loadSocialFeed() {
        if (!container) return;
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px; color: var(--text-muted);">
                <i class="bi bi-arrow-repeat" style="font-size: 32px; animation: spin 1s linear infinite; display: inline-block;"></i>
                <p style="margin-top: 12px; font-weight: 600; font-size: 1.05rem;">Loading community members...</p>
            </div>
        `;

        publicProfiles = await SocialAPI.getPublicProfiles();
        renderFeed();
    }

    // 2. Render Feed
    function renderFeed() {
        if (!container) return;

        let filtered = publicProfiles.filter(profile => {
            const matchesSearch = searchQuery === "" ||
                (profile.name && profile.name.toLowerCase().includes(searchQuery)) ||
                (profile.bio && profile.bio.toLowerCase().includes(searchQuery)) ||
                (profile.showcase && Object.values(profile.showcase).flat().some(item => typeof item === "string" && item.toLowerCase().includes(searchQuery)));

            if (!matchesSearch) return false;

            if (currentFilter === "all") return true;
            if (currentFilter === "hobbies") return profile.showcase && profile.showcase.showHobbies && profile.showcase.hobbies && profile.showcase.hobbies.length > 0;
            if (currentFilter === "tasks") return profile.showcase && profile.showcase.showTasks && profile.showcase.tasks && profile.showcase.tasks.length > 0;
            if (currentFilter === "projects") return profile.showcase && profile.showcase.showProjects && profile.showcase.projects && profile.showcase.projects.length > 0;
            if (currentFilter === "habits") return profile.showcase && profile.showcase.showHabits && profile.showcase.habits && profile.showcase.habits.length > 0;

            return true;
        });

        if (countEl) {
            countEl.textContent = `${filtered.length} Public Members`;
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: var(--bg-card); border: 1.5px dashed var(--border-color); border-radius: var(--radius-lg);">
                    <i class="bi bi-people" style="font-size: 44px; color: var(--accent); margin-bottom: 12px; display: block;"></i>
                    <h3 style="font-family: var(--font-title); font-size: 1.8rem; margin-bottom: 6px;">No Members Found</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 400px; margin: 0 auto;">
                        Try adjusting your search or filter. You can also make your own profile public in <a href="profile.html" style="color: var(--accent); font-weight: 700; text-decoration: underline;">Profile Settings</a>.
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(profile => createProfileCardHTML(profile)).join("");

        // Attach Cheer Button Listeners
        container.querySelectorAll(".btn-send-cheer").forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                const id = this.dataset.id;
                const countSpan = this.querySelector(".cheer-count");
                let current = parseInt(countSpan.textContent) || 0;
                current++;
                countSpan.textContent = current;
                cheersState[id] = current;
                localStorage.setItem("yombyom_cheers_v1", JSON.stringify(cheersState));
                this.classList.add("cheered");
            });
        });
    }

    // 3. Generate Upgraded Card HTML
    function createProfileCardHTML(profile) {
        const isMe = profile.isCurrentUser;
        const cheers = cheersState[profile.id] || (isMe ? 12 : Math.floor(Math.random() * 20) + 5);

        const avatarHTML = profile.avatar
            ? `<img src="${profile.avatar}" alt="${profile.name}" class="social-avatar-img" onerror="this.outerHTML='<div class=\\'social-avatar-fallback\\'>${(profile.name || 'U').charAt(0).toUpperCase()}</div>'">`
            : `<div class="social-avatar-fallback">${(profile.name || 'U').charAt(0).toUpperCase()}</div>`;

        const onlineStatus = profile.isOnline
            ? `<span class="status-pill status-online"><span class="pulse-dot"></span> Active Today</span>`
            : `<span class="status-pill status-offline"><span class="gray-dot"></span> Away</span>`;

        const meBadge = isMe
            ? `<span class="badge-you"><i class="bi bi-star-fill"></i> Your Profile</span>`
            : ``;

        // Generate Showcase HTML with refined, creative styling
        let showcaseHTML = "";
        const sc = profile.showcase || {};

        // Hobbies (Flowing Colorful Pill Tags)
        if (sc.showHobbies && sc.hobbies && sc.hobbies.length > 0) {
            showcaseHTML += `
                <div class="showcase-block">
                    <div class="showcase-block-header">
                        <span class="block-icon hobby-icon"><i class="bi bi-heart-pulse-fill"></i></span>
                        <span class="block-title">Hobbies & Passions</span>
                    </div>
                    <div class="hobbies-tags-flow">
                        ${sc.hobbies.map(h => `<span class="hobby-tag">${h}</span>`).join("")}
                    </div>
                </div>
            `;
        }

        // Active Tasks (Checklist Cards with Status Check)
        if (sc.showTasks && sc.tasks && sc.tasks.length > 0) {
            showcaseHTML += `
                <div class="showcase-block">
                    <div class="showcase-block-header">
                        <span class="block-icon task-icon"><i class="bi bi-check2-circle"></i></span>
                        <span class="block-title">Current Focus & Tasks</span>
                    </div>
                    <div class="tasks-mini-list">
                        ${sc.tasks.map(t => `
                            <div class="task-mini-item">
                                <i class="bi bi-check-circle-fill"></i>
                                <span>${t}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        // Projects (Mini Project Milestone Cards)
        if (sc.showProjects && sc.projects && sc.projects.length > 0) {
            showcaseHTML += `
                <div class="showcase-block">
                    <div class="showcase-block-header">
                        <span class="block-icon project-icon"><i class="bi bi-rocket-takeoff-fill"></i></span>
                        <span class="block-title">Active Projects</span>
                    </div>
                    <div class="projects-mini-grid">
                        ${sc.projects.map(p => `
                            <div class="project-mini-card">
                                <div class="project-card-top">
                                    <i class="bi bi-folder2-open"></i>
                                    <span class="project-status-dot"></span>
                                </div>
                                <div class="project-card-name">${p}</div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        // Habits & Streaks (Flame Badge Cards)
        if (sc.showHabits && sc.habits && sc.habits.length > 0) {
            showcaseHTML += `
                <div class="showcase-block">
                    <div class="showcase-block-header">
                        <span class="block-icon habit-icon"><i class="bi bi-fire"></i></span>
                        <span class="block-title">Habits & Streaks</span>
                    </div>
                    <div class="habits-streak-row">
                        ${sc.habits.map(hb => `
                            <div class="habit-streak-pill">
                                <span class="flame-badge">🔥</span>
                                <span class="habit-text">${hb}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        if (!showcaseHTML) {
            showcaseHTML = `
                <div class="showcase-empty-state">
                    <i class="bi bi-eye-slash"></i>
                    <span>This member keeps their specific activity showcase private.</span>
                </div>
            `;
        }

        return `
            <div class="social-person-card ${isMe ? 'is-me-card' : ''}">
                <div class="card-banner-accent"></div>
                
                <div class="card-header-area">
                    <div class="avatar-container">
                        ${avatarHTML}
                    </div>

                    <div class="user-meta-details">
                        <div class="user-name-line">
                            <h3>${profile.name}</h3>
                            ${meBadge}
                        </div>
                        <div class="user-subline">
                            <span class="user-handle">@${profile.username || 'user'}</span>
                            ${onlineStatus}
                        </div>
                    </div>

                    <button class="btn-send-cheer" data-id="${profile.id}" title="Send Cheer / Kudos">
                        <span class="cheer-heart">♡</span>
                        <span class="cheer-count">${cheers}</span>
                    </button>
                </div>

                <div class="card-bio-quote">
                    <p>"${profile.bio || "Making every day count step by step."}"</p>
                </div>

                <div class="showcase-section-wrapper">
                    ${showcaseHTML}
                </div>
            </div>
        `;
    }

    // 4. Filter Buttons Listeners
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter || "all";
            renderFeed();
        });
    });

    // 5. Search Listener
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderFeed();
        });
    }

    // Initial Load
    loadSocialFeed();
});