const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secure_auth_default_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};