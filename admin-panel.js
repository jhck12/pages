// Main Admin Panel Class
class AdminPanel {
    constructor() {
        this.initAuth();
        this.cacheElements();
        this.bindEvents();
        this.checkScreenSize();
        window.addEventListener('resize', () => this.checkScreenSize());
    }
    
    initAuth() {
        auth.onAuthStateChanged(user => {
            if (!user) {
                window.location.href = "login";
            } else {
                this.checkAdminStatus(user.uid);
            }
        });
    }
    
    cacheElements() {
        this.elements = {
            // Sections
            coursesSection: document.getElementById('courses-section'),
            menuSection: document.getElementById('menu-section'),
            adminsSection: document.getElementById('admins-section'),
            
            // Forms
            courseFormContainer: document.getElementById('course-form-container'),
            menuLinkFormContainer: document.getElementById('menu-link-form-container'),
            
            // Lists
            coursesList: document.getElementById('courses-list'),
            menuLinksList: document.getElementById('menu-links-list'),
            adminsList: document.getElementById('admins-list'),
            
            // Mobile elements
            sidebar: document.getElementById('sidebar'),
            mobileMenuBtn: document.getElementById('mobile-menu-btn'),
            overlay: document.getElementById('overlay'),
            mainContent: document.getElementById('main-content'),
            
            // Tabs
            tabs: {
                courses: document.getElementById('courses-tab'),
                menu: document.getElementById('menu-tab'),
                admins: document.getElementById('admins-tab')
            }
        };
    }
    
