# 🚀 Quick Start - MongoDB Migration

## Problem Solved
✅ Product images no longer disappear after system restart  
✅ User data persists across sessions  
✅ All data stored permanently in MongoDB database  

## Prerequisites
1. **MongoDB** - Download from: https://www.mongodb.com/try/download/community
2. **Node.js** - Download from: https://nodejs.org/

## 🎯 One-Command Setup (Windows)

Simply double-click `start.bat` or run:
```bash
start.bat
```

This will:
- Start MongoDB service
- Install dependencies
- Seed database with sample products
- Start the server

## 📋 Manual Setup

### Step 1: Start MongoDB
```bash
net start MongoDB
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Update HTML Files (Automatic)
```bash
node update-html.js
```

### Step 4: Seed Database
```bash
npm run seed
```

### Step 5: Start Server
```bash
npm start
```

## 🌐 Access Application

- **Frontend**: Open `index.html` in browser (or use Live Server)
- **Backend API**: http://localhost:3000
- **Admin Login**: username: `admin`, password: `admin123`

## 📁 What Was Created

### Backend Files
- `server.js` - Express server with MongoDB
- `models.js` - Database schemas (User, Product, Admin)
- `seed.js` - Sample data seeder
- `.env` - Configuration file

### Frontend Files
- `js/api.js` - Replaces localStorage with API calls

### Helper Files
- `start.bat` - Automated setup script
- `update-html.js` - Updates all HTML files
- `MONGODB_SETUP.md` - Detailed documentation

## 🔄 What Changed

### Before (localStorage)
```javascript
const products = getAllProducts(); // Synchronous
```

### After (MongoDB)
```javascript
const products = await getAllProducts(); // Asynchronous
```

All function names remain the same, but now return Promises.

## 📸 Image Storage

Images are now stored in two ways:
1. **Files**: In `assets/images/` folder
2. **References**: Image paths stored in MongoDB

When admin uploads images, they are:
- Saved to `assets/images/`
- Path stored in database
- Persist across restarts

## 🔐 Default Accounts

### Admin
- Username: `admin`
- Password: `admin123`

### Sample Products
10 products with existing images are automatically added when you run `npm run seed`

## 🛠️ Troubleshooting

### MongoDB Not Starting
```bash
# Check if MongoDB is installed
mongod --version

# Start manually
net start MongoDB
```

### Port 3000 Already in Use
Edit `.env` file:
```
PORT=3001
```

Then update `js/api.js`:
```javascript
const API_URL = 'http://localhost:3001/api';
```

### Images Not Loading
- Ensure images exist in `assets/images/` folder
- Check browser console for errors
- Verify server is running

## 📊 Database Structure

### Products Collection
```javascript
{
  name: String,
  images: [String],      // Array of image paths
  price: Number,
  sizes: [String],
  stock: Number,
  category: String,
  description: String
}
```

### Users Collection
```javascript
{
  firstName: String,
  lastName: String,
  email: String,
  password: String,      // Hashed with bcrypt
  profileImage: String,
  phone: String,
  address: Object
}
```

## 🎨 Admin Features

### Add Product with Images
1. Go to Admin Panel → Products
2. Click "Add Product"
3. Upload images (stored permanently)
4. Fill product details
5. Save

Images will persist even after:
- Browser refresh
- System restart
- Server restart

## 📝 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `PUT /api/users/:id` - Update profile
- `GET /api/users/:id` - Get user details

### Upload
- `POST /api/upload` - Upload image file

## 🔄 Migrating Existing Data

If you have data in localStorage, run in browser console:
```javascript
// Export products
const products = JSON.parse(localStorage.getItem('products') || '[]');
console.log(JSON.stringify(products));

// Then add to MongoDB via admin panel
```

## ✅ Verification

After setup, verify:
1. ✅ Server running on http://localhost:3000
2. ✅ Products visible on homepage
3. ✅ Images loading correctly
4. ✅ Can register/login users
5. ✅ Admin panel accessible
6. ✅ Data persists after restart

## 🆘 Need Help?

Check these files:
- `MONGODB_SETUP.md` - Detailed setup guide
- `server.js` - Backend code
- `js/api.js` - Frontend API client

## 🎉 Success!

Your VarnWear application now has:
- ✅ Persistent data storage
- ✅ Permanent image storage
- ✅ Professional database backend
- ✅ Scalable architecture
