require('dotenv').config();
const mongoose = require('mongoose');
const { Product } = require('./models');

const sampleProducts = [
    {
        name: 'Assassins Creed T-Shirt',
        images: ['assets/images/assasins_creed.jpeg'],
        price: 1299,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 25,
        category: 'Gaming',
        description: 'Premium Assassins Creed themed t-shirt with high-quality print.'
    },
    {
        name: 'Beige Plain T-Shirt',
        images: ['assets/images/beige_plain.jpeg', 'assets/images/beige_plain2.jpeg'],
        price: 899,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 40,
        category: 'Casual',
        description: 'Classic beige plain t-shirt for everyday wear.'
    },
    {
        name: 'BTS Band T-Shirt',
        images: ['assets/images/bts_band.jpeg', 'assets/images/bts_band2.jpeg', 'assets/images/bts_band3.jpeg', 'assets/images/bts_band4.jpeg'],
        price: 1499,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 30,
        category: 'Music',
        description: 'Official BTS band merchandise t-shirt.'
    },
    {
        name: 'COD Ghost T-Shirt',
        images: ['assets/images/cod_ghost.jpeg', 'assets/images/cod_ghost2.jpeg'],
        price: 1399,
        sizes: ['M', 'L', 'XL'],
        stock: 20,
        category: 'Gaming',
        description: 'Call of Duty Ghost themed gaming t-shirt.'
    },
    {
        name: 'Galactic Blitz T-Shirt',
        images: ['assets/images/galatic_blitz.jpeg'],
        price: 1199,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 15,
        category: 'Graphic',
        description: 'Futuristic galactic design t-shirt.'
    },
    {
        name: 'Mister T-Shirt',
        images: ['assets/images/mister.jpeg', 'assets/images/mister2.jpeg'],
        price: 999,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 35,
        category: 'Casual',
        description: 'Stylish casual t-shirt with modern design.'
    },
    {
        name: 'MotoGP Racing T-Shirt',
        images: ['assets/images/moto_gp.jpeg'],
        price: 1599,
        sizes: ['M', 'L', 'XL'],
        stock: 18,
        category: 'Sports',
        description: 'Official MotoGP racing merchandise.'
    },
    {
        name: 'Predator T-Shirt',
        images: ['assets/images/predator.jpeg'],
        price: 1299,
        sizes: ['S', 'M', 'L', 'XL'],
        stock: 22,
        category: 'Movies',
        description: 'Predator movie themed t-shirt.'
    },
    {
        name: 'Red Dead Redemption T-Shirt',
        images: ['assets/images/red_dead_redemption.jpeg'],
        price: 1499,
        sizes: ['M', 'L', 'XL'],
        stock: 12,
        category: 'Gaming',
        description: 'Red Dead Redemption 2 gaming t-shirt.'
    },
    {
        name: 'Shivaji Maharaj T-Shirt',
        images: ['assets/images/shivaji_maharaj.jpeg', 'assets/images/shivaji_maharaj2.jpeg'],
        price: 1199,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        stock: 50,
        category: 'Cultural',
        description: 'Tribute to Chhatrapati Shivaji Maharaj with premium print.'
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✓ Connected to MongoDB');
        
        await Product.deleteMany({});
        console.log('✓ Cleared existing products');
        
        await Product.insertMany(sampleProducts);
        console.log(`✓ Added ${sampleProducts.length} products`);
        
        console.log('✓ Database seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
}

seedDatabase();
