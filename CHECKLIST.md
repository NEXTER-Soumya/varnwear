# Pre-Deployment Checklist ✅

## Environment Variables (Set in Render Dashboard)
- [ ] MONGODB_URI
- [ ] PORT (set to 3000)
- [ ] ADMIN_USERNAME
- [ ] ADMIN_PASSWORD
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] NODE_ENV (set to "production")

## Code Verification
- [x] All localhost URLs replaced with dynamic detection
- [x] API_URL auto-detects environment
- [x] ADMIN_API_URL auto-detects environment
- [x] CORS configured for production
- [x] Health check endpoint added
- [x] Error logging added
- [x] Admin users page fixed

## Files Updated
- [x] js/api.js - Dynamic API URL
- [x] js/admin-auth.js - Dynamic admin API URL
- [x] login.html - Fallback API URL
- [x] register.html - Fallback API URL
- [x] contact.html - Fallback API URL
- [x] admin/users.html - Dynamic API URL
- [x] server.js - CORS, logging, health check

## Test After Deployment

### 1. Health Check
```javascript
fetch(`${window.location.origin}/api/health`)
  .then(r => r.json())
  .then(console.log)
```
Expected: `{ status: 'ok', mongodb: 'connected' }`

### 2. Products Loading
```javascript
fetch(`${window.location.origin}/api/products`)
  .then(r => r.json())
  .then(d => console.log('Products:', d.length))
```
Expected: Number of products

### 3. User Registration Flow
- Go to /register.html
- Fill form and click "Send OTP"
- Check email for OTP
- Enter OTP and register
- Should redirect to home page

### 4. User Login Flow
- Go to /login.html
- Enter registered email
- Click "Send OTP"
- Check email for OTP
- Enter OTP and login
- Should redirect to home page

### 5. Admin Login
- Go to /admin/login.html
- Enter admin credentials
- Should redirect to admin dashboard

### 6. Contact Form
- Go to /contact.html
- Fill and submit form
- Check email for confirmation

## Common Issues & Solutions

### Issue: "API_URL is not defined"
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: "CORS error"
**Solution:** Check Render logs, ensure CORS is configured

### Issue: "MongoDB not connected"
**Solution:** Verify MONGODB_URI in Render environment variables

### Issue: "Email not sending"
**Solution:** Verify EMAIL_USER and EMAIL_PASS are correct Gmail App Password

### Issue: "Admin not found"
**Solution:** Check Render logs for "Admin account created" message

## Deployment Commands
```bash
git add .
git commit -m "Production ready - all URLs fixed"
git push origin main
```

## Post-Deployment
1. Wait 2-3 minutes for Render to build and deploy
2. Check Render logs for any errors
3. Run all tests above
4. Monitor for 24 hours

## Rollback Plan
If issues occur:
```bash
git revert HEAD
git push origin main
```

## Support
- Render Logs: Dashboard → Your Service → Logs
- MongoDB Atlas: Check connection status
- Email: Verify Gmail App Password is active
