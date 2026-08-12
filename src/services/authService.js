import API from './api';

export const authService = {
  login: async (email, password) => {
    const response = await API.post('/api/auth/login', { email, password });
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  },

  register: async (registerData) => {
    // registerData: { username, password, confirmPassword, gender, email, phone }
    const response = await API.post('/api/auth/register', registerData);
    return response.data;
  },

  resetPassword: async (resetData) => {
    // resetData: { email, token, newPassword, confirmPassword }
    const response = await API.put('/api/auth/reset-password', resetData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await API.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await API.put('/api/auth/change-password', passwordData);
    return response.data;
  },

  logout: async () => {
    try {
      await API.post('/api/auth/logout');
    } catch (e) {
      console.error("Logout request error", e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  },

  getProfile: async () => {
    const response = await API.get('/api/home');
    return response.data;
  }
};
