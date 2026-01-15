// ========================================
// VarnWear - Navbar Logic
// ========================================

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    updateCartCount();
    initDropdown();
    initMobileMenu();
});

// Initialize mobile menu
function initMobileMenu() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Create hamburger menu if it doesn't exist
    let toggle = document.querySelector('.mobile-menu-toggle');
    if (!toggle) {
        toggle = document.createElement('div');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '<span></span><span></span><span></span>';
        
        const navbarRight = navbar.querySelector('.navbar-right');
        if (navbarRight) {
            navbarRight.insertBefore(toggle, navbarRight.firstChild);
        }
    }
    
    const menu = navbar.querySelector('.navbar-menu');
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && menu.classList.contains('active')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Update navbar based on auth state
function updateNavbar() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.getElementById('loginBtn');
    const userSection = document.getElementById('userSection');
    
    if (currentUser) {
        // User is logged in
        loginBtn.style.display = 'none';
        userSection.style.display = 'flex';
        updateProfileIcon(currentUser);
    } else {
        // User is NOT logged in
        loginBtn.style.display = 'inline-block';
        userSection.style.display = 'none';
    }
}

// Update profile icon with image or initials
function updateProfileIcon(user) {
    const profileImg = document.getElementById('profileImg');
    const profileInitials = document.getElementById('profileInitials');
    
    if (user.profileImage) {
        // Show uploaded image
        profileImg.src = user.profileImage;
        profileImg.style.display = 'block';
        profileInitials.style.display = 'none';
    } else {
        // Show initials (first letter of first name + surname)
        const firstInitial = user.firstName ? user.firstName.charAt(0) : '';
        const lastInitial = user.lastName ? user.lastName.charAt(0) : '';
        profileInitials.textContent = firstInitial + lastInitial;
        profileInitials.style.display = 'block';
        profileImg.style.display = 'none';
    }
}

// Update cart counter
function updateCartCount() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const cartCount = document.getElementById('cartCount');
    
    if (currentUser && cartCount) {
        const cart = JSON.parse(localStorage.getItem(`cart_${currentUser.id}`)) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    } else if (cartCount) {
        cartCount.style.display = 'none';
    }
}

// Initialize dropdown functionality
function initDropdown() {
    const profileIcon = document.getElementById('profileIcon');
    const dropdown = document.getElementById('profileDropdown');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Toggle dropdown on profile click
    if (profileIcon) {
        profileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target) && e.target !== profileIcon) {
            dropdown.classList.remove('show');
        }
    });
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            // Clear browser history to prevent back button access
            window.history.replaceState(null, null, 'index.html');
            window.location.replace('index.html');
        });
    }
}

// Export function to update cart count from other pages
window.updateCartCount = updateCartCount;
window.initMobileMenu = initMobileMenu;
