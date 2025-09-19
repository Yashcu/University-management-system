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
import { Badge } from '@/components/ui/badge';

const NoticeTable = ({ notices, onEdit, onDelete }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notices.map((notice) => (
            <TableRow key={notice._id}>
              <TableCell className="font-medium">{notice.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    notice.target === 'student'
                      ? 'default'
                      : notice.target === 'faculty'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {notice.target.charAt(0).toUpperCase() +
                    notice.target.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(notice.date).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <CustomButton
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(notice)}
                  className="mr-2"
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(notice)}
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

export default NoticeTable;
