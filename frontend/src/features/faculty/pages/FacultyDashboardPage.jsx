import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSelector } from 'react-redux';

const FacultyDashboard = () => {
  const userProfile = useSelector((state) => state.auth.user);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="p-6 flex flex-col items-start">
          <div className="mb-2 text-2xl font-semibold">Welcome, {userProfile?.name || 'Faculty'}!</div>
          <div className="text-muted-foreground">Here’s a quick overview of your actions and information for the day.</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-lg font-medium mb-1">Quick Actions</div>
          <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
            <li>Upload new study material</li>
            <li>View/add marks for students</li>
            <li>Check or update timetable</li>
            <li>Read university notices</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="text-lg font-medium mb-1">Profile</div>
          <div>Name: {userProfile?.name || 'N/A'}</div>
          <div>Email: {userProfile?.email || 'N/A'}</div>
          {/* Add more profile info as needed */}
        </CardContent>
      </Card>
    </div>
  );
};

export default FacultyDashboard;
