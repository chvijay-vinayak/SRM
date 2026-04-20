const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    // Only return Agents and Admins for assignment list, or return all if needed
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers };
