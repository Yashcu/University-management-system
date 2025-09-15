import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import CustomButton from './ui/CustomButton';

const Navbar = ({ userType, onLogout }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = searchParams.get('page');

  const MENU_ITEMS = {
    student: [
      { id: 'profile', label: 'Profile' },
      { id: 'marks', label: 'View Marks' },
      { id: 'material', label: 'Material' },
      { id: 'timetable', label: 'Timetable' },
      { id: 'notice', label: 'Notice' },
      { id: 'exam', label: 'Exam' },
    ],
    faculty: [
      { id: 'student-finder', label: 'Student Finder' },
      { id: 'material', label: 'Material' },
      { id: 'timetable', label: 'Timetable' },
      { id: 'add-marks', label: 'Add Marks' },
      { id: 'notice', label: 'Notice' },
      { id: 'exam', label: 'Exam' },
      { id: 'profile', label: 'Profile' },
    ],
    admin: [
      { id: 'student', label: 'Student' },
      { id: 'faculty', label: 'Faculty' },
      { id: 'admin', label: 'Admin' },
      { id: 'branch', label: 'Branch' },
      { id: 'subject', label: 'Subject' },
      { id: 'notice', label: 'Notice' },
      { id: 'exam', label: 'Exam' },
      { id: 'profile', label: 'Profile' },
    ],
  };

  const getMenuItemClass = (isActive) => {
    const baseClasses =
      'text-center px-6 py-3 cursor-pointer font-medium text-sm w-full rounded-md transition-all duration-300 ease-in-out';
    if (isActive) {
      return `${baseClasses} bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg transform -translate-y-1`;
    }
    return `${baseClasses} bg-blue-50 text-blue-700 hover:bg-blue-100`;
  };

  const currentMenuItems = MENU_ITEMS[userType] || [];
  const defaultPage = currentMenuItems[0]?.id;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-800">College CMS</h1>
          </div>
          <div className="flex-grow">
            <ul className="flex justify-center items-center gap-4">
              {currentMenuItems.map((item) => (
                <li key={item.id} className="w-full max-w-[150px]">
                  <NavLink
                    to={`/${userType}?page=${item.id}`}
                    className={() =>
                      getMenuItemClass(
                        currentPage === item.id ||
                          (!currentPage && item.id === defaultPage)
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-shrink-0">
            <CustomButton variant="danger" onClick={onLogout}>
              Logout
            </CustomButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