    bindEvents() {
        // Navigation tabs
        this.elements.tabs.courses.addEventListener('click', (e) => this.showSection('courses', e));
        this.elements.tabs.menu.addEventListener('click', (e) => this.showSection('menu', e));
        this.elements.tabs.admins.addEventListener('click', (e) => this.showSection('admins', e));
        
        // Course management
        document.getElementById('add-course-btn').addEventListener('click', () => this.showCourseForm());
        document.getElementById('cancel-course-edit').addEventListener('click', () => this.hideForm('course'));
        document.getElementById('course-form').addEventListener('submit', (e) => this.saveCourse(e));
        this.elements.coursesList.addEventListener('click', (e) => this.handleCourseActions(e));
        
        // Menu link management
        document.getElementById('add-menu-link-btn').addEventListener('click', () => this.showMenuLinkForm());
        document.getElementById('cancel-menu-edit').addEventListener('click', () => this.hideForm('menu'));
        document.getElementById('menu-link-form').addEventListener('submit', (e) => this.saveMenuLink(e));
        this.elements.menuLinksList.addEventListener('click', (e) => this.handleMenuLinkActions(e));
        
        // Admin management
        document.getElementById('admin-form').addEventListener('submit', (e) => this.addAdmin(e));
        this.elements.adminsList.addEventListener('click', (e) => this.handleAdminActions(e));
        
        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        
        // Mobile menu
        this.elements.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        this.elements.overlay.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    checkScreenSize() {
        if (window.innerWidth <= 992) {
            this.elements.sidebar.classList.remove('col-md-2');
            this.elements.mainContent.classList.remove('col-md-10');
            this.elements.mainContent.classList.add('col-12');
        } else {
            this.elements.sidebar.classList.add('col-md-2');
            this.elements.mainContent.classList.add('col-md-10');
            this.elements.mainContent.classList.remove('col-12');
            this.elements.sidebar.classList.remove('active');
            this.elements.overlay.classList.remove('active');
        }
    }
    
    toggleMobileMenu() {
        this.elements.sidebar.classList.toggle('active');
        this.elements.overlay.classList.toggle('active');
    }
    
    checkAdminStatus(uid) {
        database.ref('admins/' + uid).once('value')
            .then((snapshot) => {
                if (!snapshot.exists()) {
                    alert("You don't have admin access");
                    window.location.href = "courses";
                } else {
                    this.loadData();
                    this.showSection('courses');
                }
            });
    }
    
    loadData() {
        this.loadCourses();
        this.loadMenuLinks();
        this.loadAdmins();
    }
    
    showSection(section, e) {
        if (e) e.preventDefault();
        
        // Hide all sections
        this.elements.coursesSection.style.display = 'none';
        this.elements.menuSection.style.display = 'none';
        this.elements.adminsSection.style.display = 'none';
        
        // Remove active class from all tabs
        Object.values(this.elements.tabs).forEach(tab => tab.classList.remove('active'));
        
        // Show selected section
        switch(section) {
            case 'courses':
                this.elements.coursesSection.style.display = 'block';
                this.elements.tabs.courses.classList.add('active');
                break;
            case 'menu':
                this.elements.menuSection.style.display = 'block';
                this.elements.tabs.menu.classList.add('active');
                break;
            case 'admins':
                this.elements.adminsSection.style.display = 'block';
                this.elements.tabs.admins.classList.add('active');
                break;
        }
        
        // Close mobile menu if open
        if (window.innerWidth <= 992) {
            this.toggleMobileMenu();
        }
    }
    
    // Course management methods
    loadCourses() {
        database.ref('courses').orderByChild('order').once('value')
            .then((snapshot) => {
                this.elements.coursesList.innerHTML = '';
                
                if (!snapshot.exists()) {
                    this.elements.coursesList.innerHTML = '<p>No courses found</p>';
                    return;
                }
                
                snapshot.forEach((childSnapshot) => {
                    const course = childSnapshot.val();
                    const courseId = childSnapshot.key;
                    
                    const courseCard = `
                        <div class="col-12 col-sm-6 col-lg-4 mb-4">
                            <div class="card course-card">
                                <img src="https://img.youtube.com/vi/${course.youtube_id}/hqdefault.jpg" 
                                     class="card-img-top" 
                                     alt="${course.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${course.title}</h5>
                                    <div class="d-flex flex-wrap">
                                        <button class="btn btn-sm btn-primary edit-course btn-action" data-id="${courseId}">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger delete-course btn-action" data-id="${courseId}">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    this.elements.coursesList.innerHTML += courseCard;
                });
            });
    }
    
    showCourseForm(title = 'Add New Course', course = null) {
        document.getElementById('form-title').textContent = title;
        document.getElementById('course-id').value = course?.id || '';
        document.getElementById('course-title').value = course?.title || '';
        document.getElementById('youtube-id').value = course?.youtube_id || '';
        document.getElementById('course-content').value = course?.content || '';
        document.getElementById('course-order').value = course?.order || '';
        this.elements.courseFormContainer.style.display = 'block';
        
        // Scroll to form on mobile
        if (window.innerWidth <= 768) {
            this.elements.courseFormContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    saveCourse(e) {
        e.preventDefault();
        
        const courseId = document.getElementById('course-id').value || database.ref().child('courses').push().key;
        const courseData = {
            title: document.getElementById('course-title').value,
            youtube_id: document.getElementById('youtube-id').value,
            content: document.getElementById('course-content').value,
            order: parseInt(document.getElementById('course-order').value)
        };
        
        database.ref('courses/' + courseId).set(courseData)
            .then(() => {
                alert('Course saved successfully!');
                this.hideForm('course');
                this.loadCourses();
            })
            .catch((error) => {
                alert('Error saving course: ' + error.message);
            });
    }
    
    handleCourseActions(e) {
        const courseId = e.target.getAttribute('data-id');
        
        if (e.target.classList.contains('edit-course') || e.target.closest('.edit-course')) {
            database.ref('courses/' + courseId).once('value')
                .then((snapshot) => {
                    const course = snapshot.val();
                    this.showCourseForm('Edit Course', { id: courseId, ...course });
                });
        }
        
        if (e.target.classList.contains('delete-course') || e.target.closest('.delete-course')) {
            if (confirm('Are you sure you want to delete this course?')) {
                database.ref('courses/' + courseId).remove()
                    .then(() => this.loadCourses());
            }
        }
    }
    
    // Menu link management methods
    loadMenuLinks() {
        database.ref('menu_links').orderByChild('order').once('value')
            .then((snapshot) => {
                this.elements.menuLinksList.innerHTML = '';
                
                if (!snapshot.exists()) {
                    this.elements.menuLinksList.innerHTML = '<p>No menu links found</p>';
                    return;
                }
                
                snapshot.forEach((childSnapshot) => {
                    const link = childSnapshot.val();
                    const linkId = childSnapshot.key;
                    
                    const linkCard = `
                        <div class="col-12 col-md-6 mb-3">
                            <div class="card menu-link-card">
                                <div class="card-body">
                                    <h5 class="card-title">${link.text}</h5>
                                    <p class="card-text">URL: ${link.url}</p>
                                    <p class="card-text">Order: ${link.order} | Visible: ${link.visible ? 'Yes' : 'No'}</p>
                                    <div class="d-flex flex-wrap">
                                        <button class="btn btn-sm btn-primary edit-menu-link btn-action" data-id="${linkId}">
                                            <i class="fas fa-edit"></i> Edit
                                        </button>
                                        <button class="btn btn-sm btn-danger delete-menu-link btn-action" data-id="${linkId}">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    this.elements.menuLinksList.innerHTML += linkCard;
                });
            });
    }
    
    showMenuLinkForm(title = 'Add New Menu Link', link = null) {
        document.getElementById('menu-link-id').value = link?.id || '';
        document.getElementById('link-text').value = link?.text || '';
        document.getElementById('link-url').value = link?.url || '';
        document.getElementById('link-order').value = link?.order || '';
        document.getElementById('link-visible').checked = link?.visible !== false;
        this.elements.menuLinkFormContainer.style.display = 'block';
        
        // Scroll to form on mobile
        if (window.innerWidth <= 768) {
            this.elements.menuLinkFormContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    saveMenuLink(e) {
        e.preventDefault();
        
        const linkId = document.getElementById('menu-link-id').value || database.ref().child('menu_links').push().key;
        const linkData = {
            text: document.getElementById('link-text').value,
            url: document.getElementById('link-url').value,
            order: parseInt(document.getElementById('link-order').value),
            visible: document.getElementById('link-visible').checked
        };
        
        database.ref('menu_links/' + linkId).set(linkData)
            .then(() => {
                alert('Menu link saved successfully!');
                this.hideForm('menu');
                this.loadMenuLinks();
            })
            .catch((error) => {
                alert('Error saving menu link: ' + error.message);
            });
    }
    
    handleMenuLinkActions(e) {
        const linkId = e.target.getAttribute('data-id');
        
        if (e.target.classList.contains('edit-menu-link') || e.target.closest('.edit-menu-link')) {
            database.ref('menu_links/' + linkId).once('value')
                .then((snapshot) => {
                    const link = snapshot.val();
                    this.showMenuLinkForm('Edit Menu Link', { id: linkId, ...link });
                });
        }
        
        if (e.target.classList.contains('delete-menu-link') || e.target.closest('.delete-menu-link')) {
            if (confirm('Are you sure you want to delete this menu link?')) {
                database.ref('menu_links/' + linkId).remove()
                    .then(() => this.loadMenuLinks());
            }
        }
    }
    
    // Admin management methods
    loadAdmins() {
        database.ref('admins').once('value')
            .then((snapshot) => {
                this.elements.adminsList.innerHTML = '';
                
                if (!snapshot.exists()) {
                    this.elements.adminsList.innerHTML = '<p>No admins found</p>';
                    return;
                }
                
                snapshot.forEach((childSnapshot) => {
                    const admin = childSnapshot.val();
                    const adminId = childSnapshot.key;
                    
                    const adminCard = `
                        <div class="card mb-2">
                            <div class="card-body">
                                <h5>${admin.email} ${admin.isRoot ? '(Root Admin)' : ''}</h5>
                                ${admin.isRoot ? '' : `
                                    <button class="btn btn-sm btn-danger remove-admin btn-action" data-id="${adminId}">
                                        <i class="fas fa-user-minus"></i> Remove
                                    </button>
                                `}
                            </div>
                        </div>
                    `;
                    
                    this.elements.adminsList.innerHTML += adminCard;
                });
            });
    }
    
    addAdmin(e) {
        e.preventDefault();
        
        const email = document.getElementById('admin-email').value;
        const isRoot = document.getElementById('make-root').checked;
        
        const newAdminRef = database.ref('admins').push();
        newAdminRef.set({
            email: email,
            isRoot: isRoot
        })
        .then(() => {
            alert('Admin added successfully!');
            document.getElementById('admin-form').reset();
            this.loadAdmins();
        })
        .catch((error) => {
            alert('Error adding admin: ' + error.message);
        });
    }
    
    handleAdminActions(e) {
        if (e.target.classList.contains('remove-admin') || e.target.closest('.remove-admin')) {
            const adminId = e.target.getAttribute('data-id');
            if (confirm('Are you sure you want to remove this admin?')) {
                database.ref('admins/' + adminId).remove()
                    .then(() => this.loadAdmins());
            }
        }
    }
    
    // Utility methods
    hideForm(type) {
        if (type === 'course') {
            this.elements.courseFormContainer.style.display = 'none';
        } else if (type === 'menu') {
            this.elements.menuLinkFormContainer.style.display = 'none';
        }
    }
    
    logout() {
        auth.signOut()
            .then(() => {
                window.location.href = "login";
            });
    }
}

// Initialize the admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});