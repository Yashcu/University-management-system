import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Student from './Student/Student';
import Faculty from './Faculty/Faculty';
import Admin from './ManageAdmins/Admin';
import Branch from './Branch/Branch';
import Subject from './Subject/Subject';
import UserProfile from '../../components/common/UserProfile';
import Notice from '../Notice';
import Exam from '../Exam';
import { logout } from '../../redux/authSlice';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userType = useSelector((state) => state.auth.userType);

  const searchParams = new URLSearchParams(location.search);
  const selectedMenu = searchParams.get('page') || 'student';

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'student':
        return <Student />;
      case 'faculty':
        return <Faculty />;
      case 'admin':
        return <Admin />;
      case 'branch':
        return <Branch />;
      case 'subject':
        return <Subject />;
      case 'notice':
        return <Notice />;
      case 'exam':
        return <Exam />;
      case 'profile':
        return <UserProfile />;
      default:
        return <Student />;
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
