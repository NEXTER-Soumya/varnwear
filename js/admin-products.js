// ========================================
// VarnWear - Admin Products Management
// ========================================

// All product CRUD operations are in products.js
// This file is for admin-specific product operations

// Bulk update stock
function bulkUpdateStock(updates) {
    const results = [];
    updates.forEach(update => {
        const result = updateStock(update.productId, update.stock);
        results.push(result);
    });
    return results;
}

// Get low stock products
function getLowStockProducts(threshold = 10) {
    const products = getAllProducts();
    return products.filter(p => p.stock <= threshold);
}

// Get out of stock products
function getOutOfStockProducts() {
    const products = getAllProducts();
    return products.filter(p => p.stock === 0);
}

// Export functions
if (typeof window !== 'undefined') {
    window.bulkUpdateStock = bulkUpdateStock;
    window.getLowStockProducts = getLowStockProducts;
    window.getOutOfStockProducts = getOutOfStockProducts;
}
