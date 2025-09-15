import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Heading from '../../components/ui/Heading';
import Loading from '../../components/ui/Loading';
import NoData from '../../components/ui/NoData';
import CustomButton from '../../components/ui/CustomButton';
import { studentService } from '../../services/studentService';
import { branchService } from '../../services/branchService';

const StudentFinder = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    studentId: '',
    name: '',
    branch: '',
  });

  const getBranches = async () => {
    try {
      const { data } = await branchService.getAllBranches();
      setBranches(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch branches');
    }
  };

  useEffect(() => {
    getBranches();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await studentService.searchStudents(searchParams);
      setStudents(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch students.');
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Heading title="Find a Student" />
      <form
        onSubmit={handleSearch}
        className="mt-6 p-4 bg-white rounded-md shadow-md grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Search by ID..."
          value={searchParams.studentId}
          onChange={(e) =>
            setSearchParams({ ...searchParams, studentId: e.target.value })
          }
          className="px-4 py-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchParams.name}
          onChange={(e) =>
            setSearchParams({ ...searchParams, name: e.target.value })
          }
          className="px-4 py-2 border rounded-md"
        />
        <select
          value={searchParams.branch}
          onChange={(e) =>
            setSearchParams({ ...searchParams, branch: e.target.value })
          }
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <CustomButton type="submit">Search</CustomButton>
      </form>

      {isLoading ? (
        <Loading />
      ) : students.length === 0 ? (
        <NoData message="No students found with the current filters." />
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Profile
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Student ID
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Name
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Email
                </th>
                <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
                  Branch
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="py-3 px-4">
                    <img
                      src={student.profilePic.url}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{student.studentId}</td>
                  <td className="py-3 px-4">{student.name}</td>
                  <td className="py-3 px-4">{student.email}</td>
                  <td className="py-3 px-4">{student.branch?.name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentFinder;
