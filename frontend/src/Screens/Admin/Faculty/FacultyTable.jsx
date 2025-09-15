import React from 'react';
import CustomButton from '../../../components/ui/CustomButton';

const FacultyTable = ({ faculties, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Profile
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
          {faculties.map((faculty) => (
            <tr key={faculty._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">
                <img
                  src={faculty.profilePic.url}
                  alt={faculty.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              <td className="py-3 px-4">{faculty.name}</td>
              <td className="py-3 px-4">{faculty.email}</td>
              <td className="py-3 px-4">{faculty.branch?.name || 'N/A'}</td>
              <td className="py-3 px-4 flex justify-center gap-2">
                <CustomButton
                  variant="secondary"
                  onClick={() => onEdit(faculty)}
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="danger"
                  onClick={() => onDelete(faculty)}
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

export default FacultyTable;
