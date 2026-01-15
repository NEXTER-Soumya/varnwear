# MongoDB Migration Guide

## Setup Instructions

### 1. Install MongoDB
- Download and install MongoDB Community Server from: https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```
  net start MongoDB
  ```

### 2. Install Node.js Dependencies
```bash
cd c:\Users\Dell\Desktop\Varnwear
npm install
```

### 3. Start the Backend Server
```bash
npm start
```
Or for development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:3000

### 4. Update HTML Files
Replace the old script tags in ALL HTML files:

**REMOVE these lines:**
```html
<script src="js/auth.js"></script>
<script src="js/products.js"></script>
<script src="js/admin-products.js"></script>
```

**ADD this line instead:**
```html
<script src="js/api.js"></script>
```

### 5. Files to Update
Update the following HTML files with the new script tag:
- index.html
- products.html
- product-detail.html
- cart.html
- wishlist.html
- checkout.html
- login.html
- register.html
- orders.html
- profile.html
- admin/index.html
- admin/products.html
- admin/orders.html
- admin/users.html
- admin/login.html

## What Changed

### Data Storage
- **Before**: localStorage (cleared on browser/system restart)
- **After**: MongoDB (persistent across restarts)

### Images
- **Before**: Lost when localStorage cleared
- **After**: Stored in `assets/images/` folder and referenced in MongoDB

### API Functions
All functions remain the same but now use MongoDB:
- `getAllProducts()` - Now async, returns Promise
- `registerUser()` - Now async, returns Promise
- `loginUser()` - Now async, returns Promise
- All other functions work the same way

### Code Changes Required
Since functions are now async, update your code:

**Before:**
```javascript
const products = getAllProducts();
```

**After:**
```javascript
const products = await getAllProducts();
// OR
getAllProducts().then(products => {
    // use products here
});
```

## Default Admin Account
- Username: `admin`
- Password: `admin123`

## Migrating Existing Data

If you have existing products in localStorage, run this in browser console:
```javascript
const products = JSON.parse(localStorage.getItem('products') || '[]');
products.forEach(async (product) => {
    await addProduct(product);
});
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running: `net start MongoDB`
- Check connection string in `.env` file

### Port Already in Use
- Change PORT in `.env` file
- Update API_URL in `js/api.js` to match new port

### Images Not Loading
- Ensure images are in `assets/images/` folder
- Check file paths in product data
