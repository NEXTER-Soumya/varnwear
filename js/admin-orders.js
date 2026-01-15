// ========================================
// VarnWear - Admin Orders Management
// ========================================

// Confirm delivery with date and message
function confirmDelivery(orderId, deliveryDate, message) {
    const orders = getAllOrders();
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex === -1) {
        return { success: false, message: 'Order not found' };
    }

    orders[orderIndex].deliveryDate = deliveryDate;
    orders[orderIndex].confirmationMessage = message;
    orders[orderIndex].status = 'delivered';
    orders[orderIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem('orders', JSON.stringify(orders));

    return { success: true, order: orders[orderIndex] };
}

// Get orders by status
function getOrdersByStatus(status) {
    const orders = getAllOrders();
    return orders.filter(order => order.status === status);
}

// Get orders by date range
function getOrdersByDateRange(startDate, endDate) {
    const orders = getAllOrders();
    return orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
}

// Get revenue by date range
function getRevenueByDateRange(startDate, endDate) {
    const orders = getOrdersByDateRange(startDate, endDate);
    return orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0);
}

// Export functions
if (typeof window !== 'undefined') {
    window.confirmDelivery = confirmDelivery;
    window.getOrdersByStatus = getOrdersByStatus;
    window.getOrdersByDateRange = getOrdersByDateRange;
    window.getRevenueByDateRange = getRevenueByDateRange;
}
