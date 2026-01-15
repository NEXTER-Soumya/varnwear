# VarnWear - Quick Start Guide

## 🚀 Getting Started (5 Minutes)

### 1. Open the Project
```bash
cd VarnWear
# Open index.html in browser (no build required!)
```

### 2. Test User Flow
1. Go to `register.html` → Create account
2. Go to `products.html` → Browse products
3. Click product → View details → Add to cart
4. Go to `cart.html` → Update quantity → Checkout
5. Fill address → Select payment → Place order
6. Go to `orders.html` → View your order

### 3. Test Admin Flow
1. Go to `admin/login.html`
2. Login: `admin` / `admin123`
3. Dashboard → View stats
4. Products → Add/Edit/Delete products
5. Orders → Update status → Send delivery confirmation
6. Users → View user details

---

## 📁 Key Files

### Must-Know Files
- `js/access-control.js` - Authentication guards
- `js/auth.js` - User authentication
- `js/products.js` - Product operations
- `js/cart.js` - Cart operations
- `js/orders.js` - Order operations

### Key Pages
- `index.html` - Homepage
- `products.html` - Product listing
- `cart.html` - Shopping cart
- `checkout.html` - Checkout
- `admin/index.html` - Admin dashboard

---

## 🔑 Default Credentials

### Admin
- Username: `admin`
- Password: `admin123`

### Test User (Create Your Own)
- Register at `/register.html`

---

## 💾 localStorage Keys

```javascript
// User Data
users                    // All registered users
currentUser             // Active user session

// Admin Data
currentAdmin            // Active admin session

// Products
products                // All products

// Cart (per user)
cart_user123           // User's cart items

// Wishlist (per user)
wishlist_user123       // User's wishlist

// Orders
orders                 // All orders
```

---

## 🎨 Theme Colors

```css
--black: #000000
--gold: #D4AF37
--white: #FFFFFF
```

---

## 🛠️ Common Tasks

### Add a New Product (Admin)
1. Login to admin panel
2. Go to Products → Add Product
3. Fill form → Save

### Update Order Status (Admin)
1. Go to Orders
2. Click "View" on order
3. Select new status → Update

### Send Delivery Confirmation (Admin)
1. View order details
2. Set delivery date
3. Write message → Send

---

## 🐛 Troubleshooting

### Cart not updating?
- Check if user is logged in
- Check browser console for errors
- Clear localStorage and try again

### Can't login?
- Check credentials
- Clear browser cache
- Check localStorage for `currentUser`

### Products not showing?
- Products auto-initialize on first load
- Check `js/products.js` → `initializeProducts()`

---

## 📝 Quick Code Examples

### Check if user is logged in
```javascript
if (isUserLoggedIn()) {
    console.log('User logged in');
}
```

### Add to cart with guard
```javascript
function addToCart(productId) {
    if (!guardCartAction()) return;
    addToCart(productId, 1);
}
```

### Get all products
```javascript
const products = getAllProducts();
```

### Place order
```javascript
const result = createOrder(shippingAddress, paymentMethod);
```

---

## 🔗 Important Links

- Full Review: `FINAL_REVIEW.md`
- Access Control Guide: `ACCESS_CONTROL.md`
- Project Structure: `README.md`

---

## ✅ Pre-Launch Checklist

- [ ] Test user registration
- [ ] Test user login
- [ ] Test add to cart
- [ ] Test checkout
- [ ] Test order placement
- [ ] Test admin login
- [ ] Test product management
- [ ] Test order management
- [ ] Add product images to `assets/images/`
- [ ] Update sample product data

---

## 🚀 Next Steps

1. **Add Real Images**: Replace placeholder images
2. **Test All Flows**: User and admin
3. **Customize Products**: Update sample products
4. **Deploy**: Upload to hosting (Netlify/Vercel)
5. **Plan Backend**: Follow migration guide in FINAL_REVIEW.md

---

**Need Help?**
- Check `FINAL_REVIEW.md` for detailed documentation
- Check `ACCESS_CONTROL.md` for authentication guide
- Check browser console for errors

---

*Happy Coding! 🎉*
