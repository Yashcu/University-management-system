import React from 'react';
import CustomButton from '../../../components/ui/CustomButton';

const BranchTable = ({ branches, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Branch Name
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Branch ID
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {branches.map((branch) => (
            <tr key={branch._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{branch.name}</td>
              <td className="py-3 px-4">{branch.branchId}</td>
              <td className="py-3 px-4 flex justify-center gap-2">
                <CustomButton
                  variant="secondary"
                  onClick={() => onEdit(branch)}
                >
                  Edit
                </CustomButton>
                <CustomButton variant="danger" onClick={() => onDelete(branch)}>
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

export default BranchTable;
