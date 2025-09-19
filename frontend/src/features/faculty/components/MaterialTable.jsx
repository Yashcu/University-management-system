import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '../../../components/ui/Button';
import { Download } from 'lucide-react';

// Optionally accept 'subjects' for ID-to-name mapping
const MaterialTable = ({ materials, onDelete, subjects = [] }) => {
  const mediaUrl =
    import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  // Helper to get subject name by ID from provided list
  const getSubjectName = (material) => {
    // Prefer backend-populated object
    if (material.subject && typeof material.subject === 'object') {
      return material.subject.name || 'N/A';
    }
    // Fallback: lookup by ID if only ID present
    if (subjects.length > 0 && (material.subject || material.subjectId)) {
      const id = material.subject || material.subjectId;
      const found = subjects.find((s) => s._id === id);
      return found?.name || 'N/A';
    }
    // Fallback: always N/A
    return 'N/A';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Download</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material._id}>
              <TableCell className="font-medium">{material.title}</TableCell>
              <TableCell>{getSubjectName(material)}</TableCell>
              <TableCell>{material.semester || 'N/A'}</TableCell>
              <TableCell>
                {material.type
                  ? material.type.charAt(0).toUpperCase() + material.type.slice(1)
                  : 'N/A'}
              </TableCell>
              <TableCell className="text-center">
                {material.file ? (
                  <a
                    href={`${mediaUrl}/media/${material.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 text-gray-600 hover:text-gray-900" />
                  </a>
                ) : (
                  'N/A'
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(material)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaterialTable;
