// ========================================
// VarnWear - Utility Functions
// ========================================

// Format currency in INR
function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date with time
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Validate email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validate phone number (Indian format)
function validatePhone(phone) {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(phone);
}

// Validate PIN code (Indian format)
function validatePinCode(pin) {
    const regex = /^[1-9][0-9]{5}$/;
    return regex.test(pin);
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    toast.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generate random ID
function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate discount percentage
function calculateDiscount(originalPrice, discountedPrice) {
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Export functions
if (typeof window !== 'undefined') {
    window.formatCurrency = formatCurrency;
    window.formatDate = formatDate;
    window.formatDateTime = formatDateTime;
    window.validateEmail = validateEmail;
    window.validatePhone = validatePhone;
    window.validatePinCode = validatePinCode;
    window.showToast = showToast;
    window.debounce = debounce;
    window.generateId = generateId;
    window.calculateDiscount = calculateDiscount;
    window.truncateText = truncateText;
}
