import React, { useState, useEffect, useCallback } from 'react';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import { marksService } from '../../services/marksService';
import { examService } from '../../services/examService';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ViewMarks = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getExams = useCallback(async () => {
    try {
      const { data } = await examService.search();
      setExams(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
    }
  }, []);

  const getMarks = useCallback(async () => {
    if (!selectedExam) return;
    setIsLoading(true);
    try {
      const { data } = await marksService.getMarksByStudent({ examId: selectedExam });
      setMarks(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch marks for the selected exam.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedExam]);

  useEffect(() => {
    getExams();
  }, [getExams]);

  useEffect(() => {
    getMarks();
  }, [getMarks]);

  const selectedExamDetails = exams.find(e => e._id === selectedExam);

  return (
    <div>
      <Heading title="Your Marks" />

      <div className="my-6 max-w-sm">
        <Select onValueChange={setSelectedExam}>
          <SelectTrigger>
            <SelectValue placeholder="Select an Exam to view marks" />
          </SelectTrigger>
          <SelectContent>
            {exams.map((exam) => (
              <SelectItem key={exam._id} value={exam._id}>
                {exam.name} - Sem {exam.semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Loading />
      ) : marks.length > 0 && selectedExamDetails ? (
        <Card>
          <CardHeader>
            <CardTitle>Results for {selectedExamDetails.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Subject Code</TableHead>
                    <TableHead className="text-right">Marks Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks.map((mark) => (
                    <TableRow key={mark._id}>
                      <TableCell className="font-medium">{mark.subjectId.name}</TableCell>
                      <TableCell>{mark.subjectId.code}</TableCell>
                      <TableCell className="text-right font-bold">{mark.marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <NoData message={selectedExam ? "No marks found for this exam." : "Please select an exam to see your marks."} />
      )}
    </div>
  );
};

export default ViewMarks;
