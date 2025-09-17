import React, { useState, useEffect, useCallback } from 'react';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import { timetableService } from '../../services/timetableService';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download } from 'lucide-react';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const mediaUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  const getTimetables = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await timetableService.search();
      setTimetables(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch timetables.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getTimetables();
  }, [getTimetables]);

  return (
    <div>
      <Heading title="Class Timetable" />

      <div className="my-6">
        {isLoading ? (
          <Loading />
        ) : timetables.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead className="text-right">Download</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timetables.map((timetable) => (
                  <TableRow key={timetable._id}>
                    <TableCell className="font-medium">{timetable.title}</TableCell>
                    <TableCell>{timetable.semester}</TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`${mediaUrl}/media/${timetable.file}`}
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
          <NoData message="No timetables have been uploaded yet." />
        )}
      </div>
    </div>
  );
};

export default Timetable;
