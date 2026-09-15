const container = document.querySelector('.container');

const registerBtn = document.querySelector('.register-btn');

const loginBtn = document.querySelector('.login-btn');


function showRegister() {
    container.classList.add('active');
}

function showLogin() {
    container.classList.remove('active');
}

registerBtn.addEventListener('click', () => {
    showRegister();
    window.location.hash = 'register';
});


loginBtn.addEventListener('click', () => {
    showLogin();
    window.location.hash = 'login';
});

function checkStateFromURL() {
    const hash = window.location.hash.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || urlParams.get('action');

    if (hash === '#register' || hash === '#signup' || mode === 'register' || mode === 'signup') {
        showRegister();
    } else if (hash === '#login' || hash === '#signin' || mode === 'login' || mode === 'signin') {
        showLogin();
    }
}

// Run immediately and listen for changes
checkStateFromURL();
window.addEventListener('DOMContentLoaded', checkStateFromURL);
window.addEventListener('hashchange', checkStateFromURL);

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

registerForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    const user = {
        username: username,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "../index.html";
});

loginForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {
        alert("Please register first");
        return;
    }

    if (email === savedUser.email && password === savedUser.password) {
        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "../index.html";
    } else {
        alert("Invalid email or password");
    }
});
