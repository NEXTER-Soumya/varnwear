# ✅ MongoDB Migration Checklist

Follow these steps in order to complete the migration:

## Prerequisites
- [ ] MongoDB installed on your system
- [ ] Node.js installed on your system

## Step 1: Install MongoDB
- [ ] Download MongoDB Community Server from https://www.mongodb.com/try/download/community
- [ ] Install MongoDB
- [ ] Verify installation: Open Command Prompt and run `mongod --version`

## Step 2: Start MongoDB Service
- [ ] Open Command Prompt as Administrator
- [ ] Run: `net start MongoDB`
- [ ] Verify it says "The MongoDB service was started successfully"

## Step 3: Install Dependencies
- [ ] Open Command Prompt
- [ ] Navigate to project folder: `cd c:\Users\Dell\Desktop\Varnwear`
- [ ] Run: `npm install`
- [ ] Wait for installation to complete

## Step 4: Update HTML Files
- [ ] In the same Command Prompt, run: `node update-html.js`
- [ ] Verify it says "Updated X files"

## Step 5: Seed Database
- [ ] Run: `npm run seed`
- [ ] Verify it says "Added 10 products"
- [ ] Verify it says "Database seeded successfully!"

## Step 6: Start Server
- [ ] Run: `npm start`
- [ ] Verify it says "Server running on http://localhost:3000"
- [ ] Verify it says "MongoDB Connected"
- [ ] Keep this Command Prompt window open

## Step 7: Test Frontend
- [ ] Open a new browser window
- [ ] Open `index.html` (or use Live Server extension)
- [ ] Verify products are displayed on homepage
- [ ] Verify product images are visible
- [ ] Click on a product to view details

## Step 8: Test User Registration
- [ ] Click "Login" button
- [ ] Click "Register" link
- [ ] Fill in registration form
- [ ] Submit and verify successful registration
- [ ] Verify you're logged in

## Step 9: Test Admin Panel
- [ ] Navigate to `admin/login.html`
- [ ] Login with:
  - Username: `admin`
  - Password: `admin123`
- [ ] Verify admin dashboard loads
- [ ] Go to Products section
- [ ] Verify all products are listed

## Step 10: Test Image Upload
- [ ] In admin panel, click "Add Product"
- [ ] Fill in product details
- [ ] Upload an image file
- [ ] Save product
- [ ] Verify product appears in list with image

## Step 11: Test Persistence
- [ ] Close browser completely
- [ ] Stop server (Ctrl+C in Command Prompt)
- [ ] Restart server: `npm start`
- [ ] Open browser and go to homepage
- [ ] Verify all products still visible
- [ ] Verify all images still loading
- [ ] ✅ SUCCESS! Data persists!

## Step 12: Test System Restart (Optional)
- [ ] Restart your computer
- [ ] Start MongoDB: `net start MongoDB`
- [ ] Start server: `npm start`
- [ ] Open browser and check homepage
- [ ] Verify everything still works
- [ ] ✅ COMPLETE! Full persistence achieved!

## Troubleshooting

### MongoDB won't start
```bash
# Check if already running
net start MongoDB

# If error, try:
mongod --dbpath "C:\data\db"
```

### Port 3000 in use
- [ ] Edit `.env` file
- [ ] Change `PORT=3000` to `PORT=3001`
- [ ] Edit `js/api.js`
- [ ] Change `http://localhost:3000` to `http://localhost:3001`
- [ ] Restart server

### Images not loading
- [ ] Check if images exist in `assets/images/` folder
- [ ] Check browser console for errors (F12)
- [ ] Verify server is running
- [ ] Check image paths in database

### Products not showing
- [ ] Verify server is running
- [ ] Check browser console for errors
- [ ] Verify MongoDB is running
- [ ] Try running seed again: `npm run seed`

## Quick Commands Reference

### Start Everything (Easy Way)
```bash
start.bat
```

### Manual Start
```bash
# Terminal 1: Start MongoDB
net start MongoDB

# Terminal 2: Start Server
npm start
```

### Seed Database
```bash
npm run seed
```

### Update HTML Files
```bash
node update-html.js
```

## Files You Created

✅ Backend:
- server.js
- models.js
- seed.js
- package.json
- .env

✅ Frontend:
- js/api.js

✅ Automation:
- start.bat
- update-html.js

✅ Documentation:
- QUICKSTART_MONGODB.md
- MONGODB_SETUP.md
- MONGODB_MIGRATION.md
- ARCHITECTURE.md
- CHECKLIST.md (this file)

## Success Criteria

Your migration is successful when:
- ✅ Server starts without errors
- ✅ Products display on homepage
- ✅ Images load correctly
- ✅ User registration works
- ✅ User login works
- ✅ Admin login works
- ✅ Data persists after browser close
- ✅ Data persists after server restart
- ✅ Data persists after system restart

## Next Steps

After successful migration:
1. Test all features thoroughly
2. Add more products via admin panel
3. Test with multiple users
4. Consider deploying to production
5. Set up regular database backups

## Need Help?

Check these files:
- `QUICKSTART_MONGODB.md` - Quick start guide
- `MONGODB_SETUP.md` - Detailed setup
- `MONGODB_MIGRATION.md` - Migration details
- `ARCHITECTURE.md` - System architecture

## Congratulations! 🎉

Once all checkboxes are complete, your VarnWear application has:
- ✅ Professional database backend
- ✅ Persistent data storage
- ✅ Permanent image storage
- ✅ Production-ready architecture
- ✅ No more data loss!
