const { verifyToken } = require('../utils/jwt');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    const user = User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User belonging to this token no longer exists.' });
    }

    // Attach user information to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
};

module.exports = authenticate;