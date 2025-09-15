import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import { marksService } from '../../services/marksService';

const ViewMarks = () => {
  const [marks, setMarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMarks = async () => {
    setIsLoading(true);
    try {
      const { data } = await marksService.getStudentMarks();
      setMarks(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch marks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMarks();
  }, []);

  // Group marks by exam
  const groupedMarks = marks.reduce((acc, mark) => {
    const examName = mark.exam?.name || 'Unknown Exam';
    if (!acc[examName]) {
      acc[examName] = [];
    }
    acc[examName].push(mark);
    return acc;
  }, {});

  return (
    <div>
      <Heading title="My Marks" />
      {isLoading ? (
        <Loading />
      ) : Object.keys(groupedMarks).length === 0 ? (
        <NoData message="Your marks have not been uploaded yet." />
      ) : (
        <div className="space-y-8 mt-6">
          {Object.entries(groupedMarks).map(([examName, marksList]) => (
            <div key={examName} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">{examName}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="py-2 px-4 text-left font-semibold">
                        Subject
                      </th>
                      <th className="py-2 px-4 text-left font-semibold">
                        Marks Obtained
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {marksList.map((mark) => (
                      <tr key={mark._id} className="border-b">
                        <td className="py-2 px-4">
                          {mark.subject?.name || 'N/A'}
                        </td>
                        <td className="py-2 px-4">{mark.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMarks;
