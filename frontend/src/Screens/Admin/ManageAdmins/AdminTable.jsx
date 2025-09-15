import React from 'react';
import { MdEdit, MdOutlineDelete } from 'react-icons/md';
import CustomButton from '../../../components/ui/CustomButton';

const AdminTable = ({ admins, editAdminHandler, deleteAdminHandler }) => {
  return (
    <div className="mt-8 w-full">
      <table className="text-sm min-w-full bg-white">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-4 px-6 text-left font-semibold">Name</th>
            <th className="py-4 px-6 text-left font-semibold">Email</th>
            <th className="py-4 px-6 text-left font-semibold">Phone</th>
            <th className="py-4 px-6 text-left font-semibold">
              Employee ID
            </th>
            <th className="py-4 px-6 text-left font-semibold">
              Designation
            </th>
            <th className="py-4 px-6 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins && admins.length > 0 ? (
            admins.map((item, index) => (
              <tr key={index} className="border-b hover:bg-blue-50">
                <td className="py-4 px-6">{`${item.firstName} ${item.lastName}`}</td>
                <td className="py-4 px-6">{item.email}</td>
                <td className="py-4 px-6">{item.phone}</td>
                <td className="py-4 px-6">{item.employeeId}</td>
                <td className="py-4 px-6">{item.designation}</td>
                <td className="py-4 px-6 text-center flex justify-center gap-4">
                  <CustomButton
                    variant="secondary"
                    onClick={() => editAdminHandler(item)}
                  >
                    <MdEdit />
                  </CustomButton>
                  <CustomButton
                    variant="danger"
                    onClick={() => deleteAdminHandler(item._id)}
                  >
                    <MdOutlineDelete />
                  </CustomButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-base pt-10">
                No Admins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
