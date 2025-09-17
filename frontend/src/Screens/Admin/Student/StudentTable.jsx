import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CustomButton from '../../../components/ui/CustomButton'; // Your custom button

const StudentTable = ({ students, onEdit, onDelete }) => {
  const mediaUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Profile</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={student.profile ? `${mediaUrl}/media/${student.profile}` : '/assets/avatar.png'} alt={`${student.firstName} ${student.lastName}`} />
                  <AvatarFallback>{student.firstName?.[0]}{student.lastName?.[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{student.enrollmentNo}</TableCell>
              <TableCell>{`${student.firstName} ${student.lastName}`}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.branchId?.name || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(student)}
                  className="mr-2"
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(student)}
                >
                  Delete
                </CustomButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
