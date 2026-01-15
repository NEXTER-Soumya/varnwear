// ========================================
// VarnWear - Admin Users Management
// ========================================

// Get all users
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Get user statistics
function getUserStats() {
    const users = getAllUsers();
    const orders = getAllOrders();
    
    return {
        totalUsers: users.length,
        usersWithOrders: [...new Set(orders.map(o => o.userId))].length,
        newUsersThisMonth: users.filter(u => {
            const userDate = new Date(u.createdAt);
            const now = new Date();
            return userDate.getMonth() === now.getMonth() && 
                   userDate.getFullYear() === now.getFullYear();
        }).length
    };
}

// Get user by email
function getUserByEmail(email) {
    const users = getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Export functions
if (typeof window !== 'undefined') {
    window.getAllUsers = getAllUsers;
    window.getUserStats = getUserStats;
    window.getUserByEmail = getUserByEmail;
}
