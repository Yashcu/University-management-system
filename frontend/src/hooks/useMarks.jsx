import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { marksService } from '../services/marksService';

export const useMarks = () => {
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ examId: '', subjectId: '' });

  const getMarks = useCallback(async (customFilters) => {
    const { examId, subjectId } = customFilters || filters;
    if (!examId || !subjectId) {
      setMarks([]);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await marksService.getStudentMarks({ examId, subjectId });
      setMarks(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch marks');
      setMarks([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (filters.examId && filters.subjectId) {
      getMarks();
    }
  }, [filters, getMarks]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const groupedMarks = marks.reduce((acc, mark) => {
    const examName = mark.exam?.name || 'Unknown Exam';
    if (!acc[examName]) acc[examName] = [];
    acc[examName].push(mark);
    return acc;
  }, {});

  return { marks, isLoading, getMarks, groupedMarks, filters, handleFilterChange };
};
