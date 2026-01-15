// ========================================
// VarnWear - Cart Management
// ========================================

// Guard for cart actions
function guardCartAction() {
    return requireAuthForCart();
}

// Get user's cart
function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const cart = localStorage.getItem(`cart_${user.id}`);
    return cart ? JSON.parse(cart) : [];
}

// Save cart
function saveCart(cart) {
    const user = getCurrentUser();
    if (!user) return false;
    
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    return true;
}

// Add to cart
async function addToCart(productId, quantity = 1, size = null) {
    if (!requireAuthForCart()) return false;
    
    const product = await getProductById(productId);
    if (!product) {
        alert('Product not found');
        return false;
    }
    
    if (product.stock < quantity) {
        alert('Insufficient stock');
        return false;
    }
    
    const cart = getCart();
    
    // Check if product with same size already exists
    const existingIndex = cart.findIndex(item => 
        item.productId === productId && item.size === size
    );
    
    if (existingIndex > -1) {
        // Update quantity
        const newQuantity = cart[existingIndex].quantity + quantity;
        if (newQuantity > product.stock) {
            alert('Cannot add more than available stock');
            return false;
        }
        cart[existingIndex].quantity = newQuantity;
    } else {
        // Add new item
        cart.push({
            productId,
            quantity,
            size,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart(cart);
    return true;
}

// Remove from cart
function removeFromCart(productId, size = null) {
    const cart = getCart();
    const filtered = cart.filter(item => 
        !(item.productId === productId && item.size === size)
    );
    saveCart(filtered);
    return true;
}

// Update cart item quantity
async function updateCartQuantity(productId, quantity, size = null) {
    const product = await getProductById(productId);
    if (!product) return false;
    
    if (quantity > product.stock) {
        alert('Cannot exceed available stock');
        return false;
    }
    
    if (quantity <= 0) {
        removeFromCart(productId, size);
        return true;
    }
    
    const cart = getCart();
    const item = cart.find(item => 
        item.productId === productId && item.size === size
    );
    
    if (item) {
        item.quantity = quantity;
        saveCart(cart);
        return true;
    }
    
    return false;
}

// Get cart with product details
async function getCartWithDetails() {
    const cart = getCart();
    const items = [];
    for (const item of cart) {
        const product = await getProductById(item.productId);
        if (product) {
            items.push({ ...item, product });
        }
    }
    return items;
}

// Calculate cart total
async function getCartTotal() {
    const cart = await getCartWithDetails();
    return cart.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
}

// Get cart item count
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Clear cart
function clearCart() {
    const user = getCurrentUser();
    if (!user) return false;
    
    localStorage.removeItem(`cart_${user.id}`);
    return true;
}

// Check if product is in cart
function isInCart(productId) {
    const cart = getCart();
    return cart.some(item => item.productId === productId);
}

// Export functions
if (typeof window !== 'undefined') {
    window.guardCartAction = guardCartAction;
    window.getCart = getCart;
    window.addToCart = addToCart;
    window.removeFromCart = removeFromCart;
    window.updateCartQuantity = updateCartQuantity;
    window.getCartWithDetails = getCartWithDetails;
    window.getCartTotal = getCartTotal;
    window.getCartItemCount = getCartItemCount;
    window.clearCart = clearCart;
    window.isInCart = isInCart;
}
