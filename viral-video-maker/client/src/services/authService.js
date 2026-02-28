import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      
      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { token, user }
    } catch (error) {
      console.error('Login error:', error)
      throw error.response?.data || { message: 'Erro ao fazer login' }
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { token, user } = response.data
      
      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      return { token, user }
    } catch (error) {
      console.error('Registration error:', error)
      throw error.response?.data || { message: 'Erro ao registrar' }
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return null
      }

      const response = await api.get('/auth/me')
      return response.data.user
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  // Get stored user
  getStoredUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData)
      const user = response.data.user
      
      // Update stored user
      localStorage.setItem('user', JSON.stringify(user))
      
      return user
    } catch (error) {
      console.error('Update profile error:', error)
      throw error.response?.data || { message: 'Erro ao atualizar perfil' }
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/auth/password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      console.error('Change password error:', error)
      throw error.response?.data || { message: 'Erro ao alterar senha' }
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email })
      return response.data
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error.response?.data || { message: 'Erro ao enviar email de recuperação' }
    }
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword })
      return response.data
    } catch (error) {
      console.error('Reset password error:', error)
      throw error.response?.data || { message: 'Erro ao redefinir senha' }
    }
  }
}

export default authService