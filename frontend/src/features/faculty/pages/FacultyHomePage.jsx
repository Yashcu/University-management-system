import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import SideNavbar from '../../../components/SideNavbar';
import Material from '../../../Screens/Faculty/Material/Material';
import Timetable from '../../../Screens/Faculty/TimeTable/Timetable';
import AddMarks from '../../../Screens/Faculty/AddMarks';
import UserProfile from '../../../components/common/UserProfile';
import Notice from '../../../Screens/Notice';
import { logout } from '../../../redux/authSlice';
import Heading from '../../../components/ui/Heading';
import FacultyDashboard from './FacultyDashboardPage';

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
        return <FacultyDashboard />;
      case 'material':
        return <Material />;
      case 'timetable':
        return <Timetable />;
      case 'add-marks':
        return <AddMarks />;
      case 'notice':
        return <Notice />;
      case 'profile':
        return <UserProfile />;
      default:
        return <FacultyDashboard />;
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
