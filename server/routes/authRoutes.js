const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registerUser, loginUser, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);

// @route   PUT api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  '/change-password',
  protect,
  [
    check('oldPassword', 'Old password is required').exists(),
    check('newPassword', 'Please enter a new password with 6 or more characters').isLength({ min: 6 })
  ],
  changePassword
);

module.exports = router;
