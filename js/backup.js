// ========================================
// VarnWear - Data Backup Utility
// ========================================

// Export all data to JSON file
function exportData() {
    const data = {
        users: localStorage.getItem('users'),
        products: localStorage.getItem('products'),
        orders: localStorage.getItem('orders'),
        currentUser: localStorage.getItem('currentUser'),
        currentAdmin: localStorage.getItem('currentAdmin'),
        timestamp: new Date().toISOString()
    };
    
    // Add cart and wishlist for current user
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        data[`cart_${user.id}`] = localStorage.getItem(`cart_${user.id}`);
        data[`wishlist_${user.id}`] = localStorage.getItem(`wishlist_${user.id}`);
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `varnwear-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Import data from JSON file
function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                // Restore all data
                Object.keys(data).forEach(key => {
                    if (key !== 'timestamp' && data[key]) {
                        localStorage.setItem(key, data[key]);
                    }
                });
                
                resolve({ success: true, message: 'Data restored successfully!' });
            } catch (error) {
                reject({ success: false, message: 'Invalid backup file' });
            }
        };
        reader.onerror = () => reject({ success: false, message: 'Failed to read file' });
        reader.readAsText(file);
    });
}

// Auto-save to localStorage periodically (already happens automatically)
// localStorage persists across browser sessions by default

if (typeof window !== 'undefined') {
    window.exportData = exportData;
    window.importData = importData;
}
