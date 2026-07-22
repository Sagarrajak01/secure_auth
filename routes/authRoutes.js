const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/views/login.html?error=GitHubAuthFailed', session: false }),
  authController.githubCallback
);

// Authenticated user profile routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;