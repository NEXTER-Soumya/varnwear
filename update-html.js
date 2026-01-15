const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'products.html',
    'product-detail.html',
    'cart.html',
    'wishlist.html',
    'checkout.html',
    'login.html',
    'register.html',
    'orders.html',
    'profile.html',
    'admin/index.html',
    'admin/products.html',
    'admin/orders.html',
    'admin/users.html',
    'admin/login.html'
];

const oldScripts = [
    '<script src="js/auth.js"></script>',
    '<script src="js/products.js"></script>',
    '<script src="js/admin-products.js"></script>',
    '<script src="../js/auth.js"></script>',
    '<script src="../js/products.js"></script>',
    '<script src="../js/admin-products.js"></script>'
];

function updateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Determine correct API path
        const isAdmin = filePath.includes('admin/');
        const apiPath = isAdmin ? '../js/api.js' : 'js/api.js';
        
        // Remove old script tags
        oldScripts.forEach(oldScript => {
            if (content.includes(oldScript)) {
                content = content.replace(oldScript, '');
                updated = true;
            }
        });
        
        // Add new API script if not already present
        const apiScript = `<script src="${apiPath}"></script>`;
        if (!content.includes(apiScript)) {
            // Find a good place to insert (before other js scripts or before </body>)
            if (content.includes('<script src=')) {
                const firstScript = content.indexOf('<script src=');
                content = content.slice(0, firstScript) + apiScript + '\n  ' + content.slice(firstScript);
            } else if (content.includes('</body>')) {
                content = content.replace('</body>', `  ${apiScript}\n</body>`);
            }
            updated = true;
        }
        
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated: ${filePath}`);
            return true;
        } else {
            console.log(`- Skipped: ${filePath} (already updated)`);
            return false;
        }
    } catch (err) {
        console.error(`✗ Error updating ${filePath}:`, err.message);
        return false;
    }
}

console.log('Updating HTML files to use MongoDB API...\n');

let updatedCount = 0;
filesToUpdate.forEach(file => {
    if (updateFile(file)) {
        updatedCount++;
    }
});

console.log(`\n✓ Updated ${updatedCount} files`);
console.log('\nNext steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run seed');
console.log('3. Run: npm start');
