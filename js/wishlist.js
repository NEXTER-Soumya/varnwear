// ========================================
// VarnWear - Wishlist Management
// ========================================

// Get user's wishlist
function getWishlist() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const wishlist = localStorage.getItem(`wishlist_${user.id}`);
    return wishlist ? JSON.parse(wishlist) : [];
}

// Save wishlist
function saveWishlist(wishlist) {
    const user = getCurrentUser();
    if (!user) return false;
    
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(wishlist));
    return true;
}

// Add to wishlist
async function addToWishlist(productId) {
    if (!requireAuthForWishlist()) return false;
    
    const product = await getProductById(productId);
    if (!product) {
        alert('Product not found');
        return false;
    }
    
    const wishlist = getWishlist();
    
    if (wishlist.includes(productId)) {
        return false; // Already in wishlist
    }
    
    wishlist.push(productId);
    saveWishlist(wishlist);
    return true;
}

// Remove from wishlist
function removeFromWishlist(productId) {
    const wishlist = getWishlist();
    const filtered = wishlist.filter(id => id !== productId);
    saveWishlist(filtered);
    return true;
}

// Get wishlist with product details
async function getWishlistWithDetails() {
    const wishlist = getWishlist();
    const products = [];
    for (const productId of wishlist) {
        const product = await getProductById(productId);
        if (product) products.push(product);
    }
    return products;
}

// Move wishlist item to cart
async function moveToCart(productId) {
    if (!requireAuthForCart()) return false;
    
    const result = await addToCart(productId, 1);
    if (result) {
        removeFromWishlist(productId);
        return true;
    }
    return false;
}

// Clear wishlist
function clearWishlist() {
    const user = getCurrentUser();
    if (!user) return false;
    
    localStorage.removeItem(`wishlist_${user.id}`);
    return true;
}

// Export functions
if (typeof window !== 'undefined') {
    window.getWishlist = getWishlist;
    window.addToWishlist = addToWishlist;
    window.removeFromWishlist = removeFromWishlist;
    window.getWishlistWithDetails = getWishlistWithDetails;
    window.moveToCart = moveToCart;
    window.clearWishlist = clearWishlist;
}
