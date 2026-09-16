/**
 * YOM-B-YOM GLOBAL APPLICATION SCRIPT
 * - Dynamic Scroll Navbar
 * - User Auth & Profile State Detection
 * - Unified Sidebar Toggle & Mobile Handling
 * - Theme Switcher (Light / Dark Mode with Brown Swatch Contrast)
 */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       1. DYNAMIC TOP NAVBAR ON SCROLL (Home Page)
       ========================================================= */
    const navbar = document.querySelector(".navbar");

    function handleScroll() {
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    if (navbar) {
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // initial check
    }


    /* =========================================================
       2. USER AUTHENTICATION & DYNAMIC PROFILE STATE
       ========================================================= */
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userName = localStorage.getItem("userName") || "Friend";
    const userInitial = userName.charAt(0).toUpperCase();

    // Elements in Top Navbar
    const authGuestElements = document.querySelectorAll(".auth-guest");
    const authUserElements = document.querySelectorAll(".auth-user");
    const navUserNames = document.querySelectorAll(".nav-user-name");
    const navUserAvatars = document.querySelectorAll(".nav-profile-avatar");

    // Elements in Sidebar
    const sidebarUserBoxes = document.querySelectorAll(".sidebar-user-box");
    const sidebarAuthButtons = document.querySelectorAll(".sidebar-auth-buttons");
    const sidebarUserNames = document.querySelectorAll(".sidebar-user-name, #userName");
    const sidebarAvatars = document.querySelectorAll(".sidebar-avatar");

    if (isLoggedIn) {
        // Hide Guest login/register buttons in Navbar
        authGuestElements.forEach(el => el.style.display = "none");
        
        // Show Logged-in Profile in Navbar
        authUserElements.forEach(el => {
            el.classList.add("logged-in");
            el.style.display = "flex";
        });

        navUserNames.forEach(el => el.textContent = userName);
        navUserAvatars.forEach(el => el.textContent = userInitial);

        // Sidebar user states
        sidebarAuthButtons.forEach(el => el.style.display = "none");
        sidebarUserBoxes.forEach(el => {
            el.classList.add("logged-in");
            el.style.display = "flex";
        });

        sidebarUserNames.forEach(el => el.textContent = userName);
        sidebarAvatars.forEach(el => el.textContent = userInitial);
    } else {
        // Logged out states
        authGuestElements.forEach(el => el.style.display = "flex");
        authUserElements.forEach(el => {
            el.classList.remove("logged-in");
            el.style.display = "none";
        });

        sidebarAuthButtons.forEach(el => el.style.display = "grid");
        sidebarUserBoxes.forEach(el => {
            el.classList.remove("logged-in");
            el.style.display = "none";
        });
    }

    // Logout Functionality
    function handleLogout(e) {
        if (e) e.preventDefault();
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userName");
        localStorage.removeItem("user");

        // Determine correct redirect path depending on current location
        const isSubpage = window.location.pathname.includes("/pages/");
        const redirectUrl = isSubpage ? "../index.html" : "index.html";
        window.location.href = redirectUrl;
    }

    const logoutButtons = document.querySelectorAll(".btn-nav-logout, .sidebar-logout-btn, [data-action='logout']");
    logoutButtons.forEach(btn => {
        btn.addEventListener("click", handleLogout);
    });


    /* =========================================================
       3. TOP NAVBAR MOBILE MENU TOGGLE
       ========================================================= */
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
            const isOpen = navLinks.classList.contains("active");
            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        // Close on nav link click
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", function () {
                navLinks.classList.remove("active");
                menuToggle.textContent = "☰";
            });
        });
    }


    /* =========================================================
       4. SUB-PAGE SIDEBAR MOBILE DRAWER TOGGLE
       ========================================================= */
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggle = document.querySelector(".sidebar-mobile-toggle");
    let sidebarOverlay = document.querySelector(".sidebar-overlay");

    if (sidebar) {
        if (!sidebarOverlay) {
            sidebarOverlay = document.createElement("div");
            sidebarOverlay.className = "sidebar-overlay";
            document.body.appendChild(sidebarOverlay);
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener("click", function () {
                sidebar.classList.toggle("open");
                sidebarOverlay.classList.toggle("active");
            });
        }

        sidebarOverlay.addEventListener("click", function () {
            sidebar.classList.remove("open");
            sidebarOverlay.classList.remove("active");
        });
    }


    /* =========================================================
       5. THEME TOGGLE (LIGHT / DARK MODE)
       ========================================================= */
    const themeButtons = document.querySelectorAll("#themeToggle, .theme-btn, .sidebar-theme-btn");
    const savedTheme = localStorage.getItem("yom_theme");

    function updateThemeIcons(isDark) {
        themeButtons.forEach(button => {
            let icon = button.querySelector(".theme-icon");
            if (!icon) {
                icon = document.createElement("span");
                icon.className = "theme-icon";
                button.prepend(icon);
            }
            icon.textContent = isDark ? "☀️" : "🌙";

            const labelSpan = button.querySelector(".theme-label");
            if (labelSpan) {
                labelSpan.textContent = isDark ? "Light Mode" : "Dark Mode";
            }

            button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
        });
    }

    function applyTheme(theme) {
        const isDark = theme === "dark";
        document.body.classList.toggle("dark-mode", isDark);
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("yom_theme", theme);
        updateThemeIcons(isDark);
    }

    // Set initial theme
    if (savedTheme === "dark") {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }

    // Bind theme button click handlers
    themeButtons.forEach(button => {
        button.addEventListener("click", function () {
            const isDark = document.body.classList.contains("dark-mode");
            applyTheme(isDark ? "light" : "dark");
        });
    });

});