import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import CustomButton from '../../components/ui/CustomButton';
import { examService } from '../../services/examService';
import { subjectService } from '../../services/subjectService';
import { studentService } from '../../services/studentService';
import { marksService } from '../../services/marksService';
import { branchService } from '../../services/branchService';

const AddMarks = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [marks, setMarks] = useState({});

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitialData = async () => {
    setIsLoading(true);
    try {
      const [examRes, subjectRes, branchRes] = await Promise.all([
        examService.getAllExams(),
        subjectService.getAllSubjects(),
        branchService.getAllBranches(),
      ]);
      setExams(examRes.data?.data || []);
      setSubjects(subjectRes.data?.data || []);
      setBranches(branchRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch initial data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!selectedBranch || !selectedExam || !selectedSubject) {
      return toast.error('Please select branch, exam, and subject.');
    }
    setIsLoading(true);
    try {
      const [studentRes, marksRes] = await Promise.all([
        studentService.searchStudents({ branch: selectedBranch }),
        marksService.getMarksByExamAndSubject(selectedExam, selectedSubject),
      ]);
      setStudents(studentRes.data?.data || []);

      const marksMap = marksRes.data?.data.reduce((acc, mark) => {
        acc[mark.student._id] = mark.marks;
        return acc;
      }, {});
      setMarks(marksMap || {});
    } catch (error) {
      toast.error('Failed to fetch students and marks.');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarksChange = (studentId, value) => {
    setMarks((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSubmitMarks = async () => {
    setIsSubmitting(true);
    toast.loading('Submitting Marks...');
    const marksData = Object.keys(marks).map((studentId) => ({
      student: studentId,
      marks: marks[studentId],
    }));

    try {
      const res = await marksService.addOrUpdateMarks({
        exam: selectedExam,
        subject: selectedSubject,
        marks: marksData,
      });
      toast.dismiss();
      if (res.data?.success) {
        toast.success('Marks submitted successfully!');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to submit marks.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Heading title="Add/Update Marks" />

      <form
        onSubmit={handleSearch}
        className="mt-6 p-4 bg-white rounded-md shadow-md grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="block text-sm font-medium">Branch</label>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Exam</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Exam</option>
            {exams.map((ex) => (
              <option key={ex._id} value={ex._id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="">Select Subject</option>
            {subjects.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
        <CustomButton type="submit">Search Students</CustomButton>
      </form>

      {isLoading ? (
        <Loading />
      ) : (
        students.length > 0 && (
          <div className="mt-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                      Student ID
                    </th>
                    <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                      Name
                    </th>
                    <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                      Marks
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td className="py-3 px-4">{student.studentId}</td>
                      <td className="py-3 px-4">{student.name}</td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={marks[student._id] || ''}
                          onChange={(e) =>
                            handleMarksChange(student._id, e.target.value)
                          }
                          className="w-24 px-2 py-1 border rounded-md"
                          placeholder="Enter marks"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <CustomButton
                onClick={handleSubmitMarks}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Marks
              </CustomButton>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AddMarks;
