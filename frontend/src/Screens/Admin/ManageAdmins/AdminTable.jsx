import React from 'react';
import CustomButton from '../../../components/ui/CustomButton';

const AdminTable = ({ admins, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Name
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Email
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-left">
              Phone
            </th>
            <th className="py-3 px-4 uppercase font-semibold text-sm text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {admins.map((admin) => (
            <tr key={admin._id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{admin.name}</td>
              <td className="py-3 px-4">{admin.email}</td>
              <td className="py-3 px-4">{admin.phone}</td>
              <td className="py-3 px-4 flex justify-center gap-2">
                <CustomButton variant="secondary" onClick={() => onEdit(admin)}>
                  Edit
                </CustomButton>
                <CustomButton variant="danger" onClick={() => onDelete(admin)}>
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

export default AdminTable;
