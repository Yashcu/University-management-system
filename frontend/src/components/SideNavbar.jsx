import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  UserCheck,
  Building,
  BookOpen,
  FileText,
  Calendar,
  ClipboardList,
  User,
  LogOut,
  Bell,
  GraduationCap,
  BookMarked
} from 'lucide-react';

// Navigation items for each role
const navConfig = {
  admin: [
    { href: 'home', icon: Home, label: 'Dashboard' },
    { href: 'student', icon: Users, label: 'Students' },
    { href: 'faculty', icon: UserCheck, label: 'Faculty' },
    { href: 'admin', icon: User, label: 'Admins' },
    { href: 'branch', icon: Building, label: 'Branches' },
    { href: 'subject', icon: BookOpen, label: 'Subjects' },
    { href: 'notice', icon: Bell, label: 'Notices' },
    { href: 'exam', icon: FileText, label: 'Exams' },
  ],
  faculty: [
    { href: 'home', icon: Home, label: 'Dashboard' },
    { href: 'add-marks', icon: ClipboardList, label: 'Add Marks' },
    { href: 'timetable', icon: Calendar, label: 'Timetable' },
    { href: 'material', icon: BookMarked, label: 'Materials' },
    { href: 'notice', icon: Bell, label: 'Notices' },
  ],
  student: [
    { href: 'home', icon: Home, label: 'Dashboard' },
    { href: 'view-marks', icon: GraduationCap, label: 'View Marks' },
    { href: 'timetable', icon: Calendar, label: 'Timetable' },
    { href: 'material', icon: BookMarked, label: 'Materials' },
    { href: 'notice', icon: Bell, label: 'Notices' },
  ]
};

const NavLink = ({ to, userType, icon: Icon, children }) => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentPage = searchParams.get('page') || 'home';
    const isActive = currentPage === to;

  return (
    <Link to={`/${userType}?page=${to}`}>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        <Icon className="mr-2 h-4 w-4" />
        {children}
      </Button>
    </Link>
  );
};

const SideNavbar = ({ userType, onLogout }) => {
  const navItems = navConfig[userType] || [];
  const portalTitle = `${userType.charAt(0).toUpperCase() + userType.slice(1)} Portal`;

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to={`/${userType}?page=home`} className="flex items-center gap-2 font-semibold">
            <ClipboardList className="h-6 w-6" />
            <span>{portalTitle}</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map(item => (
                <NavLink key={item.href} to={item.href} userType={userType} icon={item.icon}>{item.label}</NavLink>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
            <nav className='grid items-start text-sm font-medium'>
                <NavLink to="profile" userType={userType} icon={User}>Profile</NavLink>
                <Button variant="ghost" className="w-full justify-start" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </nav>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
