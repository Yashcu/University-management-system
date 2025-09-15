import React from 'react';
import CustomButton from '../../../components/ui/CustomButton';

const StudentTable = ({ students, onEdit, onDelete }) => {
  const mediaUrl = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost:4000';

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white shadow-md rounded-lg">
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
            <th className="py-3 px-4 uppercase font-semibold text-sm text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {students.map((student) => (
            <tr key={student._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <img
                  src={student.profile ? `${mediaUrl}/media/${student.profile}` : '/assets/avatar.png'}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="py-3 px-4">{student.enrollmentNo}</td>
              <td className="py-3 px-4">{`${student.firstName} ${student.lastName}`}</td>
              <td className="py-3 px-4">{student.email}</td>
              <td className="py-3 px-4">{student.branchId?.name || 'N/A'}</td>
              <td className="py-3 px-4 flex justify-center gap-2">
                <CustomButton
                  variant="secondary"
                  onClick={() => onEdit(student)}
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="danger"
                  onClick={() => onDelete(student)}
                >
                  Delete
                </CustomButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
