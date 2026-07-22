const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

// Apply authentication and admin authorization to all routes in this router
router.use(authenticate, authorize(['admin']));

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;