require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('Testing Cloudinary connection...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.api.ping()
  .then(() => {
    console.log('✅ Cloudinary connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Cloudinary connection failed:', err.message);
    process.exit(1);
  });
