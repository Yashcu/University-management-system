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
import { Download } from 'lucide-react';

const TimetableTable = ({ timetables, onDelete }) => {
  const mediaUrl =
    import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead className="text-center">Download</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timetables.map((timetable) => (
            <TableRow key={timetable._id}>
              <TableCell className="font-medium">{timetable.title}</TableCell>
              <TableCell>{timetable.branchId?.name || 'N/A'}</TableCell>
              <TableCell>{timetable.semester}</TableCell>
              <TableCell className="text-center">
                <a
                  href={`${mediaUrl}/media/${timetable.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                >
                  <Download className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                </a>
              </TableCell>
              <TableCell className="text-right">
                <CustomButton
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(timetable)}
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

export default TimetableTable;
