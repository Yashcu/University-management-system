// features/admin/pages/AdminDashboardPage.jsx - CLEAN PRODUCTION VERSION

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    branches: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState('checking')

  // Navigation function
  const navigateToPage = (page) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('page', page)
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken')

    const headers = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true)
    setConnectionStatus('checking')

    try {
      const headers = getAuthHeaders()

      // API endpoints
      const endpoints = [
        'http://localhost:8000/api/student',
        'http://localhost:8000/api/faculty',
        'http://localhost:8000/api/subject',
        'http://localhost:8000/api/branch'
      ]

      const responses = await Promise.allSettled(
        endpoints.map(async (endpoint) => {
          try {
            const response = await fetch(endpoint, {
              method: 'GET',
              headers: headers,
            })

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            return data
          } catch (error) {
            return null
          }
        })
      )

      const [studentRes, facultyRes, subjectRes, branchRes] = responses

      const getCount = (response) => {
        if (response.status === 'fulfilled' && response.value) {
          const data = response.value
          if (Array.isArray(data)) return data.length
          if (data.data && Array.isArray(data.data)) return data.data.length
          if (data.students && Array.isArray(data.students)) return data.students.length
          if (data.faculties && Array.isArray(data.faculties)) return data.faculties.length
          if (data.subjects && Array.isArray(data.subjects)) return data.subjects.length
          if (data.branches && Array.isArray(data.branches)) return data.branches.length
          if (typeof data.count === 'number') return data.count
          if (typeof data.total === 'number') return data.total
          return 0
        }
        return 0
      }

      const newStats = {
        students: getCount(studentRes),
        faculty: getCount(facultyRes),
        subjects: getCount(subjectRes),
        branches: getCount(branchRes),
      }

      setStats(newStats)

      // Determine status
      const hasData = Object.values(newStats).some(count => count > 0)
      const allApisFailed = responses.every(res => res.status === 'rejected')

      if (allApisFailed) {
        setConnectionStatus('error')
      } else if (hasData) {
        setConnectionStatus('connected')
      } else {
        setConnectionStatus('empty')
      }

    } catch (error) {
      setStats({ students: 0, faculty: 0, subjects: 0, branches: 0 })
      setConnectionStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to your administrative control panel</p>
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 transition-colors"
        >
          <svg className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.students.toLocaleString()}</p>
              <p className="text-xs text-blue-600 mt-1">Registered students</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Faculty Members</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.faculty.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">Teaching staff</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Subjects</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.subjects.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">Course offerings</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.branches.toLocaleString()}</p>
              <p className="text-xs text-orange-600 mt-1">Academic branches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigateToPage('student')}
            className="p-4 text-left rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-sm"
          >
            <div className="text-blue-600 mb-2">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="font-medium">Manage Students</h3>
            <p className="text-sm text-gray-600">Add & manage students</p>
          </button>

          <button
            onClick={() => navigateToPage('faculty')}
            className="p-4 text-left rounded-lg border hover:bg-green-50 hover:border-green-300 transition-all duration-200 hover:shadow-sm"
          >
            <div className="text-green-600 mb-2">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-medium">Manage Faculty</h3>
            <p className="text-sm text-gray-600">Add & manage faculty</p>
          </button>

          <button
            onClick={() => navigateToPage('subject')}
            className="p-4 text-left rounded-lg border hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 hover:shadow-sm"
          >
            <div className="text-purple-600 mb-2">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="font-medium">Manage Subjects</h3>
            <p className="text-sm text-gray-600">Create & manage subjects</p>
          </button>

          <button
            onClick={() => navigateToPage('branch')}
            className="p-4 text-left rounded-lg border hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 hover:shadow-sm"
          >
            <div className="text-orange-600 mb-2">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="font-medium">Manage Branches</h3>
            <p className="text-sm text-gray-600">Create & manage branches</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow border p-6">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Database Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium">{stats.students} registered</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Faculty:</span>
                <span className="font-medium">{stats.faculty} active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subjects:</span>
                <span className="font-medium">{stats.subjects} available</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Branches:</span>
                <span className="font-medium">{stats.branches} departments</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Records:</span>
                <span className="font-medium">{stats.students + stats.faculty + stats.subjects + stats.branches}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Students/Branch:</span>
                <span className="font-medium">{stats.branches > 0 ? Math.round(stats.students / stats.branches) : 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg Subjects/Branch:</span>
                <span className="font-medium">{stats.branches > 0 ? Math.round(stats.subjects / stats.branches) : 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Student-Faculty Ratio:</span>
                <span className="font-medium">{stats.faculty > 0 ? Math.round(stats.students / stats.faculty) : 0}:1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      {connectionStatus === 'connected' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Dashboard Connected</h3>
              <p className="mt-1 text-sm text-green-700">
                All systems operational. Data refreshed successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {connectionStatus === 'empty' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Getting Started</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Database is empty. Start by adding some data using the quick actions above.
              </p>
            </div>
          </div>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <p className="mt-1 text-sm text-red-700">
                Unable to connect to backend. Please check server status.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
