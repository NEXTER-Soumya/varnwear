# VarnWear E-Commerce Website

## 🚀 Quick Start with MongoDB

**NEW: Now with persistent MongoDB storage!**

Simply run:
```bash
start.bat
```

Or see [QUICKSTART_MONGODB.md](QUICKSTART_MONGODB.md) for detailed setup.

## Project Structure

### Root Files
- `index.html` - Homepage
- `products.html` - Products listing page
- `product-detail.html` - Individual product details
- `cart.html` - Shopping cart
- `wishlist.html` - User wishlist
- `checkout.html` - Checkout process
- `login.html` - User login
- `register.html` - User registration
- `orders.html` - User order history
- `profile.html` - User profile management

### Admin Panel (`/admin`)
- `index.html` - Admin dashboard
- `products.html` - Product management (CRUD)
- `orders.html` - Order management
- `users.html` - User management
- `login.html` - Admin login

### CSS (`/css`)
- `global.css` - Global styles, theme colors, reusable components
- `user.css` - User-facing pages styles
- `admin.css` - Admin panel styles

### JavaScript (`/js`)
**User Logic:**
- `api.js` - **NEW** MongoDB API client (replaces localStorage)
- `auth.js` - User authentication (DEPRECATED - use api.js)
- `cart.js` - Cart operations (add, remove, update quantity)
- `wishlist.js` - Wishlist operations (add, remove)
- `products.js` - Product display (DEPRECATED - use api.js)
- `orders.js` - Order placement and history
- `utils.js` - Utility functions (currency format, validation, etc.)

**Admin Logic:**
- `admin-auth.js` - Admin authentication
- `admin-products.js` - Product CRUD (DEPRECATED - use api.js)
- `admin-orders.js` - Order management (status updates)
- `admin-users.js` - User management

**Backend:**
- `server.js` - Express server with MongoDB
- `models.js` - Database schemas
- `seed.js` - Sample data seeder

### Assets (`/assets`)
- `/images` - Product images, logos, icons

## Data Storage

### MongoDB Database (NEW)
- **Products** - Product catalog with images
- **Users** - User accounts with hashed passwords
- **Admins** - Admin accounts
- **Orders** - Order history

### localStorage (Session Only)
- `cart_{userId}` - User-specific cart
- `wishlist_{userId}` - User-specific wishlist
- `currentUser` - Active session
- `currentAdmin` - Active admin session

### File Storage
- Product images stored in `assets/images/`
- Image paths referenced in MongoDB

## Theme
- Black: #000000
- Gold: #D4AF37
- White: #FFFFFF
- Currency: INR (₹)
