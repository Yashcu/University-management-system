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
import { Download } from 'lucide-react';

const MaterialTable = ({ materials, onDelete }) => {
  const mediaUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-center">Download</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material._id}>
              <TableCell className="font-medium">{material.title}</TableCell>
              <TableCell>{material.subjectId?.name || 'N/A'}</TableCell>
              <TableCell className="text-center">
                <a
                  href={`${mediaUrl}/media/${material.file}`}
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
                  onClick={() => onDelete(material)}
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

export default MaterialTable;
