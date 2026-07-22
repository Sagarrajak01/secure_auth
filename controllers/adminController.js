const User = require('../models/userModel');

const adminController = {
  getAllUsers: (req, res) => {
    try {
      const users = User.findAll();
      return res.status(200).json({ users });
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({ error: 'Internal server error while fetching users.' });
    }
  },

  deleteUser: (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID.' });
      }

      if (req.user.id === userId) {
        return res.status(400).json({ error: 'Administrators cannot delete their own accounts.' });
      }

      const success = User.delete(userId);
      if (!success) {
        return res.status(404).json({ error: 'User not found.' });
      }

      return res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({ error: 'Internal server error while deleting user.' });
    }
  }
};

module.exports = adminController;