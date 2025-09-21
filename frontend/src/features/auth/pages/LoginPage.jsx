// features/auth/pages/LoginPage.jsx - CORRECTED LOGIN LOGIC

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { useForm } from '@hooks/useForm'
import axiosWrapper from '@lib/AxiosWrapper' // Direct import for debugging
import { loginSuccess, fetchUserProfile } from '@/redux/authSlice'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = React.useState(false)

  const { formData, handleInputChange, handleSelectChange, errors, isSubmitting } = useForm(
    {
      email: '',
      password: '',
      userType: 'student',
    },
    {
      onSubmit: handleLogin,
    }
  )

  // Get the redirect path from location state
  const from = location.state?.from?.pathname || `/${formData.userType}`

  // features/auth/pages/LoginPage.jsx - FIXED RESPONSE PARSING

async function handleLogin(loginData) {
  try {
    // Basic validation
    if (!loginData.email || !loginData.password || !loginData.userType) {
      toast.error('Please fill all the fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(loginData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    // Password length check
    if (loginData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    const loadingToast = toast.loading('Signing you in...')

    console.log('Calling login endpoint:', `/${loginData.userType}/login`)
    console.log('With data:', { email: loginData.email, password: '***' })

    const response = await axiosWrapper.post(`/${loginData.userType}/login`, {
      email: loginData.email,
      password: loginData.password,
    })

    console.log('Login response:', response)
    console.log('Response data:', response.data)

    // FIXED: Handle your backend's response structure
    const responseData = response.data
    const token = responseData.data?.token || responseData.token

    if (response.status === 200 && token) {
      // Dispatch login success
      dispatch(loginSuccess({
        userToken: token,
        userType: loginData.userType,
        user: responseData.data?.user || responseData.user || null
      }))

      // Fetch user profile
      try {
        await dispatch(fetchUserProfile())
      } catch (profileError) {
        console.warn('Profile fetch failed, but login succeeded:', profileError)
      }

      toast.dismiss(loadingToast)
      toast.success('Login successful! Welcome back.')

      // Navigate to intended page or dashboard
      navigate(from, { replace: true })
    } else {
      throw new Error('Invalid response: No token received')
    }
  } catch (error) {
    console.error('Full login error:', error)
    console.error('Error response:', error.response?.data)

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Login failed. Please try again.'

    toast.error(errorMessage)
  }
}


  const userTypeOptions = [
    { value: 'student', label: 'Student', description: 'Access courses, assignments, and grades' },
    { value: 'faculty', label: 'Faculty', description: 'Manage courses and student records' },
    { value: 'admin', label: 'Admin', description: 'System administration and management' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">College CMS</h1>
          </div>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleLogin(formData)
          }}>
            <CardContent className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-sm font-medium">
                  Login as
                </Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => handleSelectChange('userType', value)}
                >
                  <SelectTrigger id="userType" className="h-11">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span className="font-medium">{option.label}</span>
                          <span className="text-xs text-gray-500">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-11 pr-10"
                    required
                    autoComplete="current-password"
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
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center space-y-2">
                <Link
                  to="/auth/forget-password"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot your password?
                </Link>

                <p className="text-xs text-gray-500">
                  Need help? Contact your system administrator
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
