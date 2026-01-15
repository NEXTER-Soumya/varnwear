// ========================================
// VarnWear - Access Control Module
// ========================================

/**
 * Access Control Guards
 * Centralized authentication and authorization logic
 */

// ==================== USER ACCESS CONTROL ====================

// Check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Redirect to login with return URL
function redirectToLogin(returnUrl = null) {
    const url = returnUrl || window.location.pathname;
    window.location.href = `/login.html?redirect=${encodeURIComponent(url)}`;
}

// Guard: Require user authentication
function requireUserAuth(redirectUrl = null) {
    if (!isUserLoggedIn()) {
        redirectToLogin(redirectUrl);
        return false;
    }
    return true;
}

// Guard: Protect cart actions
function guardCartAction(action = 'add to cart') {
    if (!isUserLoggedIn()) {
        const confirmed = confirm(`Please login to ${action}. Redirect to login page?`);
        if (confirmed) {
            redirectToLogin();
        }
        return false;
    }
    return true;
}

// Guard: Protect wishlist actions
function guardWishlistAction(action = 'add to wishlist') {
    if (!isUserLoggedIn()) {
        const confirmed = confirm(`Please login to ${action}. Redirect to login page?`);
        if (confirmed) {
            redirectToLogin();
        }
        return false;
    }
    return true;
}

// Guard: Protect checkout
function guardCheckout() {
    if (!isUserLoggedIn()) {
        alert('Please login to proceed with checkout');
        redirectToLogin('/checkout.html');
        return false;
    }
    return true;
}

// Guard: Protect user pages (profile, orders, wishlist)
function guardUserPage() {
    if (!isUserLoggedIn()) {
        redirectToLogin();
        return false;
    }
    return true;
}

// ==================== ADMIN ACCESS CONTROL ====================

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('currentAdmin') !== null;
}

// Get current admin
function getCurrentAdmin() {
    const admin = localStorage.getItem('currentAdmin');
    return admin ? JSON.parse(admin) : null;
}

// Redirect to admin login
function redirectToAdminLogin() {
    window.location.href = '/admin/login.html';
}

// Guard: Require admin authentication
function requireAdminAuth() {
    if (!isAdminLoggedIn()) {
        redirectToAdminLogin();
        return false;
    }
    return true;
}

// Guard: Prevent logged-in users from accessing login pages
function guardLoginPage() {
    if (isUserLoggedIn()) {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = '<div class="alert alert-info">You are already logged in!</div>';
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translateX(-50%)';
        alertDiv.style.zIndex = '9999';
        document.body.appendChild(alertDiv);
        
        setTimeout(() => {
            window.location.replace('/index.html');
        }, 1500);
        return false;
    }
    return true;
}

// Guard: Prevent logged-in admin from accessing admin login
function guardAdminLoginPage() {
    if (isAdminLoggedIn()) {
        window.location.replace('/admin/index.html');
        return false;
    }
    return true;
}

// ==================== COMBINED GUARDS ====================

// Guard: Ensure user is NOT admin (prevent admin from user actions)
function guardUserAction() {
    if (isAdminLoggedIn() && !isUserLoggedIn()) {
        alert('Please use user account for shopping');
        return false;
    }
    return true;
}

// ==================== INITIALIZATION ====================

// Auto-protect pages based on URL
function initAccessControl() {
    const path = window.location.pathname;
    
    // Prevent browser back button issues for all pages
    window.addEventListener('pageshow', function(event) {
        if (event.persisted || window.performance.navigation.type === 2) {
            // Force reload to check current auth state
            window.location.reload();
        }
    });
    
    // User protected pages
    if (path.includes('/cart.html') || 
        path.includes('/wishlist.html') || 
        path.includes('/orders.html') || 
        path.includes('/profile.html') ||
        path.includes('/checkout.html')) {
        if (!requireUserAuth()) return;
    }
    
    // Admin protected pages
    if (path.includes('/admin/') && !path.includes('/admin/login.html')) {
        if (!requireAdminAuth()) return;
    }
    
    // Login pages (redirect if already logged in)
    if (path.includes('/login.html') || path.includes('/register.html')) {
        guardLoginPage();
    }
    
    if (path.includes('/admin/login.html')) {
        guardAdminLoginPage();
    }
}

// ==================== EXPORT FUNCTIONS ====================

if (typeof window !== 'undefined') {
    // User guards
    window.isUserLoggedIn = isUserLoggedIn;
    window.getCurrentUser = getCurrentUser;
    window.requireUserAuth = requireUserAuth;
    window.guardCartAction = guardCartAction;
    window.guardWishlistAction = guardWishlistAction;
    window.guardCheckout = guardCheckout;
    window.guardUserPage = guardUserPage;
    
    // Admin guards
    window.isAdminLoggedIn = isAdminLoggedIn;
    window.getCurrentAdmin = getCurrentAdmin;
    window.requireAdminAuth = requireAdminAuth;
    
    // Login guards
    window.guardLoginPage = guardLoginPage;
    window.guardAdminLoginPage = guardAdminLoginPage;
    
    // Combined guards
    window.guardUserAction = guardUserAction;
    
    // Initialize
    window.initAccessControl = initAccessControl;
    
    // Backward compatibility aliases
    window.isLoggedIn = isUserLoggedIn;
    window.requireAuth = requireUserAuth;
    window.requireAuthForCart = guardCartAction;
    window.requireAuthForWishlist = guardWishlistAction;
    window.requireAuthForCheckout = guardCheckout;
}
