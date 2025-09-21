import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '@components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { useForm } from '@hooks/useForm'
import { authService } from '@services/api'
import { GraduationCap, Eye, EyeOff, CheckCircle } from 'lucide-react'

const UpdatePasswordPage = () => {
  const { resetId, type } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordUpdated, setPasswordUpdated] = React.useState(false)

  const { formData, handleInputChange, errors, setFieldError, isSubmitting } = useForm(
    {
      password: '',
      confirmPassword: '',
    },
    {
      onSubmit: handleUpdatePassword,
    }
  )

  // Password validation function
  const validatePasswords = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Set field errors
    Object.entries(newErrors).forEach(([field, error]) => {
      setFieldError(field, error)
    })

    return Object.keys(newErrors).length === 0
  }

  async function handleUpdatePassword(passwordData) {
    try {
      // Validate form
      if (!validatePasswords()) {
        return
      }

      // Check if we have the required params
      if (!resetId || !type) {
        toast.error('Invalid reset link. Please request a new password reset.')
        navigate('/auth/forget-password')
        return
      }

      const loadingToast = toast.loading('Updating your password...')

      const response = await authService.resetPassword(resetId, passwordData.password)

      toast.dismiss(loadingToast)

      if (response?.success) {
        toast.success('Password updated successfully!')
        setPasswordUpdated(true)

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/auth/login')
        }, 3000)
      } else {
        throw new Error(response?.message || 'Failed to update password')
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to update password. Please try again.'
      toast.error(errorMessage)

      // If token is expired or invalid, redirect to forget password
      if (error.message?.includes('expired') || error.message?.includes('invalid')) {
        setTimeout(() => {
          navigate('/auth/forget-password')
        }, 2000)
      }

      console.error('Update password error:', error)
    }
  }

  // Password strength indicator
  const getPasswordStrength = (password) => {
    let strength = 0
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ]

    strength = checks.filter(Boolean).length

    if (strength < 3) return { level: 'weak', color: 'text-red-500', bg: 'bg-red-500' }
    if (strength < 4) return { level: 'medium', color: 'text-yellow-500', bg: 'bg-yellow-500' }
    return { level: 'strong', color: 'text-green-500', bg: 'bg-green-500' }
  }

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null

  if (passwordUpdated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-semibold">Password Updated!</CardTitle>
              <CardDescription className="text-base">
                Your password has been successfully updated.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                You can now log in with your new password.
                Redirecting you to login page...
              </p>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                className="w-full"
                onClick={() => navigate('/auth/login')}
              >
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">College CMS</h1>
          </div>
          <p className="text-gray-600">Create a new secure password</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
            <CardDescription>
              Enter a strong new password for your account
            </CardDescription>
          </CardHeader>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleUpdatePassword(formData)
          }}>
            <CardContent className="space-y-4">
              {/* New Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && passwordStrength && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.bg} transition-all`}
                          style={{ width: `${(getPasswordStrength(formData.password).level === 'weak' ? 33 : getPasswordStrength(formData.password).level === 'medium' ? 66 : 100)}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>
                        {passwordStrength.level}
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-medium">Password must contain:</p>
                <ul className="space-y-1 ml-2">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                    ✓ At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                    ✓ One uppercase letter
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                    ✓ One lowercase letter
                  </li>
                  <li className={/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}>
                    ✓ One number
                  </li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="pt-6">
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating Password...' : 'Update Password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default UpdatePasswordPage
