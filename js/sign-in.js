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