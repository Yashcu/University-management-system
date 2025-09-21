// config/navConfig.js
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  FileText,
  ClipboardList,
  GraduationCap,
  UserCheck,
  Search
} from 'lucide-react'

export const navConfig = {
  student: [
    { href: 'home', label: 'Dashboard', icon: Home },
    { href: 'marks', label: 'View Marks', icon: ClipboardList },
    { href: 'material', label: 'Material', icon: BookOpen },
    { href: 'timetable', label: 'Timetable', icon: Calendar },
    { href: 'notice', label: 'Notice', icon: FileText },
    { href: 'exam', label: 'Exam', icon: GraduationCap },
  ],
  faculty: [
    { href: 'home', label: 'Dashboard', icon: Home },
    { href: 'student-finder', label: 'Student Finder', icon: Search },
    { href: 'material', label: 'Material', icon: BookOpen },
    { href: 'timetable', label: 'Timetable', icon: Calendar },
    { href: 'add-marks', label: 'Add Marks', icon: ClipboardList },
    { href: 'notice', label: 'Notice', icon: FileText },
    { href: 'exam', label: 'Exam', icon: GraduationCap },
  ],
  admin: [
    { href: 'home', label: 'Dashboard', icon: Home },
    { href: 'student', label: 'Students', icon: Users },
    { href: 'faculty', label: 'Faculty', icon: UserCheck },
    { href: 'admin', label: 'Admins', icon: Users },
    { href: 'branch', label: 'Branches', icon: BookOpen },
    { href: 'subject', label: 'Subjects', icon: BookOpen },
    { href: 'notice', label: 'Notice', icon: FileText },
    { href: 'exam', label: 'Exams', icon: GraduationCap },
  ],
}
