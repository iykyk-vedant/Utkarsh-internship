const express = require('express');
const { protect } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(protect, logoutUser);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;