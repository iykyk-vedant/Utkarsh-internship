const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Generate JWT token
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Check if user already exists in our database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    // Create user in our database
    user = new User({
      supabaseId: data.user.id,
      email: data.user.email,
      role: 'user'
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    // Find user in our database
    let user = await User.findOne({ email: data.user.email });
    
    // If user doesn't exist in our database, create them
    if (!user) {
      user = new User({
        supabaseId: data.user.id,
        email: data.user.email,
        role: 'user'
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  res.json({ message: 'User logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile
};