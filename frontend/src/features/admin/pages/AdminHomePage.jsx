// features/admin/pages/AdminHomePage.jsx - UPDATED WITH REAL STUDENT MANAGEMENT

import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SideNavbar from '../../../components/SideNavbar'
import AdminDashboard from './AdminDashboardPage'
import StudentPage from './StudentPage'  // ✅ REAL STUDENT PAGE
import { logout } from '../../../redux/authSlice'

// Simple placeholder components for other pages
const SimpleFacultyPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Faculty Management</h1>
    <p className="text-gray-600">Faculty management features coming soon...</p>
    <div className="mt-6 p-4 bg-green-50 rounded-lg">
      <p className="text-green-800">👨‍🏫 This will be the full faculty CRUD interface</p>
    </div>
  </div>
)

const SimpleBranchPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Branch Management</h1>
    <p className="text-gray-600">Branch management features coming soon...</p>
    <div className="mt-6 p-4 bg-orange-50 rounded-lg">
      <p className="text-orange-800">🏢 This will be the full branch CRUD interface</p>
    </div>
  </div>
)

const SimpleSubjectPage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Subject Management</h1>
    <p className="text-gray-600">Subject management features coming soon...</p>
    <div className="mt-6 p-4 bg-purple-50 rounded-lg">
      <p className="text-purple-800">📚 This will be the full subject CRUD interface</p>
    </div>
  </div>
)

const SimpleProfilePage = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold mb-4">Profile Management</h1>
    <p className="text-gray-600">Profile management features coming soon...</p>
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <p className="text-gray-800">👤 This will be the profile management interface</p>
    </div>
  </div>
)

const AdminHomePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userType, user } = useSelector((state) => state.auth)

  const searchParams = new URLSearchParams(location.search)
  const selectedMenu = searchParams.get('page') || 'home'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/auth/login', { replace: true })
  }

  const renderContent = () => {
    switch (selectedMenu) {
      case 'home':
        return <AdminDashboard />
      case 'student':
        return <StudentPage />  // ✅ NOW USING REAL STUDENT PAGE
      case 'faculty':
        return <SimpleFacultyPage />
      case 'branch':
        return <SimpleBranchPage />
      case 'subject':
        return <SimpleSubjectPage />
      case 'profile':
        return <SimpleProfilePage />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideNavbar
        userType={userType}
        onLogout={handleLogout}
        userName={user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'Admin'}
      />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gray-50/30">
          <div className="mx-auto w-full max-w-7xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminHomePage
