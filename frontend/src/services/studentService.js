// src/services/studentService.js - UPDATED STUDENT SERVICE

const API_BASE = 'http://localhost:8000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

const getMultipartHeaders = () => {
  const token = localStorage.getItem('userToken')
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

export const studentService = {
  async getAll(params = {}) {
    console.log('📞 Calling getAll students with params:', params)

    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })

    const url = `${API_BASE}/student${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    console.log('🌐 Request URL:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    console.log('📊 Response status:', response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('✅ Students response:', result)
    return result
  },

  async getById(id) {
    const response = await fetch(`${API_BASE}/student/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch student: ${response.statusText}`)
    }

    return await response.json()
  },

  async create(studentData) {
    console.log('🆕 Creating student with data:', studentData)

    const formData = new FormData()

    Object.entries(studentData).forEach(([key, value]) => {
      if (key === 'file' && value && value.length > 0) {
        formData.append('file', value[0])
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value)
      }
    })

    const response = await fetch(`${API_BASE}/student/register`, {
      method: 'POST',
      headers: getMultipartHeaders(),
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Failed to create student: ${response.statusText}`)
    }

    return await response.json()
  },

  async update(id, studentData) {
    console.log('✏️ Updating student:', id, 'with data:', studentData)

    const formData = new FormData()

    Object.entries(studentData).forEach(([key, value]) => {
      if (key === 'file' && value && value.length > 0) {
        formData.append('file', value[0])
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value)
      }
    })

    const response = await fetch(`${API_BASE}/student/${id}`, {
      method: 'PATCH',
      headers: getMultipartHeaders(),
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Failed to update student: ${response.statusText}`)
    }

    return await response.json()
  },

  async delete(id) {
    console.log('🗑️ Deleting student:', id)

    const response = await fetch(`${API_BASE}/student/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Failed to delete student: ${response.statusText}`)
    }

    return await response.json()
  }
}
