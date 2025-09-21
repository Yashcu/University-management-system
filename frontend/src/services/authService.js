// services/api.js - UPDATE THE AUTH SERVICE SECTION

export const authService = {
  // LOGIN: Call /{userType}/login instead of /auth/login
  login: async (credentials) => {
    try {
      const { email, password, userType } = credentials

      if (!email || !password || !userType) {
        throw new Error('Email, password, and user type are required')
      }

      // FIXED: Call the correct endpoint based on userType
      const response = await apiRequest.post(`/${userType}/login`, {
        email,
        password,
      })

      return response.data || response
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  },

  // FORGOT PASSWORD: Use userType endpoint
  forgotPassword: async (email) => {
    try {
      if (!email) {
        throw new Error('Email is required')
      }

      // You'll need to determine userType or use a generic endpoint
      // For now, let's assume your backend has a generic endpoint
      const response = await apiRequest.post('/auth/forget-password', {
        email,
      })

      return response.data || response
    } catch (error) {
      throw new Error(error.message || 'Failed to send password reset email')
    }
  },

  // RESET PASSWORD: Use correct endpoint
  resetPassword: async (token, newPassword) => {
    try {
      if (!token || !newPassword) {
        throw new Error('Token and new password are required')
      }

      const response = await apiRequest.post(`/auth/reset-password/${token}`, {
        password: newPassword,
      })

      return response.data || response
    } catch (error) {
      throw new Error(error.message || 'Failed to reset password')
    }
  },
}
