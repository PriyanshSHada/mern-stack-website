import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'https://mern-stack-website-eight.vercel.app',
  'https://mern-stack-website.vercel.app',
  'https://mern-stack-website-nx8g.vercel.app',
  'https://mern-stack-website-nx8g-387w5sv3z-priyanshshadas-projects.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now - tighten in production
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

let dbConnected = false;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('MongoDB connected'); dbConnected = true; })
  .catch((err) => {
    console.error('MongoDB error:', err.message);
    console.error('Please check your MONGODB_URI credentials in backend/.env');
  });

mongoose.connection.on('connected', () => { dbConnected = true; console.log('MongoDB event: connected'); });
mongoose.connection.on('disconnected', () => { dbConnected = false; console.log('MongoDB event: disconnected'); });
mongoose.connection.on('error', (err) => { console.error('MongoDB event: error', err.message); });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'manager', 'admin'], default: 'user' }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role && !(role === 'manager' && req.user.role === 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

app.get('/api/health', (req, res) => {
  res.json({ status: dbConnected ? 'ok' : 'db-down', mongo: dbConnected });
});

app.post('/api/auth/register', async (req, res) => {
  console.log('>>> REGISTER payload:', req.body);
  if (!dbConnected) return res.status(503).json({ message: 'Database not connected. Please whitelist your IP in MongoDB Atlas.' });
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const allowedRoles = ['user', 'manager', 'admin'];
    const safeRole = allowedRoles.includes(role) ? role : 'user';
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ username, email, password, role: safeRole });
    console.log('>>> USER CREATED:', { id: user._id, username: user.username, role: user.role });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ message: 'Registered', token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error('>>> REGISTER ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  console.log('>>> LOGIN attempt:', req.body.email);
  if (!dbConnected) return res.status(503).json({ message: 'Database not connected. Please whitelist your IP in MongoDB Atlas.' });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('>>> LOGIN FAIL: user not found for', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      console.log('>>> LOGIN FAIL: wrong password for', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    console.log('>>> LOGIN SUCCESS:', { id: user._id, username: user.username, role: user.role });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ message: 'Login success', token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    console.error('>>> LOGIN ERROR:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/logout', protect, (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

app.get('/api/auth/me', protect, (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role } });
});

app.get('/api/user/dashboard', protect, (req, res) => {
  res.json({ message: 'User Dashboard', user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role } });
});

app.get('/api/manager/dashboard', protect, authorize('manager'), (req, res) => {
  res.json({ message: 'Manager Dashboard', user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role } });
});

app.get('/api/admin/dashboard', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin Dashboard', user: { id: req.user._id, username: req.user.username, email: req.user.email, role: req.user.role } });
});

app.get('/api/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: { $in: ['user', 'manager', 'admin'] } } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} busy, trying ${PORT + 1}...`);
    app.listen(PORT + 1, () => console.log(`Server running on port ${PORT + 1}`));
  }
});
