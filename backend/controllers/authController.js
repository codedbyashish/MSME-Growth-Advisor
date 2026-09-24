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
    const {
      name,
      fullName,
      email,
      password,
      businessName,
      phone,
      city,
      state,
      businessType,
      sector,
      gstin,
      annualTurnover,
      monthlyRevenue,
      monthlyExpenses,
      hasUploadedSalesData,
      salesFileName,
    } = req.body;

    const userName = name || fullName;

    // 1. Validate required fields
    if (!userName || !email || !password || !businessName) {
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
      name: userName,
      email: email.toLowerCase(),
      password,
      businessName,
      phone: phone || '',
      city: city || '',
      state: state || '',
      businessType: businessType || 'Retail Store',
      sector: sector || 'FMCG & Grocery',
      gstin: gstin || '',
      annualTurnover: annualTurnover || '₹10L - ₹50L',
      monthlyRevenue: monthlyRevenue || '',
      monthlyExpenses: monthlyExpenses || '',
      hasUploadedSalesData: !!hasUploadedSalesData,
      salesFileName: salesFileName || null,
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
          phone: user.phone,
          city: user.city,
          state: user.state,
          businessType: user.businessType,
          sector: user.sector,
          gstin: user.gstin,
          annualTurnover: user.annualTurnover,
          monthlyRevenue: user.monthlyRevenue,
          monthlyExpenses: user.monthlyExpenses,
          currency: user.currency,
          taxRate: user.taxRate,
          emailNotifications: user.emailNotifications,
          aiSuggestionsEnabled: user.aiSuggestionsEnabled,
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
          phone: user.phone,
          city: user.city,
          state: user.state,
          businessType: user.businessType,
          sector: user.sector,
          gstin: user.gstin,
          annualTurnover: user.annualTurnover,
          monthlyRevenue: user.monthlyRevenue,
          monthlyExpenses: user.monthlyExpenses,
          currency: user.currency,
          taxRate: user.taxRate,
          emailNotifications: user.emailNotifications,
          aiSuggestionsEnabled: user.aiSuggestionsEnabled,
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

    // Return complete user details excluding password
    return res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      businessName: req.user.businessName,
      phone: req.user.phone,
      city: req.user.city,
      state: req.user.state,
      businessType: req.user.businessType,
      sector: req.user.sector,
      gstin: req.user.gstin,
      annualTurnover: req.user.annualTurnover,
      monthlyRevenue: req.user.monthlyRevenue,
      monthlyExpenses: req.user.monthlyExpenses,
      currency: req.user.currency || 'INR (₹)',
      taxRate: req.user.taxRate ?? 18,
      emailNotifications: req.user.emailNotifications ?? true,
      aiSuggestionsEnabled: req.user.aiSuggestionsEnabled ?? true,
      createdAt: req.user.createdAt,
    });
  } catch (error) {
    console.error(`Get profile error: ${error.message}`);
    return res.status(500).json({
      message: error.message || 'Server error fetching user profile',
    });
  }
};

/**
 * @desc    Update user profile & business settings
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      name,
      businessName,
      phone,
      city,
      state,
      businessType,
      sector,
      gstin,
      annualTurnover,
      currency,
      taxRate,
      emailNotifications,
      aiSuggestionsEnabled,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (businessName !== undefined) user.businessName = businessName;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (businessType !== undefined) user.businessType = businessType;
    if (sector !== undefined) user.sector = sector;
    if (gstin !== undefined) user.gstin = gstin;
    if (annualTurnover !== undefined) user.annualTurnover = annualTurnover;
    if (currency !== undefined) user.currency = currency;
    if (taxRate !== undefined) user.taxRate = Number(taxRate);
    if (emailNotifications !== undefined) user.emailNotifications = Boolean(emailNotifications);
    if (aiSuggestionsEnabled !== undefined) user.aiSuggestionsEnabled = Boolean(aiSuggestionsEnabled);

    const updatedUser = await user.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        businessName: updatedUser.businessName,
        phone: updatedUser.phone,
        city: updatedUser.city,
        state: updatedUser.state,
        businessType: updatedUser.businessType,
        sector: updatedUser.sector,
        gstin: updatedUser.gstin,
        annualTurnover: updatedUser.annualTurnover,
        currency: updatedUser.currency,
        taxRate: updatedUser.taxRate,
        emailNotifications: updatedUser.emailNotifications,
        aiSuggestionsEnabled: updatedUser.aiSuggestionsEnabled,
      },
    });
  } catch (error) {
    console.error(`Update profile error: ${error.message}`);
    return res.status(500).json({
      message: error.message || 'Server error updating profile',
    });
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(`Change password error: ${error.message}`);
    return res.status(500).json({
      message: error.message || 'Server error changing password',
    });
  }
};
