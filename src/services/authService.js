import API from './api';

export const authService = {
  login: async (username, password) => {
    const response = await API.post('/api/auth/login', { username, password });
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

  sendOtp: async (email) => {
    const response = await API.post('/api/auth/send-otp', { email });
    return response.data;
  },

  verifyOtp: async (email, otp) => {
    const response = await API.post('/api/auth/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (resetData) => {
    // resetData: { email, newPassword, confirmPassword }
    const response = await API.put('/api/auth/reset-password', resetData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await API.post('/api/auth/forgot-password', { email });
    return response.data;
  },

  logout: async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await API.post('/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
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
