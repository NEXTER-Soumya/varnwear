// ========================================
// VarnWear - API Client (MongoDB Backend)
// ========================================

// Automatically detect API URL based on environment
const API_URL = (() => {
    const hostname = window.location.hostname;
    
    // Production (Render or any deployed site)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return `${window.location.origin}/api`;
    }
    
    // Local development
    return 'http://localhost:3000/api';
})();

// ============ USER API ============
async function registerUser(firstName, lastName, email, password, profileImage = null) {
    try {
        const res = await fetch(`${API_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, password, profileImage })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        return data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}

async function loginUser(email, password) {
    try {
        const res = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        return data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}

function logoutUser() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

function isUserLoggedIn() {
    return isLoggedIn();
}

function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function requireAuth(redirectUrl = null) {
    if (!isLoggedIn()) {
        const currentPage = redirectUrl || window.location.pathname;
        window.location.href = `login.html?redirect=${encodeURIComponent(currentPage)}`;
        return false;
    }
    return true;
}

async function updateUserProfile(updates) {
    const currentUser = getCurrentUser();
    if (!currentUser) return { success: false, message: 'Not logged in' };
    
    try {
        const res = await fetch(`${API_URL}/users/${currentUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('currentUser', JSON.stringify(data.user));
        }
        return data;
    } catch (err) {
        return { success: false, message: err.message };
    }
}

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

function requireAuthForCart() {
    return authGuard('add items to cart');
}

function requireAuthForWishlist() {
    return authGuard('add items to wishlist');
}

function requireAuthForCheckout() {
    return authGuard('place an order');
}

// ============ PRODUCT API ============
async function getAllProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        return await res.json();
    } catch (err) {
        console.error('Error fetching products:', err);
        return [];
    }
}

async function getProductById(productId) {
    try {
        const res = await fetch(`${API_URL}/products/${productId}`);
        return await res.json();
    } catch (err) {
        console.error('Error fetching product:', err);
        return null;
    }
}

async function getProductsByCategory(category) {
    const products = await getAllProducts();
    return products.filter(p => p.category === category);
}

async function searchProducts(query) {
    const products = await getAllProducts();
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
}

async function filterByPriceRange(minPrice, maxPrice) {
    const products = await getAllProducts();
    return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

async function isInStock(productId) {
    const product = await getProductById(productId);
    return product && product.stock > 0;
}

async function getAvailableSizes(productId) {
    const product = await getProductById(productId);
    return product ? product.sizes : [];
}

async function addProduct(productData) {
    try {
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
}

async function updateProduct(productId, updates) {
    try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
}

async function deleteProduct(productId) {
    try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
}

async function updateStock(productId, newStock) {
    return await updateProduct(productId, { stock: parseInt(newStock) });
}

async function reduceStock(productId, quantity) {
    const product = await getProductById(productId);
    if (!product) return { success: false, message: 'Product not found' };
    if (product.stock < quantity) return { success: false, message: 'Insufficient stock' };
    return await updateProduct(productId, { stock: product.stock - quantity });
}

async function getAllCategories() {
    const products = await getAllProducts();
    return [...new Set(products.map(p => p.category))];
}

async function getFeaturedProducts(limit = 8) {
    const products = await getAllProducts();
    return products
        .filter(p => p.stock > 0)
        .sort((a, b) => b.price - a.price)
        .slice(0, limit);
}

async function uploadImage(file) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        return await res.json();
    } catch (err) {
        return { success: false, message: err.message };
    }
}

// ============ ADMIN API ============
async function bulkUpdateStock(updates) {
    const results = [];
    for (const update of updates) {
        const result = await updateStock(update.productId, update.stock);
        results.push(result);
    }
    return results;
}

async function getLowStockProducts(threshold = 10) {
    const products = await getAllProducts();
    return products.filter(p => p.stock <= threshold);
}

async function getOutOfStockProducts() {
    const products = await getAllProducts();
    return products.filter(p => p.stock === 0);
}

// Export functions
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
    window.getAllProducts = getAllProducts;
    window.getProductById = getProductById;
    window.getProductsByCategory = getProductsByCategory;
    window.searchProducts = searchProducts;
    window.filterByPriceRange = filterByPriceRange;
    window.isInStock = isInStock;
    window.getAvailableSizes = getAvailableSizes;
    window.addProduct = addProduct;
    window.updateProduct = updateProduct;
    window.deleteProduct = deleteProduct;
    window.updateStock = updateStock;
    window.reduceStock = reduceStock;
    window.getAllCategories = getAllCategories;
    window.getFeaturedProducts = getFeaturedProducts;
    window.uploadImage = uploadImage;
    window.bulkUpdateStock = bulkUpdateStock;
    window.getLowStockProducts = getLowStockProducts;
    window.getOutOfStockProducts = getOutOfStockProducts;
}
