// ========================================
// VarnWear - Admin Authentication
// ========================================

const ADMIN_API_URL = 'http://localhost:3000/api/admin';

// Admin login
async function adminLogin(username, password) {
    try {
        const res = await fetch(`${ADMIN_API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        
        if (data.success) {
            const adminSession = {
                username: data.admin.username,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentAdmin', JSON.stringify(adminSession));
        }
        return data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// Admin logout
function adminLogout() {
    localStorage.removeItem('currentAdmin');
    window.location.href = 'login.html';
}

// Check if admin is logged in
function isAdminLoggedIn() {
    return localStorage.getItem('currentAdmin') !== null;
}

// Get current admin
function getCurrentAdmin() {
    const admin = localStorage.getItem('currentAdmin');
    return admin ? JSON.parse(admin) : null;
}

// Require admin authentication
function requireAdminAuth() {
    if (!isAdminLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Export functions
if (typeof window !== 'undefined') {
    window.adminLogin = adminLogin;
    window.adminLogout = adminLogout;
    window.isAdminLoggedIn = isAdminLoggedIn;
    window.getCurrentAdmin = getCurrentAdmin;
    window.requireAdminAuth = requireAdminAuth;
}
