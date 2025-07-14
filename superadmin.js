// root-admin-check.js

// Initialize Firebase (make sure you have firebase-config.js included before this)
const auth = firebase.auth();
const database = firebase.database();

class RootAdminCheck {
    constructor() {
        this.initAuth();
    }
    
    initAuth() {
        auth.onAuthStateChanged(user => {
            if (!user) {
                // User not logged in, redirect to login
                window.location.href = "login";
            } else {
                this.checkRootAdminStatus(user.uid);
            }
        });
    }
    
    checkRootAdminStatus(uid) {
        database.ref('admins/' + uid).once('value')
            .then((snapshot) => {
                const adminData = snapshot.val();
                
                if (!adminData || !adminData.isRoot) {
                    // User is not a root admin, redirect or show error
                    this.handleUnauthorizedAccess();
                }
                // If user is root admin, do nothing (allow access)
            })
            .catch(error => {
                console.error("Error checking admin status:", error);
                this.handleUnauthorizedAccess();
            });
    }
    
    handleUnauthorizedAccess() {
        // Customize this based on your needs
        alert("You don't have root admin privileges to access this page.");
        window.location.href = "admin"; // Redirect to regular admin panel or home
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RootAdminCheck();
});