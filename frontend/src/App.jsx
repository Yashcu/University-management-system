// App.jsx - UPDATED VERSION
import { Toaster } from 'react-hot-toast'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

// Route imports with consistent naming
import AuthRoutes from '@features/auth/routes'
import AdminRoutes from '@features/admin/routes'
import FacultyRoutes from '@features/faculty/routes'
import StudentRoutes from '@features/student/routes'

const App = () => {
  return (
    <>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Auth Routes (Public) */}
          <Route path="/auth/*" element={<AuthRoutes />} />

          {/* Protected Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/faculty/*" element={<FacultyRoutes />} />
          <Route path="/student/*" element={<StudentRoutes />} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}

export default App
