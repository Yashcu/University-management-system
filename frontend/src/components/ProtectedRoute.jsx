import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Loading } from '@components/ui/Loading'

const ProtectedRoute = ({ children, requiredRole = null, fallbackPath = '/auth/login' }) => {
  const [isValidating, setIsValidating] = useState(true)
  const location = useLocation()

  // Get auth state from Redux
  const { isAuthenticated, user, token } = useSelector((state) => state.auth)

  // Get token from localStorage as fallback
  const localToken = localStorage.getItem('userToken')

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Check if we have a token in either Redux or localStorage
        const hasToken = token || localToken

        if (!hasToken) {
          setIsValidating(false)
          return
        }

        // Validate token format (basic check)
        if (localToken && !isValidToken(localToken)) {
          localStorage.removeItem('userToken')
          setIsValidating(false)
          return
        }

        // If we have authentication data, proceed
        if (isAuthenticated && user) {
          setIsValidating(false)
          return
        }

        // If we only have localStorage token, we might need to validate it
        // This would typically involve an API call to verify the token
        setIsValidating(false)
      } catch (error) {
        console.error('Auth validation error:', error)
        localStorage.removeItem('userToken')
        setIsValidating(false)
      }
    }

    validateAuth()
  }, [token, localToken, isAuthenticated, user])

  // Basic token format validation
  const isValidToken = (tokenString) => {
    try {
      // Check if it's a JWT format (very basic check)
      const parts = tokenString.split('.')
      return parts.length === 3
    } catch {
      return false
    }
  }

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  // Check authentication
  const hasValidAuth = isAuthenticated || (localToken && isValidToken(localToken))

  if (!hasValidAuth) {
    return (
      <Navigate
        to={fallbackPath}
        state={{
          from: location,
          message: 'Please login to access this page'
        }}
        replace
      />
    )
  }

  // Check role-based access if required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          from: location,
          message: `Access denied. Required role: ${requiredRole}`
        }}
        replace
      />
    )
  }

  // Render protected content
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}

// Higher-order component for role-specific protection
export const withRoleProtection = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  )
}

// Specific role-based route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
)

export const FacultyRoute = ({ children }) => (
  <ProtectedRoute requiredRole="faculty">{children}</ProtectedRoute>
)

export const StudentRoute = ({ children }) => (
  <ProtectedRoute requiredRole="student">{children}</ProtectedRoute>
)

export default ProtectedRoute
