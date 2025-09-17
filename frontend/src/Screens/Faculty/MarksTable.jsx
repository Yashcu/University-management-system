import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MarksTable = ({ students, marks, handleMarksChange }) => {
  const mediaUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="w-[150px]">Marks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={student.profile ? `${mediaUrl}/media/${student.profile}` : '/assets/avatar.png'} alt={student.name} />
                  <AvatarFallback>{student.name?.[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{student.enrollmentNo}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  placeholder="Enter marks"
                  value={marks[student._id] || ''}
                  onChange={(e) => handleMarksChange(student._id, e.target.value)}
                  className="max-w-xs"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MarksTable;
