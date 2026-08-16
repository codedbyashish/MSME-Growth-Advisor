import api from './api';

/**
 * Register a new user
 * POST /api/auth/register
 * @param {Object} userData - { name, email, password, businessName }
 */
export const registerUser = async (userData) => {
  const payload = {
    name: userData.name || userData.fullName,
    email: userData.email,
    password: userData.password,
    businessName: userData.businessName,
  };
  const response = await api.post('/auth/register', payload);
  return response.data;
};

/**
 * Login existing user
 * POST /api/auth/login
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  const payload = {
    email: credentials.email,
    password: credentials.password,
  };
  const response = await api.post('/auth/login', payload);
  return response.data;
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
