// ========================================
// VarnWear - Authentication System
// ========================================

// Register new user
function registerUser(firstName, lastName, email, password, profileImage = null) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
        id: generateUserId(),
        firstName,
        lastName,
        email: email.toLowerCase(),
        password, // In production, this should be hashed
        profileImage,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const userSession = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        profileImage: newUser.profileImage
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    return { success: true, user: userSession };
}

// Login user
function loginUser(email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user by email
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        return { success: false, message: 'Email not found' };
    }
    
    // Check password
    if (user.password !== password) {
        return { success: false, message: 'Incorrect password' };
    }
    
    // Create session
    const userSession = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileImage: user.profileImage
    };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    
    return { success: true, user: userSession };
}

// Logout user (clear session only, not user data)
function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Alias for isLoggedIn
function isUserLoggedIn() {
    return isLoggedIn();
}

// Get current logged-in user
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Require authentication (redirect to login if not logged in)
function requireAuth(redirectUrl = null) {
    if (!isLoggedIn()) {
        const currentPage = redirectUrl || window.location.pathname;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        return false;
    }
    return true;
}

// Update user profile
function updateUserProfile(updates) {
    const currentUser = getCurrentUser();
    if (!currentUser) return { success: false, message: 'Not logged in' };
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
        return { success: false, message: 'User not found' };
    }
    
    // Update user data
    users[userIndex] = { ...users[userIndex], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update session
    const updatedSession = {
        id: users[userIndex].id,
        firstName: users[userIndex].firstName,
        lastName: users[userIndex].lastName,
        email: users[userIndex].email,
        phone: users[userIndex].phone,
        profileImage: users[userIndex].profileImage,
        address: users[userIndex].address
    };
    localStorage.setItem('currentUser', JSON.stringify(updatedSession));
    
    return { success: true, user: updatedSession };
}

// Generate unique user ID
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Auth guard for protected actions
function authGuard(action = 'perform this action') {
    if (!isLoggedIn()) {
        if (confirm(`Please login to ${action}. Redirect to login page?`)) {
            const currentPage = window.location.pathname;
            window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        }
        return false;
    }
    return true;
}

// Specific auth guards for common actions
function requireAuthForCart() {
    return authGuard('add items to cart');
}

function requireAuthForWishlist() {
    return authGuard('add items to wishlist');
}

function requireAuthForCheckout() {
    return authGuard('place an order');
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.registerUser = registerUser;
    window.loginUser = loginUser;
    window.logoutUser = logoutUser;
    window.isLoggedIn = isLoggedIn;
    window.isUserLoggedIn = isUserLoggedIn;
    window.getCurrentUser = getCurrentUser;
    window.requireAuth = requireAuth;
    window.updateUserProfile = updateUserProfile;
    window.authGuard = authGuard;
    window.requireAuthForCart = requireAuthForCart;
    window.requireAuthForWishlist = requireAuthForWishlist;
    window.requireAuthForCheckout = requireAuthForCheckout;
}
