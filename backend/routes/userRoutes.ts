const express = require('express');
const { getUsers } = require('../controllers/userController');
const { protect, adminOrAgent } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, adminOrAgent, getUsers);

module.exports = router;
