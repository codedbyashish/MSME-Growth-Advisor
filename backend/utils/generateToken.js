import jwt from 'jsonwebtoken';

/**
 * Generate JWT token containing the user ID
 * Expiration set to 7 days
 * @param {string} id - User ID
 * @returns {string} JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export default generateToken;
