import React from 'react';
import { IoMdAdd, IoMdClose } from 'react-icons/io';
import Heading from '../../../components/ui/Heading';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import CustomButton from '../../../components/ui/CustomButton';
import Loading from '../../../components/ui/Loading';
import AdminForm from './AdminForm';
import AdminTable from './AdminTable';
import { useAdminManagement } from '../../../hooks/useAdminManagement';

const Admin = () => {
  const {
    admins,
    dataLoading,
    showAddForm,
    isDeleteConfirmOpen,
    isEditing,
    formData,
    setFile,
    setShowAddForm,
    addAdminHandler,
    deleteAdminHandler,
    editAdminHandler,
    confirmDelete,
    resetForm,
    handleInputChange,
    handleEmergencyContactChange,
    setIsDeleteConfirmOpen,
  } = useAdminManagement();

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative">
      <div className="flex justify-between items-center w-full">
        <Heading title="Admin Management" />
        <CustomButton
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          <IoMdAdd className="text-2xl" />
        </CustomButton>
      </div>

      {showAddForm && (
        <AdminForm
          isEditing={isEditing}
          formData={formData}
          setFile={setFile}
          addAdminHandler={addAdminHandler}
          resetForm={resetForm}
          handleInputChange={handleInputChange}
          handleEmergencyContactChange={handleEmergencyContactChange}
        />
      )}

      {dataLoading && <Loading />}

      {!dataLoading && !showAddForm && (
        <AdminTable
          admins={admins}
          editAdminHandler={editAdminHandler}
          deleteAdminHandler={deleteAdminHandler}
        />
      )}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this admin?"
      />
    </div>
  );
};

export default Admin;
