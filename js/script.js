/* =========================================================
   YOM-B-YOM GLOBAL THEME CONTROLLER
   - Works on every page using #themeToggle / .theme-btn
   - Saves the selected theme in localStorage
   - Keeps the moon/sun icon synchronized
   ========================================================= */
(function () {
    "use strict";

    var STORAGE_KEY = "yom_theme";

    function getThemeButtons() {
        return document.querySelectorAll("#themeToggle, .theme-btn, .sidebar-theme-btn");
    }

    function updateThemeIcons(theme) {
        var buttons = getThemeButtons();
        var isDark = theme === "dark";

        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            var icon = button.querySelector(".theme-icon");

            if (!icon) {
                icon = document.createElement("span");
                icon.className = "theme-icon";
                icon.setAttribute("aria-hidden", "true");
                button.textContent = "";
                button.appendChild(icon);
            }

            icon.textContent = isDark ? "☀️" : "🌙";
            button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
            button.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
        }
    }

    function applyTheme(theme) {
        var isDark = theme === "dark";
        document.body.classList.toggle("dark-mode", isDark);
        document.documentElement.setAttribute("data-theme", theme);
        updateThemeIcons(theme);
    }

    function getSavedTheme() {
        var saved = localStorage.getItem(STORAGE_KEY);
        return saved === "dark" ? "dark" : "light";
    }

    function toggleTheme() {
        var nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
        localStorage.setItem(STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    }

    function initTheme() {
        applyTheme(getSavedTheme());

        var buttons = getThemeButtons();
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].addEventListener("click", toggleTheme);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initTheme);
    } else {
        initTheme();
    }
})();
