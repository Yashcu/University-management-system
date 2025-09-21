// services/api.js - COMPLETE WITH REAL API CALLS

import { apiRequest } from '@lib/AxiosWrapper'

// Generic CRUD service factory
export const createCrudService = (endpoint) => ({
  // Get all records with optional search/filter params
  search: async (params = {}) => {
    try {
      const response = await apiRequest.get(`/${endpoint}`, { params })
      return response.data
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error)
      throw new Error(error.response?.data?.message || `Failed to fetch ${endpoint}`)
    }
  },

  // Get single record by ID
  getById: async (id) => {
    try {
      const response = await apiRequest.get(`/${endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to fetch ${endpoint} by ID:`, error)
      throw new Error(error.response?.data?.message || `Failed to fetch ${endpoint}`)
    }
  },

  // Create new record
  create: async (data) => {
    try {
      const config = {}

      // Handle file uploads
      if (data instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' }
      }

      const response = await apiRequest.post(`/${endpoint}/register`, data, config)
      return response.data
    } catch (error) {
      console.error(`Failed to create ${endpoint}:`, error)
      throw new Error(error.response?.data?.message || `Failed to create ${endpoint}`)
    }
  },

  // Update existing record
  update: async (id, data) => {
    try {
      const config = {}

      // Handle file uploads
      if (data instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' }
      }

      const response = await apiRequest.patch(`/${endpoint}/${id}`, data, config)
      return response.data
    } catch (error) {
      console.error(`Failed to update ${endpoint}:`, error)
      throw new Error(error.response?.data?.message || `Failed to update ${endpoint}`)
    }
  },

  // Delete record
  delete: async (id) => {
    try {
      const response = await apiRequest.delete(`/${endpoint}/${id}`)
      return response.data
    } catch (error) {
      console.error(`Failed to delete ${endpoint}:`, error)
      throw new Error(error.response?.data?.message || `Failed to delete ${endpoint}`)
    }
  },
})

// Create service instances for each endpoint
export const adminService = createCrudService('admin')
export const branchService = createCrudService('branch')
export const examService = createCrudService('exam')
export const facultyService = createCrudService('faculty')
export const materialService = createCrudService('material')
export const noticeService = createCrudService('notice')
export const studentService = createCrudService('student')
export const subjectService = createCrudService('subject')
export const timetableService = createCrudService('timetable')
export const marksService = createCrudService('marks')

// Auth service (from your existing backend routes)
export const authService = {
  login: async (credentials) => {
    try {
      const { email, password, userType } = credentials
      const response = await apiRequest.post(`/${userType}/login`, {
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  forgotPassword: async (email, userType) => {
    try {
      const response = await apiRequest.post(`/${userType}/forget-password`, {
        email,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send password reset email')
    }
  },

  resetPassword: async (resetId, newPassword, userType) => {
    try {
      const response = await apiRequest.post(`/${userType}/update-password/${resetId}`, {
        password: newPassword,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reset password')
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const userType = localStorage.getItem('userType')
      const response = await apiRequest.post(`/${userType}/change-password`, {
        currentPassword,
        newPassword,
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to change password')
    }
  }
}

// Profile service
export const profileService = {
  getMyProfile: async () => {
    try {
      const userType = localStorage.getItem('userType')
      const response = await apiRequest.get(`/${userType}/my-details`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile')
    }
  },

  updateProfile: async (profileData) => {
    try {
      const userType = localStorage.getItem('userType')
      const userId = localStorage.getItem('userId')
      const response = await apiRequest.patch(`/${userType}/${userId}`, profileData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update profile')
    }
  }
}

export default {
  admin: adminService,
  branch: branchService,
  exam: examService,
  faculty: facultyService,
  material: materialService,
  notice: noticeService,
  student: studentService,
  subject: subjectService,
  timetable: timetableService,
  marks: marksService,
  auth: authService,
  profile: profileService,
}
