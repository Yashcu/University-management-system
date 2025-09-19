import React, { useState, useEffect, useCallback } from 'react';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import { materialService } from '../../services/api';
import { subjectService } from '../../services/api'; // To fetch subjects for filtering
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download } from 'lucide-react';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const mediaUrl =
    import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  const getSubjects = useCallback(async () => {
    try {
      // API should fetch subjects relevant to the student
      const { data } = await subjectService.search();
      setSubjects(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch subjects.');
    }
  }, []);

  const getMaterials = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        subject: selectedSubject === 'all' ? '' : selectedSubject,
      };
      const { data } = await materialService.search(params);
      setMaterials(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch study materials.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubject]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  useEffect(() => {
    getMaterials();
  }, [getMaterials]);

  return (
    <div>
      <Heading title="Study Materials" />

      <div className="my-6 max-w-sm">
        <Select onValueChange={setSelectedSubject} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Filter by Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject._id} value={subject._id}>
                {subject.name} ({subject.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Loading />
      ) : materials.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material._id}>
                  <TableCell className="font-medium">
                    {material.title}
                  </TableCell>
                  <TableCell>{material.subjectId?.name || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`${mediaUrl}/media/${material.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
                    >
                      <Download className="h-5 w-5 text-gray-700" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <NoData message="No study materials found for the selected subject." />
      )}
    </div>
  );
};

export default Material;
