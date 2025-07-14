// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAR2sGQx5Mxz_TZRfRyecWva346jBYel-8",
    authDomain: "chatapp-fa81d.firebaseapp.com",
    databaseURL: "https://chatapp-fa81d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "chatapp-fa81d",
    storageBucket: "chatapp-fa81d.firebasestorage.app",
    messagingSenderId: "308333202130",
    appId: "1:308333202130:web:b9c4fc84eff5bb065f3b0b"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const userInfo = document.getElementById('user-info');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const showForgotPassword = document.getElementById('show-forgot-password');
const showLoginFromForgot = document.getElementById('show-login-from-forgot');
const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const verifyEmailBtn = document.getElementById('verify-email-btn');
const verifyAnswersBtn = document.getElementById('verify-answers-btn');
const updatePasswordBtn = document.getElementById('update-password-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');
const signupSuccess = document.getElementById('signup-success');
const forgotError = document.getElementById('forgot-error');
const answersError = document.getElementById('answers-error');
const passwordError = document.getElementById('password-error');
const passwordSuccess = document.getElementById('password-success');
const securityQuestionsContainer = document.getElementById('security-questions-container');
const newPasswordContainer = document.getElementById('new-password-container');

// Security questions data
const securityQuestions = [
    "What was your first pet's name?",
    "What city were you born in?",
    "What is your mother's maiden name?"
];

// Current user data for password recovery
let recoveryUserData = null;