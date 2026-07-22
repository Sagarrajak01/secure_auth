require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const db = require('./config/db');
const passport = require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authenticate = require('./middlewares/authenticate');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Express session setup (required for Passport GitHub OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secure_auth_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// API Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// Protected dashboard API sample route
app.get('/api/dashboard', authenticate, (req, res) => {
  res.status(200).json({
    message: 'Welcome to your secure_auth dashboard!',
    user: req.user
  });
});

// Root redirect to login page
app.get('/', (req, res) => {
  res.redirect('/views/login.html');
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', project: 'secure_auth', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`[secure_auth] Server is running on http://localhost:${PORT}`);
});