document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MOBILE NAVBAR MENU
    ========================= */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            navLinks.classList.toggle("active");

            const isOpen = navLinks.classList.contains("active");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });


        /* Close menu after clicking a link */

        const links = navLinks.querySelectorAll("a");

        links.forEach(function (link) {

            link.addEventListener("click", function () {

                navLinks.classList.remove("active");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                menuToggle.textContent = "☰";
            });

        });
    }


    /* =========================
       DARK / LIGHT MODE
    ========================= */

    const themeButtons = document.querySelectorAll(
        "#themeToggle, .theme-btn, .sidebar-theme-btn"
    );

    const savedTheme = localStorage.getItem("yom_theme");


    function updateThemeIcon() {

        const isDark =
            document.body.classList.contains("dark-mode");

        themeButtons.forEach(function (button) {

            let icon = button.querySelector(".theme-icon");

            if (!icon) {
                icon = document.createElement("span");
                icon.className = "theme-icon";
                button.appendChild(icon);
            }

            /*
                Light Mode → Moon
                Dark Mode  → Sun
            */

            icon.textContent = isDark ? "☀️" : "🌙";

            button.setAttribute(
                "aria-label",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );

            button.setAttribute(
                "title",
                isDark
                    ? "Switch to light mode"
                    : "Switch to dark mode"
            );
        });
    }


    function setTheme(theme) {

        const isDark = theme === "dark";

        document.body.classList.toggle(
            "dark-mode",
            isDark
        );

        document.documentElement.dataset.theme = theme;

        localStorage.setItem(
            "yom_theme",
            theme
        );

        updateThemeIcon();
    }


    /* Apply saved theme */

    if (savedTheme === "dark") {
        setTheme("dark");
    } else {
        setTheme("light");
    }


    /* Theme button click */

    themeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const isDark =
                document.body.classList.contains("dark-mode");

            setTheme(
                isDark ? "light" : "dark"
            );

        });

    });

});