import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Button } from '@components/ui/button'
import { User, LogOut, GraduationCap } from 'lucide-react'

const Navbar = ({ userType, onLogout, userName }) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const currentPage = searchParams.get('page')

  const MENU_ITEMS = {
    student: [
      { id: 'home', label: 'Dashboard', icon: GraduationCap },
      { id: 'marks', label: 'View Marks' },
      { id: 'material', label: 'Material' },
      { id: 'timetable', label: 'Timetable' },
      { id: 'notice', label: 'Notice' },
      { id: 'exam', label: 'Exam' },
    ],
    faculty: [
      { id: 'home', label: 'Dashboard', icon: GraduationCap },
      { id: 'student-finder', label: 'Student Finder' },
      { id: 'material', label: 'Material' },
      { id: 'timetable', label: 'Timetable' },
      { id: 'add-marks', label: 'Add Marks' },
      { id: 'notice', label: 'Notice' },
      { id: 'exam', label: 'Exam' },
    ],
    admin: [
      { id: 'home', label: 'Dashboard', icon: GraduationCap },
      { id: 'student', label: 'Students' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'admin', label: 'Admins' },
      { id: 'branch', label: 'Branches' },
      { id: 'subject', label: 'Subjects' },
      { id: 'notice', label: 'Notice' },
      { id: 'exam', label: 'Exams' },
    ],
  }

  const getNavLinkClass = (isActive) => {
    const baseClasses =
      'relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out hover:bg-blue-50 hover:text-blue-700'

    if (isActive) {
      return `${baseClasses} bg-blue-100 text-blue-700 shadow-sm`
    }
    return `${baseClasses} text-gray-600`
  }

  const currentMenuItems = MENU_ITEMS[userType] || []
  const defaultPage = currentMenuItems[0]?.id || 'home'

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600 mr-2" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">College CMS</h1>
              <p className="text-xs text-gray-500 capitalize">
                {userType} Portal
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {currentMenuItems.map((item) => (
              <NavLink
                key={item.id}
                to={`/${userType}?page=${item.id}`}
                className={({ isActive }) =>
                  getNavLinkClass(
                    isActive ||
                    currentPage === item.id ||
                    (!currentPage && item.id === defaultPage)
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {userName && (
              <div className="hidden sm:flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-1" />
                <span>Welcome, {userName}</span>
              </div>
            )}

            <NavLink
              to={`/${userType}?page=profile`}
              className={({ isActive }) =>
                getNavLinkClass(isActive || currentPage === 'profile')
              }
            >
              <User className="h-4 w-4" />
            </NavLink>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center space-x-1 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden py-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {currentMenuItems.map((item) => (
              <NavLink
                key={item.id}
                to={`/${userType}?page=${item.id}`}
                className={({ isActive }) =>
                  getNavLinkClass(
                    isActive ||
                    currentPage === item.id ||
                    (!currentPage && item.id === defaultPage)
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
