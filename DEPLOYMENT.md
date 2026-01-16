# VarnWear Deployment Guide

## Option 1: Vercel (Recommended - Easiest)

### Steps:
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Add Environment Variables in Vercel Dashboard:
   - MONGODB_URI
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
   - EMAIL_USER
   - EMAIL_PASS

5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Note:
- Vercel has serverless function limits (10s timeout on free tier)
- MongoDB Atlas required (free tier available)

---

## Option 2: Render.com (Better for Full Stack)

### Steps:
1. Push code to GitHub

2. Go to render.com and create account

3. Click "New +" → "Web Service"

4. Connect GitHub repo

5. Configure:
   - Name: varnwear
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

6. Add Environment Variables:
   - MONGODB_URI
   - PORT (leave as 3000)
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
   - EMAIL_USER
   - EMAIL_PASS

7. Click "Create Web Service"

### Advantages:
- ✅ Always-on server
- ✅ No timeout limits
- ✅ Free tier available
- ✅ Better for MongoDB connections

---

## Option 3: Railway.app (Alternative)

### Steps:
1. Go to railway.app

2. Click "Start a New Project"

3. Deploy from GitHub

4. Add environment variables

5. Deploy

---

## Recommended: Render.com
- Best for this full-stack app
- Free tier: 750 hours/month
- No cold starts after initial load
- Perfect for MongoDB + Express

## After Deployment:
Update API_URL in js/api.js to your deployed backend URL
