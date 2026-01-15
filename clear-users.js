require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

async function clearUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    
    const result = await User.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} users`);
    
    // Clear localStorage data (instructions)
    console.log('\n⚠ Also clear browser localStorage:');
    console.log('  - Open browser console (F12)');
    console.log('  - Run: localStorage.clear()');
    console.log('  - Refresh the page');
    
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

clearUsers();
