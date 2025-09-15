import React, { useEffect } from 'react';
import Heading from '../../../components/ui/Heading';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import CustomButton from '../../../components/ui/CustomButton';
import Loading from '../../../components/ui/Loading';
import Modal from '../../../components/ui/Modal';
import AdminForm from './AdminForm';
import AdminTable from './AdminTable';
import { useCrud } from '../../../hooks/useCrud.jsx';
import { adminService } from '../../../services/adminService';

const Admin = () => {
  const {
    data: admins,
    isLoading,
    isProcessing,
    isModalOpen,
    isDeleteConfirmOpen,
    isEditing,
    selectedItem,
    fetchData,
    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleUpsert,
    handleDelete,
  } = useCrud(adminService);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="w-full mx-auto mt-10 flex justify-center items-start flex-col mb-10 relative">
      <div className="flex justify-between items-center w-full mb-6">
        <Heading title="Admin Management" />
        <CustomButton onClick={() => openModal()}>Add Admin</CustomButton>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <AdminTable
          admins={admins}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
        />
      )}

      {isModalOpen && (
        <Modal
          title={isEditing ? 'Edit Admin' : 'Add New Admin'}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <AdminForm
            isEditing={isEditing}
            selectedItem={selectedItem}
            onUpsert={handleUpsert}
            onCancel={closeModal}
            isProcessing={isProcessing}
          />
        </Modal>
      )}

      {isDeleteConfirmOpen && (
        <DeleteConfirm
          isOpen={isDeleteConfirmOpen}
          onClose={closeDeleteConfirm}
          onConfirm={handleDelete}
          message="Are you sure you want to delete this admin?"
        />
      )}
    </div>
  );
};

export default Admin;
