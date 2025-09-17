import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import SideNavbar from '../../components/SideNavbar';
import AdminDashboard from './AdminDashboard'; // The new dashboard homepage
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
  const selectedMenu = searchParams.get('page') || 'home'; // Default to the new dashboard

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'home':
        return <AdminDashboard />;
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
        return <AdminDashboard />;
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <SideNavbar userType={userType} onLogout={logoutHandler} />
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {renderContent()}
        </main>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Home;
