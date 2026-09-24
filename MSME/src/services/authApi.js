import api from './api';

/**
 * Register a new user
 * POST /api/auth/register
 * @param {Object} userData - { name, email, password, businessName }
 */
export const registerUser = async (userData) => {
  const payload = {
    name: userData.name || userData.fullName || userData.ownerName,
    fullName: userData.ownerName || userData.name || userData.fullName,
    email: userData.email,
    password: userData.password,
    businessName: userData.businessName,
    phone: userData.phone,
    city: userData.city,
    state: userData.state,
    businessType: userData.businessType,
    sector: userData.sector,
    gstin: userData.gstin,
    annualTurnover: userData.annualTurnover,
    monthlyRevenue: userData.monthlyRevenue,
    monthlyExpenses: userData.monthlyExpenses,
    hasUploadedSalesData: userData.hasUploadedSalesData,
    salesFileName: userData.salesFileName,
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

/**
 * Update user profile & settings
 * PUT /api/auth/profile
 */
export const updateUserProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
export const changeUserPassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData);
  return response.data;
};
