require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { User, Product, Admin } = require('./models');

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.onrender\.com$/]
    : '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB Connected');
    console.log('✓ Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('MongoDB Error:', err);
    process.exit(1);
  });

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Store OTPs temporarily
const otpStore = new Map();

// Image upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './assets/images';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ============ USER ROUTES ============
app.post('/api/users/register', async (req, res) => {
  try {
    console.log('Register request:', req.body.email);
    const { firstName, lastName, email, password, profileImage } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, profileImage });
    
    console.log('User registered:', user.email);
    res.json({ success: true, user: { id: user._id, firstName, lastName, email, profileImage } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    console.log('Login request:', req.body.email);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ success: false, message: 'Email not found' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log('Invalid password for:', email);
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }
    
    console.log('Login successful:', email);
    res.json({ success: true, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, profileImage: user.profileImage } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Email not found' });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users/send-otp', async (req, res) => {
  try {
    console.log('Send OTP request:', req.body.email);
    const { email, type } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5 min expiry
    otpStore.set(email, { otp, expires: Date.now() + 300000 });
    
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not configured');
      // For testing: return OTP in response (REMOVE IN PRODUCTION)
      return res.json({ success: true, message: 'OTP sent to email', otp: otp });
    }
    
    // Send email
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `VarnWear - Your OTP Code`,
        html: `<h2>Your OTP Code</h2><p>Your OTP for ${type === 'register' ? 'registration' : 'login'} is: <strong>${otp}</strong></p><p>Valid for 5 minutes.</p>`
      });
      console.log('OTP sent to:', email);
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      // Still return success but log the error
      return res.json({ success: true, message: 'OTP generated (email failed)', otp: otp });
    }
    
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/users/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);
    
    if (!stored) return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    if (Date.now() > stored.expires) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }
    if (stored.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
    
    otpStore.delete(email);
    res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, profileImage: user.profileImage, phone: user.phone, address: user.address } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, profileImage: user.profileImage, phone: user.phone, address: user.address } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============ PRODUCT ROUTES ============
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.map(p => ({ ...p.toObject(), id: p._id })));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ ...product.toObject(), id: product._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({ success: true, product: { ...product.toObject(), id: product._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product: { ...product.toObject(), id: product._id } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, path: `assets/images/${req.file.filename}` });
});

// ============ ADMIN ROUTES ============
app.post('/api/admin/login', async (req, res) => {
  try {
    console.log('Admin login request:', req.body.username);
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found:', username);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      console.log('Invalid admin password');
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
    
    console.log('Admin login successful:', username);
    res.json({ success: true, admin: { id: admin._id, username: admin.username } });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users.map(u => ({ ...u.toObject(), id: u._id })));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/admin/clear-users', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ success: true, message: 'All users cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ============ CONTACT ROUTE ============
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Send email to admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });
    
    // Send confirmation to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting VarnWear',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We have received your message and will get back to you within 24-48 hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>VarnWear Team</p>
      `
    });
    
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Initialize default admin
async function initAdmin() {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminUsername || !adminPassword) {
    console.error('⚠ ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env file');
    return;
  }
  
  const exists = await Admin.findOne({ username: adminUsername });
  if (!exists) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await Admin.create({ username: adminUsername, password: hashedPassword, email: 'admin@varnwear.com' });
    console.log('✓ Admin account created');
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Email configured: ${process.env.EMAIL_USER}`);
  initAdmin();
});
