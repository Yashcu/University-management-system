import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { marksService } from '../services/marksService';

export const useMarks = () => {
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await marksService.getStudentMarks();
      setMarks(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch marks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getMarks();
  }, [getMarks]);

  const groupedMarks = marks.reduce((acc, mark) => {
    const examName = mark.exam?.name || 'Unknown Exam';
    if (!acc[examName]) {
      acc[examName] = [];
    }
    acc[examName].push(mark);
    return acc;
  }, {});

  return { marks, isLoading, getMarks, groupedMarks };
};
