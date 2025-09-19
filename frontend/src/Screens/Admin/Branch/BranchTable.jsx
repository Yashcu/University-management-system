import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import CustomButton from '../../../components/ui/CustomButton';

const BranchTable = ({ branches, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch Name</TableHead>
            <TableHead>Branch Code</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch._id}>
              <TableCell className="font-medium">{branch.name}</TableCell>
              <TableCell>{branch.code}</TableCell>
              <TableCell className="text-right">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(branch)}
                  className="mr-2"
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(branch)}
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

export default BranchTable;
