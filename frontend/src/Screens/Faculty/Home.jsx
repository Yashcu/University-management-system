import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import StudentFinder from './StudentFinder';
import Material from './Material/Material';
import Timetable from './TimeTable/Timetable';
import AddMarks from './AddMarks';
import UserProfile from '../../components/common/UserProfile';
import Notice from '../Notice';
import Exam from '../Exam';
import { logout } from '../../redux/authSlice';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Logic is now here, in the parent component
  const userType = useSelector((state) => state.auth.userType);

  const searchParams = new URLSearchParams(location.search);
  const selectedMenu = searchParams.get('page') || 'student-finder';

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'student-finder':
        return <StudentFinder />;
      case 'material':
        return <Material />;
      case 'timetable':
        return <Timetable />;
      case 'add-marks':
        return <AddMarks />;
      case 'notice':
        return <Notice />;
      case 'exam':
        return <Exam />;
      case 'profile':
        return <UserProfile />;
      default:
        return <StudentFinder />;
    }
  };

  return (
    <>
      <Navbar userType={userType} onLogout={logoutHandler} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
