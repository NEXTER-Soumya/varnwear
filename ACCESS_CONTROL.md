# VarnWear - Access Control Module

## Overview
Centralized authentication and authorization system for VarnWear e-commerce platform.

## Installation
Include the access control module in your HTML pages:

```html
<script src="js/access-control.js"></script>
```

## Usage

### 1. Auto-Protection (Recommended)
Add to any page that needs protection:

```javascript
// Automatically protects based on URL
document.addEventListener('DOMContentLoaded', () => {
    initAccessControl();
});
```

### 2. Manual Guards

#### Protect User Pages
```javascript
// Profile, Orders, Wishlist pages
if (!requireUserAuth()) {
    // User will be redirected to login
}
```

#### Protect Cart Actions
```javascript
// Add to cart button
function addToCartHandler(productId) {
    if (!guardCartAction()) return;
    
    // Proceed with adding to cart
    addToCart(productId, 1);
}
```

#### Protect Wishlist Actions
```javascript
// Add to wishlist button
function addToWishlistHandler(productId) {
    if (!guardWishlistAction()) return;
    
    // Proceed with adding to wishlist
    addToWishlist(productId);
}
```

#### Protect Checkout
```javascript
// Checkout button
function proceedToCheckout() {
    if (!guardCheckout()) return;
    
    // Proceed to checkout
    window.location.href = 'checkout.html';
}
```

#### Protect Admin Pages
```javascript
// All admin pages
if (!requireAdminAuth()) {
    // Admin will be redirected to admin login
}
```

### 3. Check Authentication Status

```javascript
// Check if user is logged in
if (isUserLoggedIn()) {
    console.log('User is logged in');
}

// Get current user
const user = getCurrentUser();
console.log(user.firstName, user.email);

// Check if admin is logged in
if (isAdminLoggedIn()) {
    console.log('Admin is logged in');
}

// Get current admin
const admin = getCurrentAdmin();
console.log(admin.username);
```

## Protected Routes

### User Routes (Require User Login)
- `/cart.html`
- `/wishlist.html`
- `/orders.html`
- `/profile.html`
- `/checkout.html`

### Admin Routes (Require Admin Login)
- `/admin/index.html` (Dashboard)
- `/admin/products.html`
- `/admin/orders.html`
- `/admin/users.html`

### Public Routes (No Authentication Required)
- `/index.html` (Home)
- `/products.html`
- `/product-detail.html`
- `/login.html`
- `/register.html`

## Guard Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `requireUserAuth()` | Protect user pages | `true` if logged in, redirects if not |
| `guardCartAction()` | Protect cart actions | `true` if logged in, shows confirm dialog |
| `guardWishlistAction()` | Protect wishlist actions | `true` if logged in, shows confirm dialog |
| `guardCheckout()` | Protect checkout | `true` if logged in, redirects if not |
| `requireAdminAuth()` | Protect admin pages | `true` if admin logged in, redirects if not |
| `guardLoginPage()` | Prevent logged-in users from login page | Redirects to home if logged in |
| `guardAdminLoginPage()` | Prevent logged-in admin from login page | Redirects to dashboard if logged in |

## Examples

### Example 1: Product Detail Page
```html
<button onclick="addToCartWithGuard()">Add to Cart</button>
<button onclick="addToWishlistWithGuard()">Add to Wishlist</button>

<script src="js/access-control.js"></script>
<script>
function addToCartWithGuard() {
    if (!guardCartAction()) return;
    addToCart(productId, 1);
    alert('Added to cart!');
}

function addToWishlistWithGuard() {
    if (!guardWishlistAction()) return;
    addToWishlist(productId);
    alert('Added to wishlist!');
}
</script>
```

### Example 2: Cart Page
```html
<script src="js/access-control.js"></script>
<script>
// Protect entire page
if (!requireUserAuth()) {
    // User will be redirected to login
}

// Load cart
displayCart();
</script>
```

### Example 3: Admin Dashboard
```html
<script src="js/access-control.js"></script>
<script>
// Protect admin page
if (!requireAdminAuth()) {
    // Admin will be redirected to admin login
}

// Load dashboard
loadDashboard();
</script>
```

## Backward Compatibility

The module provides aliases for existing code:

```javascript
// Old code still works
isLoggedIn() === isUserLoggedIn()
requireAuth() === requireUserAuth()
requireAuthForCart() === guardCartAction()
requireAuthForWishlist() === guardWishlistAction()
requireAuthForCheckout() === guardCheckout()
```

## Security Features

1. **Automatic Redirects** - Unauthorized users redirected to login
2. **Return URLs** - Users redirected back after login
3. **Confirm Dialogs** - User-friendly prompts for cart/wishlist actions
4. **Session Validation** - Checks localStorage for valid sessions
5. **Separation of Concerns** - User and admin sessions completely separate
6. **Login Page Guards** - Prevent logged-in users from accessing login pages

## localStorage Keys

- `currentUser` - User session data
- `currentAdmin` - Admin session data

## Notes

- All guards return `boolean` values
- Failed guards automatically handle redirects
- Cart/Wishlist guards show confirm dialogs before redirect
- Admin and user sessions are independent
- No external dependencies required
