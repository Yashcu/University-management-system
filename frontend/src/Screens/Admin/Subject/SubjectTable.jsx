import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomButton from '../../../components/ui/CustomButton';

const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject Name</TableHead>
            <TableHead>Subject Code</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjects.map((subject) => (
            <TableRow key={subject._id}>
              <TableCell className="font-medium">{subject.name}</TableCell>
              <TableCell>{subject.code}</TableCell>
              <TableCell>{subject.branchId?.name || 'N/A'}</TableCell>
              <TableCell>{subject.semester}</TableCell>
              <TableCell className="text-right">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(subject)}
                  className="mr-2"
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(subject)}
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

export default SubjectTable;
