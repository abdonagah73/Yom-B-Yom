const container = document.querySelector(".container");

const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");


// Switch to Register

function showRegister() {
    container.classList.add("active");
}


// Switch to Login

function showLogin() {
    container.classList.remove("active");
}


registerBtn.addEventListener("click", () => {
    showRegister();
    window.location.hash = "register";
});


loginBtn.addEventListener("click", () => {
    showLogin();
    window.location.hash = "login";
});


// Show the correct form from URL

function checkStateFromURL() {

    const hash = window.location.hash.toLowerCase();

    const urlParams = new URLSearchParams(window.location.search);

    const mode =
        urlParams.get("mode") ||
        urlParams.get("action");

    if (
        hash === "#register" ||
        hash === "#signup" ||
        mode === "register" ||
        mode === "signup"
    ) {
        showRegister();
    }

    else {
        showLogin();
    }
}


checkStateFromURL();

window.addEventListener("hashchange", checkStateFromURL);


// Error helper

function showError(element, message) {

    element.textContent = message;
    element.classList.add("show");
}


function clearError(element) {

    element.textContent = "";
    element.classList.remove("show");
}


// Email validation

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// Password validation

function validPassword(password) {

    return password.length >= 6;
}


// =========================
// REGISTER
// =========================

registerForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const username =
        document.getElementById("registerUsername").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;


    const usernameError =
        document.getElementById("registerUsernameError");

    const emailError =
        document.getElementById("registerEmailError");

    const passwordError =
        document.getElementById("registerPasswordError");


    clearError(usernameError);
    clearError(emailError);
    clearError(passwordError);


    let valid = true;


    // Username

    if (username.length < 3) {

        showError(
            usernameError,
            "Username must be at least 3 characters."
        );

        valid = false;
    }


    // Email

    if (!validEmail(email)) {

        showError(
            emailError,
            "Please enter a valid email address."
        );

        valid = false;
    }


    // Password

    if (!validPassword(password)) {

        showError(
            passwordError,
            "Password must be at least 6 characters."
        );

        valid = false;
    }


    if (!valid) {
        return;
    }


    // Save user

    const user = {
        username: username,
        email: email,
        password: password
    };


    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    // Save username separately
    // because your Dashboard already uses userName

    localStorage.setItem(
        "userName",
        username
    );


    // Mark user as logged in

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );


    // Go to Dashboard

    window.location.href = "../index.html";

});


// =========================
// LOGIN
// =========================

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    const emailError =
        document.getElementById("loginEmailError");

    const passwordError =
        document.getElementById("loginPasswordError");


    clearError(emailError);
    clearError(passwordError);


    let valid = true;


    // Check email format

    if (!validEmail(email)) {

        showError(
            emailError,
            "Please enter a valid email address."
        );

        valid = false;
    }


    if (!valid) {
        return;
    }


    // Get saved user

    const savedUser =
        JSON.parse(localStorage.getItem("user"));


    // No registered account

    if (!savedUser) {

        showError(
            emailError,
            "No account found. Please register first."
        );

        return;
    }


    // Wrong email

    if (email !== savedUser.email) {

        showError(
            emailError,
            "Email is incorrect."
        );

        valid = false;
    }


    // Wrong password

    if (password !== savedUser.password) {

        showError(
            passwordError,
            "Password is incorrect."
        );

        valid = false;
    }


    if (!valid) {
        return;
    }


    // Login successful

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );


    localStorage.setItem(
        "userName",
        savedUser.username
    );


    // Go to Dashboard

    window.location.href = "../index.html";

});


// =========================
// SOCIAL LOGIN
// =========================

const socialButtons =
    document.querySelectorAll(".social-btn");


socialButtons.forEach(button => {

    button.addEventListener("click", () => {

        const provider =
            button.dataset.provider;

        alert(
            `${provider} login needs OAuth authentication.`
        );

    });

});