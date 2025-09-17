import React from 'react';
import Heading from '../../components/ui/Heading';
import StatCard from '../../components/ui/StatCard';
import DashboardActionCard from '../../components/ui/DashboardActionCard';
import { useDashboardNavigate } from '../../hooks/useDashboardNavigate';
import { Users, UserCheck, BookOpen, Building } from 'lucide-react';

const AdminDashboard = () => {
  const navigateToPage = useDashboardNavigate('admin'); // Pass userType to the hook

  const stats = {
    students: 1250,
    faculty: 75,
    subjects: 210,
    branches: 12,
  };

  return (
    <div>
      <Heading title="Admin Dashboard" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-6">
        <StatCard title="Total Students" value={stats.students} icon={Users} />
        <StatCard title="Total Faculty" value={stats.faculty} icon={UserCheck} />
        <StatCard title="Total Subjects" value={stats.subjects} icon={BookOpen} />
        <StatCard title="Total Branches" value={stats.branches} icon={Building} />
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
