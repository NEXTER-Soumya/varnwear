// Test API endpoints
// Run this in browser console on your deployed site

async function testAPI() {
    const baseUrl = window.location.origin;
    console.log('Testing API at:', baseUrl);
    
    // Test 1: Health check
    try {
        const health = await fetch(`${baseUrl}/api/health`);
        const healthData = await health.json();
        console.log('✅ Health check:', healthData);
    } catch (err) {
        console.error('❌ Health check failed:', err);
    }
    
    // Test 2: Get products
    try {
        const products = await fetch(`${baseUrl}/api/products`);
        const productsData = await products.json();
        console.log('✅ Products:', productsData.length, 'items');
    } catch (err) {
        console.error('❌ Products failed:', err);
    }
    
    // Test 3: Check email endpoint
    try {
        const check = await fetch(`${baseUrl}/api/users/check-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@test.com' })
        });
        const checkData = await check.json();
        console.log('✅ Check email:', checkData);
    } catch (err) {
        console.error('❌ Check email failed:', err);
    }
    
    console.log('API_URL from api.js:', API_URL);
}

testAPI();
