import React, { useState, useEffect, useCallback } from 'react';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import CustomButton from '../../components/ui/CustomButton';
import { useMarks } from '../../hooks/useMarks';
import MarksTable from './MarksTable';
import toast from 'react-hot-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { examService } from '../../services/examService';

const AddMarks = () => {
  const [exams, setExams] = useState([]);
  const {
    filters,
    students,
    marks,
    loading,
    processing,
    handleFilterChange,
    handleGetStudents,
    handleMarksChange,
    handleSubmitMarks,
  } = useMarks();

  const getExams = useCallback(async () => {
    try {
      const { data } = await examService.search();
      setExams(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
    }
  }, []);

  useEffect(() => {
    getExams();
  }, [getExams]);

  return (
    <div>
      <Heading title="Add Student Marks" />
      <Card className="my-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div>
              <Label>Exam</Label>
              <Select
                value={filters.examId}
                onValueChange={(value) => handleFilterChange('examId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  {exams.map((exam) => (
                    <SelectItem key={exam._id} value={exam._id}>
                      {exam.name} - {exam.branchId.name} (Sem {exam.semester})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Note: In a real app, subject and branch would be dynamically fetched based on exam */}
            <div>
              <Label>Subject</Label>
              <Select
                value={filters.subjectId}
                onValueChange={(value) =>
                  handleFilterChange('subjectId', value)
                }
                disabled={!filters.examId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {/* Populate subjects based on selected exam */}
                </SelectContent>
              </Select>
            </div>

            <CustomButton
              onClick={handleGetStudents}
              disabled={!filters.examId || !filters.subjectId || loading}
            >
              {loading ? 'Fetching...' : 'Get Students'}
            </CustomButton>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Loading />
      ) : students.length > 0 ? (
        <>
          <MarksTable
            students={students}
            marks={marks}
            handleMarksChange={handleMarksChange}
          />
          <div className="flex justify-end mt-6">
            <CustomButton
              onClick={handleSubmitMarks}
              loading={processing}
              disabled={processing}
            >
              Submit Marks
            </CustomButton>
          </div>
        </>
      ) : (
        <NoData message="Select filters and click 'Get Students' to see the student list." />
      )}
    </div>
  );
};

export default AddMarks;
