// ========================================
// VarnWear - Product Reviews
// ========================================

// Get all reviews for a product
function getProductReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    return reviews.filter(r => r.productId === productId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Add review
function addReview(productId, rating, comment) {
    const user = getCurrentUser();
    if (!user) {
        return { success: false, message: 'Please login to write a review' };
    }

    if (rating < 1 || rating > 5) {
        return { success: false, message: 'Rating must be between 1 and 5' };
    }

    if (!comment || comment.trim().length < 10) {
        return { success: false, message: 'Review must be at least 10 characters' };
    }

    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Check if user already reviewed this product (only for new reviews)
    const existingReview = reviews.find(r => r.productId === productId && r.userId === user.id);
    if (existingReview) {
        return { success: false, message: 'You have already reviewed this product. Use edit to modify your review.' };
    }

    const review = {
        id: generateReviewId(),
        productId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString()
    };

    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));

    return { success: true, review };
}

// Get average rating for product
function getAverageRating(productId) {
    const reviews = getProductReviews(productId);
    if (reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
}

// Get review count
function getReviewCount(productId) {
    return getProductReviews(productId).length;
}

// Generate review ID
function generateReviewId() {
    return 'review_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Export functions
if (typeof window !== 'undefined') {
    window.getProductReviews = getProductReviews;
    window.addReview = addReview;
    window.getAverageRating = getAverageRating;
    window.getReviewCount = getReviewCount;
}
