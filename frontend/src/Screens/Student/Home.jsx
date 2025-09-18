import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Notice from '../Notice';
import UserProfile from '../../components/common/UserProfile';
import ViewMarks from './ViewMarks';
import Material from './Material';
import Timetable from './Timetable';
import Exam from '../Exam';
import { logout } from '../../redux/authSlice';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userType = useSelector((state) => state.auth.userType);

  const searchParams = new URLSearchParams(location.search);
  const selectedMenu = searchParams.get('page') || 'profile';

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'profile':
        return <UserProfile />;
      case 'marks':
        return <ViewMarks />;
      case 'material':
        return <Material />;
      case 'timetable':
        return <Timetable />;
      case 'notice':
        return <Notice />;
      case 'exam':
        return <Exam />;
      default:
        return <UserProfile />;
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
