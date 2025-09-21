import { Suspense, lazy } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Loading } from '@components/ui/Loading'

// Lazy load auth pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ForgetPasswordPage = lazy(() => import('./pages/ForgetPasswordPage'))
const UpdatePasswordPage = lazy(() => import('./pages/UpdatePasswordPage'))

const AuthRoutes = () => {
  return (
    <div className="auth-routes">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <Loading />
          </div>
        }
      >
        <Routes>
          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password/:resetId" element={<UpdatePasswordPage />} />

          {/* Legacy routes for backward compatibility */}
          <Route path="/:type/update-password/:resetId" element={<UpdatePasswordPage />} />

          {/* Catch all auth routes and redirect to login */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default AuthRoutes
