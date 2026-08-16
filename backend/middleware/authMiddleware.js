import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to verify JWT token in Authorization header
 * Header format: Authorization: Bearer <JWT_TOKEN>
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract Bearer token
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          message: 'Not authorized, token missing',
        });
      }

      // Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID excluding password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          message: 'Not authorized, user not found',
        });
      }

      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Not authorized, token has expired',
        });
      }
      return res.status(401).json({
        message: 'Not authorized, invalid token',
      });
    }
  }

  return res.status(401).json({
    message: 'Not authorized, no token provided',
  });
};
