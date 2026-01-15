// ========================================
// VarnWear - Orders Management
// ========================================

// Create new order
async function createOrder(shippingAddress, paymentMethod) {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, message: 'User not logged in' };
    }

    const cart = await getCartWithDetails();
    if (cart.length === 0) {
        return { success: false, message: 'Cart is empty' };
    }

    // Calculate totals
    const subtotal = await getCartTotal();
    const shipping = subtotal >= 2000 ? 0 : 100;
    const total = subtotal + shipping;

    // Create order object
    const order = {
        id: generateOrderId(),
        userId: user.id,
        items: cart.map(item => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.images[0] || null,
            quantity: item.quantity,
            size: item.size,
            price: item.product.price
        })),
        shippingAddress,
        paymentMethod,
        subtotal,
        shipping,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Save order
    const orders = getAllOrders();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Reduce stock for each product
    for (const item of cart) {
        await reduceStock(item.productId, item.quantity);
    }

    // Clear cart
    clearCart();

    return { success: true, order };
}

// Get all orders
function getAllOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
}

// Get user's orders
function getUserOrders() {
    const user = getCurrentUser();
    if (!user) return [];

    const orders = getAllOrders();
    return orders.filter(order => order.userId === user.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Get order by ID
function getOrderById(orderId) {
    const orders = getAllOrders();
    return orders.find(order => order.id === orderId);
}

// Update order status (Admin only)
function updateOrderStatus(orderId, newStatus) {
    const orders = getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
        return { success: false, message: 'Order not found' };
    }

    orders[orderIndex].status = newStatus;
    orders[orderIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(orders));

    return { success: true, order: orders[orderIndex] };
}

// Cancel order (User can cancel if status is pending)
async function cancelOrder(orderId) {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, message: 'User not logged in' };
    }

    const orders = getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId && order.userId === user.id);

    if (orderIndex === -1) {
        return { success: false, message: 'Order not found' };
    }

    if (orders[orderIndex].status !== 'pending') {
        return { success: false, message: 'Cannot cancel order in current status' };
    }

    orders[orderIndex].status = 'cancelled';
    orders[orderIndex].updatedAt = new Date().toISOString();
    localStorage.setItem('orders', JSON.stringify(orders));

    // Restore stock
    for (const item of orders[orderIndex].items) {
        const product = await getProductById(item.productId);
        if (product) {
            await updateStock(item.productId, product.stock + item.quantity);
        }
    }

    return { success: true, order: orders[orderIndex] };
}

// Get order statistics (Admin)
function getOrderStats() {
    const orders = getAllOrders();
    
    return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
            .filter(o => o.status !== 'cancelled')
            .reduce((sum, o) => sum + o.total, 0)
    };
}

// Generate unique order ID
function generateOrderId() {
    return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Export functions
if (typeof window !== 'undefined') {
    window.createOrder = createOrder;
    window.getAllOrders = getAllOrders;
    window.getUserOrders = getUserOrders;
    window.getOrderById = getOrderById;
    window.updateOrderStatus = updateOrderStatus;
    window.cancelOrder = cancelOrder;
    window.getOrderStats = getOrderStats;
}
