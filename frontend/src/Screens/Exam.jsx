import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../components/ui/Heading';
import Loading from '../components/ui/Loading';
import NoData from '../components/ui/NoData';
import CustomButton from '../components/ui/CustomButton';
import Modal from '../components/ui/Modal';
import DeleteConfirm from '../components/ui/DeleteConfirm';
import { branchService } from '../services/branchService';
import { examService } from '../services/examService';
import { subjectService } from '../services/subjectService';

const Exam = () => {
  const [exams, setExams] = useState([]);
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [processLoading, setProcessLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examType, setExamType] = useState('mid');
  const [subjectId, setSubjectId] = useState('');

  const resetForm = () => {
    setExamName('');
    setExamDate('');
    setExamType('mid');
    setSubjectId('');
    setSelectedBranch('');
    setIsEditing(false);
    setSelectedExamId('');
  };

  const getExams = async () => {
    setIsLoading(true);
    try {
      const { data } = await examService.search();
      setExams(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFormData = async () => {
    try {
      const branchRes = await branchService.search();
      setBranches(branchRes.data?.data || []);
      const subjectRes = await subjectService.search();
      setSubjects(subjectRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch form data');
    }
  };

  useEffect(() => {
    getExams();
    getFormData();
  }, []);

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  const openEditForm = (exam) => {
    resetForm();
    setIsEditing(true);
    setSelectedExamId(exam._id);
    setExamName(exam.name);
    setExamDate(new Date(exam.date).toISOString().split('T')[0]);
    setExamType(exam.examType);
    setSelectedBranch(exam.branch?._id || '');
    setSubjectId(exam.subject?._id || '');
    setShowAddForm(true);
  };

  const addExamHandler = async (e) => {
    e.preventDefault();
    if (!examName || !examDate || !examType || !selectedBranch || !subjectId) {
      return toast.error('Please fill all fields');
    }

    setProcessLoading(true);
    const examData = {
      name: examName,
      date: examDate,
      examType: examType,
      branch: selectedBranch,
      subject: subjectId,
      totalMarks: 100, // Assuming a default for now
    };

    try {
      let res;
      if (isEditing) {
        toast.loading('Updating Exam...');
        res = await examService.update(selectedExamId, examData);
      } else {
        toast.loading('Adding Exam...');
        res = await examService.add(examData);
      }
      toast.dismiss();
      if (res.data?.success) {
        toast.success(res.data?.message);
        setShowAddForm(false);
        resetForm();
        getExams();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setProcessLoading(false);
    }
  };

  const openDeleteConfirm = (id) => {
    setSelectedExamId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setProcessLoading(true);
    toast.loading('Deleting Exam...');
    try {
      const res = await examService.delete(selectedExamId);
      toast.dismiss();
      if (res.data?.success) {
        toast.success(res.data.message);
        setShowDeleteConfirm(false);
        setSelectedExamId('');
        getExams();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to delete exam.');
    } finally {
      setProcessLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading title="Manage Exams" />
        <CustomButton onClick={openAddForm}>Add Exam</CustomButton>
      </div>

      {isLoading ? (
        <Loading />
      ) : exams.length === 0 ? (
        <NoData message="No exams found. Add a new one to get started." />
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Exam Name
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Date
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Type
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Branch
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Subject
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {exams.map((exam) => (
                <tr key={exam._id} className="border-b">
                  <td className="py-3 px-4">{exam.name}</td>
                  <td className="py-3 px-4">
                    {new Date(exam.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{exam.examType}</td>
                  <td className="py-3 px-4">{exam.branch?.name || 'N/A'}</td>
                  <td className="py-3 px-4">{exam.subject?.name || 'N/A'}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <CustomButton
                      variant="secondary"
                      onClick={() => openEditForm(exam)}
                    >
                      Edit
                    </CustomButton>
                    <CustomButton
                      variant="danger"
                      onClick={() => openDeleteConfirm(exam._id)}
                    >
                      Delete
                    </CustomButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAddForm && (
        <Modal
          title={isEditing ? 'Edit Exam' : 'Add New Exam'}
          isOpen={showAddForm}
          onClose={() => setShowAddForm(false)}
        >
          <form onSubmit={addExamHandler} className="space-y-4">
            <div>
              <label>Exam Name</label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label>Exam Date</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label>Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="mid">Mid Term</option>
                <option value="end">End Term</option>
              </select>
            </div>
            <div>
              <label>Branch</label>
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
              <label>Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <CustomButton
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                loading={processLoading}
                disabled={processLoading}
              >
                {isEditing ? 'Update Exam' : 'Add Exam'}
              </CustomButton>
            </div>
          </form>
        </Modal>
      )}

      <DeleteConfirm
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this exam? This action cannot be undone."
      />
    </div>
  );
};

export default Exam;
