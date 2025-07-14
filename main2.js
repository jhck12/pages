// Toggle between forms
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
    clearErrors();
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    forgotPasswordForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    clearErrors();
});

showForgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    signupForm.classList.add('hidden');
    forgotPasswordForm.classList.remove('hidden');
    securityQuestionsContainer.classList.add('hidden');
    newPasswordContainer.classList.add('hidden');
    clearErrors();
});

showLoginFromForgot.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    clearErrors();
});

// Clear error messages
function clearErrors() {
    loginError.classList.add('hidden');
    signupError.classList.add('hidden');
    signupSuccess.classList.add('hidden');
    forgotError.classList.add('hidden');
    answersError.classList.add('hidden');
    passwordError.classList.add('hidden');
    passwordSuccess.classList.add('hidden');
}

// Display error message
function showError(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
}

// Clear form fields when switching between forms
showSignup.addEventListener('click', () => {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
});

showLogin.addEventListener('click', () => {
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm-password').value = '';
    document.getElementById('secret-q1').value = '';
    document.getElementById('secret-q2').value = '';
    document.getElementById('secret-q3').value = '';
});

showForgotPassword.addEventListener('click', () => {
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
});