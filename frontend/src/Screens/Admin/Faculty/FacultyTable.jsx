import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CustomButton from '../../../components/ui/CustomButton';

const FacultyTable = ({ faculties, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Profile</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faculties.map((faculty) => (
            <TableRow key={faculty._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={faculty.profile}
                    alt={`${faculty.firstName} ${faculty.lastName}`}
                  />
                  <AvatarFallback>
                    {faculty.firstName?.[0]}
                    {faculty.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{`${faculty.firstName} ${faculty.lastName}`}</TableCell>
              <TableCell>{faculty.email}</TableCell>
              <TableCell>{faculty.branchId?.name || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(faculty)}
                  className="mr-2"
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(faculty)}
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

export default FacultyTable;
