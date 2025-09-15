import React from 'react';
import CustomButton from '../../../components/ui/CustomButton';

const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Subject Name
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Code
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Branch
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Semester
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {subjects.map((subject) => (
            <tr key={subject._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{subject.name}</td>
              <td className="py-3 px-4">{subject.subjectCode}</td>
              <td className="py-3 px-4">{subject.branch?.name || 'N/A'}</td>
              <td className="py-3 px-4">{subject.semester}</td>
              <td className="py-3 px-4 flex justify-center gap-2">
                <CustomButton
                  variant="secondary"
                  onClick={() => onEdit(subject)}
                >
                  Edit
                </CustomButton>
                <CustomButton
                  variant="danger"
                  onClick={() => onDelete(subject)}
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

export default SubjectTable;
