import React from 'react'
import { Link } from 'react-router-dom'
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
import { authService } from '@services/api'
import { GraduationCap, ArrowLeft, Mail } from 'lucide-react'

const ForgetPasswordPage = () => {
  const [emailSent, setEmailSent] = React.useState(false)

  const { formData, handleInputChange, handleSelectChange, isSubmitting } = useForm(
    {
      email: '',
      userType: 'student',
    },
    {
      onSubmit: handleForgetPassword,
    }
  )

async function handleForgetPassword(resetData) {
  try {
    // Basic validation
    if (!resetData.email || !resetData.userType) {
      toast.error('Please fill all fields')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    const loadingToast = toast.loading('Sending reset link...')

    // FIXED: Pass userType to the service
    const response = await authService.forgotPassword(resetData.email, resetData.userType)

    toast.dismiss(loadingToast)

    if (response?.success) {
      toast.success('Password reset link sent! Check your email.')
      setEmailSent(true)
    } else {
      throw new Error(response?.message || 'Failed to send reset link')
    }
  } catch (error) {
    const errorMessage = error.message || 'Failed to send reset link. Please try again.'
    toast.error(errorMessage)
    console.error('Forget password error:', error)
  }
}


  const userTypeOptions = [
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'admin', label: 'Admin' },
  ]

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-semibold">Email Sent!</CardTitle>
              <CardDescription className="text-base">
                We've sent a password reset link to <strong>{formData.email}</strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                Please check your email and follow the instructions to reset your password.
                The link will expire in 24 hours.
              </p>

              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-6">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Try Again
              </Button>

              <Link
                to="/auth/login"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
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
          <p className="text-gray-600">Reset your password</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-semibold">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and select your role to receive a password reset link
            </CardDescription>
          </CardHeader>

          <form onSubmit={(e) => {
            e.preventDefault()
            handleForgetPassword(formData)
          }}>
            <CardContent className="space-y-4">
              {/* User Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="userType" className="text-sm font-medium">
                  I am a
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
                        {option.label}
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
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
              </Button>

              <Link
                to="/auth/login"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default ForgetPasswordPage
