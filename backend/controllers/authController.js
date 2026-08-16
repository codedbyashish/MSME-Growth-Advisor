import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Email validation helper regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, businessName } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || !businessName) {
      return res.status(400).json({
        message: 'All fields (name, email, password, businessName) are required',
      });
    }

    // 2. Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Invalid email address format',
      });
    }

    // 3. Check for duplicate email
    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email address',
      });
    }

    // 4 & 5. Hash password (via User pre-save hook) and Save user to MongoDB
    const user = await User.create({
      name,
      email,
      password,
      businessName,
    });

    if (user) {
      // 6. Generate JWT
      const token = generateToken(user._id);

      // 7 & 8. Return user and JWT (never return password)
      return res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        },
      });
    } else {
      return res.status(400).json({
        message: 'Invalid user data provided',
      });
    }
  } catch (error) {
    console.error(`Register error: ${error.message}`);
    return res.status(500).json({
      message: error.message || 'Server error during registration',
    });
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        message: 'Both email and password are required',
      });
    }

    // 1. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    // 2. Compare password using bcryptjs
    if (user && (await user.matchPassword(password))) {
      // 3. Generate JWT
      const token = generateToken(user._id);

      // 4. Return user and token (never return password)
      return res.status(200).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          businessName: user.businessName,
        },
      });
    } else {
      // 5. Invalid credentials return HTTP 401
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return res.status(500).json({
      message: error.message || 'Server error during login',
    });
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Requires Bearer Token)
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    // Return user details excluding password
    return res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      businessName: req.user.businessName,
    });
  } catch (error) {
    console.error(`Get profile error: ${error.message}`);
    return res.status(500).json({
      message: error.message || 'Server error fetching user profile',
    });
  }
};
