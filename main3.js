// Sign up with email/password
signupBtn.addEventListener('click', async () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const secretQ1 = document.getElementById('secret-q1').value;
    const secretQ2 = document.getElementById('secret-q2').value;
    const secretQ3 = document.getElementById('secret-q3').value;
    
    if (!name || !email || !password || !confirmPassword || !secretQ1 || !secretQ2 || !secretQ3) {
        showError(signupError, 'Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showError(signupError, 'Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showError(signupError, 'Password should be at least 6 characters');
        return;
    }
    
    try {
        // Check if email already exists in database
        const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
        
        if (snapshot.exists()) {
            showError(signupError, 'Email already in use');
            return;
        }

        // Create user in Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Save user data to database
        const userData = {
            name: name,
            email: email,
            password: password,
            securityQuestions: {
                q1: securityQuestions[0],
                a1: secretQ1,
                q2: securityQuestions[1],
                a2: secretQ2,
                q3: securityQuestions[2],
                a3: secretQ3
            },
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        
        await database.ref('users/' + user.uid).set(userData);
        
        signupSuccess.textContent = 'Account created successfully!';
        signupSuccess.classList.remove('hidden');
        setTimeout(() => {
            updateUI(user);
        }, 1500);
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Please enter a valid email address';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password should be at least 6 characters';
        }
        showError(signupError, errorMessage);
    }
});

// Verify email for password recovery
verifyEmailBtn.addEventListener('click', async () => {
    const email = document.getElementById('forgot-email').value;
    
    if (!email) {
        showError(forgotError, 'Please enter your email');
        return;
    }
    
    try {
        // Check if user exists
        const snapshot = await database.ref('users').orderByChild('email').equalTo(email).once('value');
        
        if (!snapshot.exists()) {
            showError(forgotError, 'No account found with this email');
            return;
        }
        
        // Get user data
        snapshot.forEach((childSnapshot) => {
            recoveryUserData = {
                id: childSnapshot.key,
                ...childSnapshot.val()
            };
        });
        
        // Show security questions
        securityQuestionsContainer.classList.remove('hidden');
        
        // Display the security questions
        document.getElementById('security-question-1').classList.remove('hidden');
        document.getElementById('sq1-label').textContent = recoveryUserData.securityQuestions.q1;
        
        document.getElementById('security-question-2').classList.remove('hidden');
        document.getElementById('sq2-label').textContent = recoveryUserData.securityQuestions.q2;
        
        document.getElementById('security-question-3').classList.remove('hidden');
        document.getElementById('sq3-label').textContent = recoveryUserData.securityQuestions.q3;
        
        verifyAnswersBtn.classList.remove('hidden');
        
    } catch (error) {
        showError(forgotError, error.message);
    }
});

// Verify security answers
verifyAnswersBtn.addEventListener('click', () => {
    const answer1 = document.getElementById('sq1-answer').value;
    const answer2 = document.getElementById('sq2-answer').value;
    const answer3 = document.getElementById('sq3-answer').value;
    
    if (!answer1 || !answer2 || !answer3) {
        showError(answersError, 'Please answer all questions');
        return;
    }
    
    // Check answers (case insensitive)
    if (answer1.toLowerCase() !== recoveryUserData.securityQuestions.a1.toLowerCase() ||
        answer2.toLowerCase() !== recoveryUserData.securityQuestions.a2.toLowerCase() ||
        answer3.toLowerCase() !== recoveryUserData.securityQuestions.a3.toLowerCase()) {
        showError(answersError, 'One or more answers are incorrect');
        return;
    }
    
    // Answers are correct - show new password form
    securityQuestionsContainer.classList.add('hidden');
    newPasswordContainer.classList.remove('hidden');
});

// Update password
updatePasswordBtn.addEventListener('click', async () => {
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;
    
    if (!newPassword || !confirmNewPassword) {
        showError(passwordError, 'Please fill in both password fields');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showError(passwordError, 'Passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        showError(passwordError, 'Password should be at least 6 characters');
        return;
    }
    
    try {
        // Temporarily sign in to update password
        const userCred = await auth.signInWithEmailAndPassword(
            recoveryUserData.email,
            recoveryUserData.password
        );
        
        // Update password in Firebase Auth
        await userCred.user.updatePassword(newPassword);
        
        // Update password in Realtime Database
        await database.ref('users/' + recoveryUserData.id).update({
            password: newPassword
        });
        
        // Immediately sign out
        await auth.signOut();
        
        // Show success message
        passwordSuccess.textContent = 'Password updated successfully! Please login with your new password.';
        passwordSuccess.classList.remove('hidden');
        
        // Reset the form after 3 seconds
        setTimeout(() => {
            forgotPasswordForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            newPasswordContainer.classList.add('hidden');
            document.getElementById('forgot-email').value = '';
            document.getElementById('sq1-answer').value = '';
            document.getElementById('sq2-answer').value = '';
            document.getElementById('sq3-answer').value = '';
            document.getElementById('new-password').value = '';
            document.getElementById('confirm-new-password').value = '';
            clearErrors();
        }, 3000);
        
    } catch (error) {
        showError(passwordError, 'Error updating password: ' + error.message);
    }
});

// Login with email/password
loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showError(loginError, 'Please fill in all fields');
        return;
    }
    
    try {
        // First authenticate with Firebase Auth
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Then check if admin
        const adminSnapshot = await database.ref('admins/' + user.uid).once('value');
        if (adminSnapshot.exists()) {
            window.location.href = "admin";
        } else {
            updateUI(user);
        }
        
    } catch (error) {
        let errorMessage = error.message;
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password';
        }
        showError(loginError, errorMessage);
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            userInfo.classList.add('hidden');
            loginForm.classList.remove('hidden');
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
});

// Update UI based on auth state
function updateUI(user) {
    if (user) {
        // User is signed in
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        forgotPasswordForm.classList.add('hidden');
        userInfo.classList.remove('hidden');
        
        // Get user data from database
        database.ref('users/' + user.uid).once('value')
            .then((snapshot) => {
                const userData = snapshot.val();
                document.getElementById('user-name').textContent = userData.name || 'User';
                document.getElementById('user-email').textContent = user.email;
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
            });
    } else {
        // User is signed out
        userInfo.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

// Auth state observer
auth.onAuthStateChanged((user) => {
    updateUI(user);
});