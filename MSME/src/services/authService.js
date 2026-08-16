/**
 * Authentication Service for MSME Growth Advisor.
 * Connects to Express/MongoDB backend API (POST /api/auth/register, POST /api/auth/login, GET /api/auth/me).
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

export const authService = {
  /**
   * Login user with email and password
   */
  async login({ email, password, rememberMe = false }) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      const userData = data.data;

      if (rememberMe || userData.token) {
        localStorage.setItem('msme_auth_token', userData.token);
        localStorage.setItem('msme_user', JSON.stringify(userData));
      }

      return userData;
    } catch (error) {
      // Fallback for offline/development if backend is offline
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.warn('Backend API offline. Falling back to local authentication mode.');
        const mockUser = {
          _id: 'usr_msme_offline',
          name: 'Business Owner',
          email,
          businessName: 'MSME Store',
          token: 'offline_demo_token',
        };
        localStorage.setItem('msme_auth_token', mockUser.token);
        localStorage.setItem('msme_user', JSON.stringify(mockUser));
        return mockUser;
      }
      throw error;
    }
  },

  /**
   * Register new user and business profile
   */
  async register({ fullName, businessName, email, password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          businessName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      const userData = data.data;

      localStorage.setItem('msme_auth_token', userData.token);
      localStorage.setItem('msme_user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.warn('Backend API offline. Falling back to local registration mode.');
        const mockUser = {
          _id: 'usr_msme_' + Date.now(),
          name: fullName,
          businessName,
          email,
          token: 'offline_demo_token_' + Date.now(),
        };
        localStorage.setItem('msme_auth_token', mockUser.token);
        localStorage.setItem('msme_user', JSON.stringify(mockUser));
        return mockUser;
      }
      throw error;
    }
  },

  /**
   * Get current authenticated user profile (GET /api/auth/me)
   */
  async getCurrentUserProfile() {
    const token = localStorage.getItem('msme_auth_token');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return this.getCurrentUser();
      }

      return data.data;
    } catch (error) {
      return this.getCurrentUser();
    }
  },

  /**
   * Login with Google OAuth (Demo)
   */
  async loginWithGoogle() {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const mockUser = {
      _id: 'usr_google_202',
      name: 'Google Business User',
      email: 'owner@business.com',
      businessName: 'My Enterprise',
      token: 'google_session_token',
    };

    localStorage.setItem('msme_auth_token', mockUser.token);
    localStorage.setItem('msme_user', JSON.stringify(mockUser));
    return mockUser;
  },

  /**
   * Logout user
   */
  async logout() {
    localStorage.removeItem('msme_auth_token');
    localStorage.removeItem('msme_user');
  },

  /**
   * Get cached user from localStorage
   */
  getCurrentUser() {
    const user = localStorage.getItem('msme_user');
    return user ? JSON.parse(user) : null;
  },
};
