const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { isValidEmail, isValidPassword, sanitizeString } = require('../utils/validation');
const { generateToken } = require('../utils/jwt');

const authController = {
  register: async (req, res) => {
    try {
      const name = sanitizeString(req.body.name);
      const email = sanitizeString(req.body.email).toLowerCase();
      const password = req.body.password;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
      }

      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }

      if (!isValidPassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      const existingUser = User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email is already registered.' });
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const allUsers = User.findAll();
      const role = allUsers.length === 0 ? 'admin' : 'user';

      const newUser = User.create({
        name,
        email,
        passwordHash,
        role
      });

      return res.status(201).json({
        message: 'User registered successfully.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ error: 'Internal server error during registration.' });
    }
  },

  login: async (req, res) => {
    try {
      const email = sanitizeString(req.body.email).toLowerCase();
      const password = req.body.password;
      const rememberMe = req.body.rememberMe === true || req.body.rememberMe === 'true';

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = User.findByEmail(email);
      if (!user || !user.password_hash) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const expiresIn = rememberMe ? '7d' : '1d';
      const token = generateToken({ id: user.id, role: user.role, email: user.email }, expiresIn);

      const cookieMaxAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: cookieMaxAge
      });

      return res.status(200).json({
        message: 'Login successful.',
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ error: 'Internal server error during login.' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully.' });
  },

  githubCallback: (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('/views/login.html?error=OAuthFailed');
      }

      const user = req.user;
      const token = generateToken({ id: user.id, role: user.role, email: user.email }, '1d');

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      return res.redirect('/views/dashboard.html');
    } catch (error) {
      console.error('GitHub callback error:', error);
      return res.redirect('/views/login.html?error=ServerInternalError');
    }
  },

  getProfile: (req, res) => {
    try {
      const user = User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ error: 'Internal server error while fetching profile.' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required.' });
      }

      if (!isValidPassword(newPassword)) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
      }

      const user = User.findById(req.user.id);
      if (!user || !user.password_hash) {
        return res.status(400).json({ error: 'Password changes are not available for GitHub OAuth accounts without a local password.' });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect current password.' });
      }

      const saltRounds = 10;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      User.updatePassword(user.id, newPasswordHash);

      return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: 'Internal server error while changing password.' });
    }
  }
};

module.exports = authController;