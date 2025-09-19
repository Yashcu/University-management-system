import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import SideNavbar from '../../components/SideNavbar';
import Notice from '../Notice';
import UserProfile from '../../components/common/UserProfile';
import ViewMarks from './ViewMarks';
import Material from './Material';
import Timetable from './Timetable';
import { logout } from '../../redux/authSlice';
import Heading from '../../components/ui/Heading';

const StudentDashboard = () => <Heading title="Student Dashboard" />;

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);

  const searchParams = new URLSearchParams(location.search);
  const selectedMenu = searchParams.get('page') || 'home';

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'home':
        return <StudentDashboard />;
      case 'profile':
        return <UserProfile />;
      case 'view-marks':
        return <ViewMarks />;
      case 'material':
        return <Material />;
      case 'timetable':
        return <Timetable />;
      case 'notice':
        return <Notice />;
      default:
        return <StudentDashboard />;
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
