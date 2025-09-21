import axios from 'axios'
import toast from 'react-hot-toast'
import { logout } from '@/redux/authSlice'

// Create axios instance with base configuration
const axiosWrapper = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management utilities
const getStoredToken = () => {
  try {
    return localStorage.getItem('userToken')
  } catch (error) {
    console.warn('Failed to get token from localStorage:', error)
    return null
  }
}

const removeStoredToken = () => {
  try {
    localStorage.removeItem('userToken')
  } catch (error) {
    console.warn('Failed to remove token from localStorage:', error)
  }
}

// Setup interceptors
export const setupInterceptors = (store) => {
  // Request interceptor - Add auth token
  axiosWrapper.interceptors.request.use(
    (config) => {
      const token = getStoredToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

// Response interceptor - Handle errors
axiosWrapper.interceptors.response.use(
  (response) => {
    // Don't modify the response structure - return as-is
    return response
  },
  (error) => {
    const { response, request, message } = error

    // Network error
    if (!response && request) {
      toast.error('Network error. Please check your internet connection.')
      return Promise.reject(new Error('Network Error'))
    }

    // Server error responses
    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          // Unauthorized - logout user
          toast.error('Session expired. Please login again.')
          removeStoredToken()
          store.dispatch(logout())
          break

        case 403:
          toast.error('Access denied. You don\'t have permission for this action.')
          break

        case 404:
          toast.error('Resource not found.')
          break

        case 429:
          toast.error('Too many requests. Please try again later.')
          break

        case 500:
          toast.error('Server error. Please try again later.')
          break

        default:
          // Use server message if available
          const errorMessage = data?.message || data?.error || 'Something went wrong'
          toast.error(errorMessage)
      }

      return Promise.reject(error)
    }

    // Generic error
    toast.error(message || 'Something went wrong')
    return Promise.reject(error)
  }
)

}

// Utility functions for different request types
export const apiRequest = {
  get: (url, config = {}) => axiosWrapper.get(url, config),
  post: (url, data, config = {}) => axiosWrapper.post(url, data, config),
  put: (url, data, config = {}) => axiosWrapper.put(url, data, config),
  patch: (url, data, config = {}) => axiosWrapper.patch(url, data, config),
  delete: (url, config = {}) => axiosWrapper.delete(url, config),
}

export default axiosWrapper
