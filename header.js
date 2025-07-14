document.addEventListener('DOMContentLoaded', function() {
    // Create header element
    const header = document.createElement('header');
    header.className = 'header';
    
    // Initial header structure (will be enhanced after loading menu links)
    header.innerHTML = `
        <div class="container">
            <nav class="navbar navbar-expand-lg navbar-dark">
                <a class="navbar-brand" href="courses">CourseApp</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarContent">
                    <div class="d-flex flex-column flex-lg-row w-100">
                        <ul class="navbar-nav me-auto" id="main-menu-links">
                            <!-- Default Courses link -->
                            <li class="nav-item">
                                <a class="nav-link ${isActive('courses')}" href="courses">Courses</a>
                            </li>
                            <!-- Dynamic links will be added here -->
                        </ul>
                        ${window.location.pathname.includes('login') ? 
                            `<a class="nav-link ${isActive('login')}" href="login">Login</a>` : 
                            `<div class="nav-item logout-container">
                                <button id="logout-btn" class="mobilebtn btn btn-danger logout-btn">Logout</button>
                            </div>`
                        }
                    </div>
                </div>
            </nav>
        </div>
    `;
    
    // Insert header at the beginning of the body
    document.body.insertBefore(header, document.body.firstChild);
    
    // Load Bootstrap JS if not already loaded
    if (!document.querySelector('script[src*="bootstrap.bundle.min.js"]')) {
        const bootstrapJS = document.createElement('script');
        bootstrapJS.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        document.head.appendChild(bootstrapJS);
    }
    
    // Load menu links from Firebase
    loadMenuLinks();
    
    // Add logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut()
                .then(() => window.location.href = "login")
                .catch(error => console.error("Logout error:", error));
        });
    }
    
    // Add padding to body to account for fixed header
    document.body.style.paddingTop = '70px';
    
    // Helper function to check active page
    function isActive(page) {
        return window.location.pathname.includes(page) ? 'active' : '';
    }
    
    // Function to load menu links from Firebase
    function loadMenuLinks() {
        // Make sure Firebase is initialized
        if (!firebase.apps.length) {
            console.error("Firebase not initialized");
            return;
        }
        
        const database = firebase.database();
        database.ref('menu_links')
            .orderByChild('order')
            .once('value')
            .then((snapshot) => {
                const menuContainer = document.getElementById('main-menu-links');
                
                if (!snapshot.exists()) {
                    console.log("No menu links found in database");
                    return;
                }
                
                snapshot.forEach((childSnapshot) => {
                    const link = childSnapshot.val();
                    
                    // Only add visible links
                    if (link.visible !== false) {
                        const li = document.createElement('li');
                        li.className = 'nav-item';
                        
                        const a = document.createElement('a');
                        a.className = `nav-link ${isActive(link.url)}`;
                        a.href = link.url;
                        a.textContent = link.text;
                        
                        li.appendChild(a);
                        menuContainer.appendChild(li);
                    }
                });
            })
            .catch((error) => {
                console.error("Error loading menu links:", error);
            });
    }
});