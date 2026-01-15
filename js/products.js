// ========================================
// VarnWear - Products Management
// ========================================

// Initialize sample products if none exist
function initializeProducts() {
    const products = localStorage.getItem('products');
    if (!products) {
        const sampleProducts = [
            {
                id: 'prod_001',
                name: 'Classic Black Blazer',
                images: ['assets/images/blazer1.jpg', 'assets/images/blazer2.jpg'],
                video: null,
                price: 4999,
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 25,
                category: 'Blazers',
                description: 'Premium black blazer with gold accents. Perfect for formal occasions.'
            },
            {
                id: 'prod_002',
                name: 'Gold Embroidered Kurta',
                images: ['assets/images/kurta1.jpg'],
                video: null,
                price: 2999,
                sizes: ['M', 'L', 'XL'],
                stock: 15,
                category: 'Ethnic Wear',
                description: 'Elegant kurta with intricate gold embroidery.'
            },
            {
                id: 'prod_003',
                name: 'Designer Leather Jacket',
                images: ['assets/images/jacket1.jpg', 'assets/images/jacket2.jpg', 'assets/images/jacket3.jpg'],
                video: 'assets/videos/jacket-demo.mp4',
                price: 7999,
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 10,
                category: 'Jackets',
                description: 'Premium leather jacket with modern design and gold zippers.'
            },
            {
                id: 'prod_004',
                name: 'Formal White Shirt',
                images: ['assets/images/shirt1.jpg'],
                video: null,
                price: 1499,
                sizes: ['S', 'M', 'L', 'XL'],
                stock: 50,
                category: 'Shirts',
                description: 'Classic white formal shirt for professional look.'
            },
            {
                id: 'prod_005',
                name: 'Premium Denim Jeans',
                images: ['assets/images/jeans1.jpg'],
                video: null,
                price: 2499,
                sizes: ['28', '30', '32', '34', '36'],
                stock: 0,
                category: 'Jeans',
                description: 'High-quality denim jeans with perfect fit.'
            }
        ];
        localStorage.setItem('products', JSON.stringify(sampleProducts));
    }
}

// Get all products
function getAllProducts() {
    initializeProducts();
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Get product by ID
function getProductById(productId) {
    const products = getAllProducts();
    return products.find(p => p.id === productId);
}

// Get products by category
function getProductsByCategory(category) {
    const products = getAllProducts();
    return products.filter(p => p.category === category);
}

// Search products
function searchProducts(query) {
    const products = getAllProducts();
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        (p.description && p.description.toLowerCase().includes(lowerQuery))
    );
}

// Filter products by price range
function filterByPriceRange(minPrice, maxPrice) {
    const products = getAllProducts();
    return products.filter(p => p.price >= minPrice && p.price <= maxPrice);
}

// Check if product is in stock
function isInStock(productId) {
    const product = getProductById(productId);
    return product && product.stock > 0;
}

// Get available sizes for product
function getAvailableSizes(productId) {
    const product = getProductById(productId);
    return product ? product.sizes : [];
}

// Add new product (Admin only)
function addProduct(productData) {
    const products = getAllProducts();
    
    // Generate product ID
    const newProduct = {
        id: generateProductId(),
        name: productData.name,
        images: productData.images || [],
        video: productData.video || null,
        price: parseFloat(productData.price),
        sizes: productData.sizes || [],
        stock: parseInt(productData.stock) || 0,
        category: productData.category,
        description: productData.description || '',
        createdAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true, product: newProduct };
}

// Update product (Admin only)
function updateProduct(productId, updates) {
    const products = getAllProducts();
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
        return { success: false, message: 'Product not found' };
    }
    
    products[index] = { ...products[index], ...updates };
    localStorage.setItem('products', JSON.stringify(products));
    
    return { success: true, product: products[index] };
}

// Delete product (Admin only)
function deleteProduct(productId) {
    const products = getAllProducts();
    const filtered = products.filter(p => p.id !== productId);
    
    if (filtered.length === products.length) {
        return { success: false, message: 'Product not found' };
    }
    
    localStorage.setItem('products', JSON.stringify(filtered));
    return { success: true };
}

// Update stock (Admin only)
function updateStock(productId, newStock) {
    return updateProduct(productId, { stock: parseInt(newStock) });
}

// Reduce stock (when order is placed)
function reduceStock(productId, quantity) {
    const product = getProductById(productId);
    if (!product) return { success: false, message: 'Product not found' };
    
    if (product.stock < quantity) {
        return { success: false, message: 'Insufficient stock' };
    }
    
    return updateProduct(productId, { stock: product.stock - quantity });
}

// Generate unique product ID
function generateProductId() {
    return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get all categories
function getAllCategories() {
    const products = getAllProducts();
    return [...new Set(products.map(p => p.category))];
}

// Get featured products (in stock, sorted by price)
function getFeaturedProducts(limit = 8) {
    const products = getAllProducts();
    return products
        .filter(p => p.stock > 0)
        .sort((a, b) => b.price - a.price)
        .slice(0, limit);
}

// Export functions
if (typeof window !== 'undefined') {
    window.initializeProducts = initializeProducts;
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
}
