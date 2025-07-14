// admin-header.js
document.addEventListener('DOMContentLoaded', function() {
    // Create header element
    const header = document.createElement('header');
    header.className = 'admin-header';
    
    // Header HTML content
    header.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Admin Panel</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="adminNavbar">
                    <ul class="navbar-nav me-auto" id="admin-menu-links">
                        <!-- Dynamic menu links will be added here -->
                    </ul>
                    <div class="d-flex">
                        <button id="admin-logout-btn" class="btn btn-danger">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    // Insert header at the beginning of the body
    document.body.insertBefore(header, document.body.firstChild);
    
    // Add menu links dynamically
    const menuLinksContainer = document.getElementById('admin-menu-links');
    
    // Define your admin menu links
    const adminMenuLinks = [
        { text: 'Dashboard', href: 'admin', id: 'dashboard-link' },
        { text: 'Courses', href: '#', id: 'courses-link', active: true },
        { text: 'Users', href: 'admin-users', id: 'users-link' },
        { text: 'Settings', href: 'admin-settings', id: 'settings-link' }
    ];
    
    // Add links to the menu
    adminMenuLinks.forEach(link => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.className = `nav-link ${link.active ? 'active' : ''}`;
        a.href = link.href;
        a.id = link.id;
        a.textContent = link.text;
        
        li.appendChild(a);
        menuLinksContainer.appendChild(li);
    });
    
    // Add logout functionality
    document.getElementById('admin-logout-btn').addEventListener('click', () => {
        firebase.auth().signOut()
            .then(() => window.location.href = "login")
            .catch(error => console.error("Logout error:", error));
    });
    
    // Add padding to body to account for fixed header
    document.body.style.paddingTop = '56px';
});