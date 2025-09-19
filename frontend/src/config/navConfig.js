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
  Bell,
  GraduationCap,
  BookMarked
} from 'lucide-react';

export const navConfig = {
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
