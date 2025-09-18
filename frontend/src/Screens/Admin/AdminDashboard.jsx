import React, { useState, useEffect } from 'react';
import Heading from '../../components/ui/Heading';
import StatCard from '../../components/ui/StatCard';
import DashboardActionCard from '../../components/ui/DashboardActionCard';
import { useDashboardNavigate } from '../../hooks/useDashboardNavigate';
import { Users, UserCheck, BookOpen, Building } from 'lucide-react';
import { studentService } from '../../services/studentService';
import { facultyService } from '../../services/facultyService';
import { subjectService } from '../../services/subjectService';
import { branchService } from '../../services/branchService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigateToPage = useDashboardNavigate('admin');
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    subjects: 0,
    branches: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentRes, facultyRes, subjectRes, branchRes] = await Promise.all([
          studentService.search(),
          facultyService.search(),
          subjectService.search(),
          branchService.search(),
        ]);

        setStats({
          students: studentRes.data?.data?.length || 0,
          faculty: facultyRes.data?.data?.length || 0,
          subjects: subjectRes.data?.data?.length || 0,
          branches: branchRes.data?.data?.length || 0,
        });
      } catch (error) {
        toast.error('Failed to fetch dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <Heading title="Admin Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-6">
        <StatCard title="Total Students" value={isLoading ? '...' : stats.students} icon={Users} />
        <StatCard title="Total Faculty" value={isLoading ? '...' : stats.faculty} icon={UserCheck} />
        <StatCard title="Total Subjects" value={isLoading ? '...' : stats.subjects} icon={BookOpen} />
        <StatCard title="Total Branches" value={isLoading ? '...' : stats.branches} icon={Building} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DashboardActionCard
            title="Manage Students"
            description="Add, edit, or remove student profiles and details."
            link="student"
            onNavigate={navigateToPage}
          />
          <DashboardActionCard
            title="Manage Faculty"
            description="Onboard new faculty and manage existing profiles."
            link="faculty"
            onNavigate={navigateToPage}
          />
          <DashboardActionCard
            title="Manage Subjects"
            description="Define courses, subjects, and academic curriculum."
            link="subject"
            onNavigate={navigateToPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
