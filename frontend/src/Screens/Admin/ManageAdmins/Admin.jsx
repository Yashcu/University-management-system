import React, { useEffect } from 'react';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { adminService } from '../../../services/adminService';
import { useCrud } from '../../../hooks/useCrud';
import AdminForm from './AdminForm';
import AdminTable from './AdminTable';

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Admins" />
        <CustomButton onClick={() => openModal()}>Add Admin</CustomButton>
      </div>

      {isLoading ? (
        <Loading />
      ) : admins.length === 0 ? (
        <NoData message="No admins found. Add a new one to get started." />
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
          message="Are you sure you want to delete this admin? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default Admin;
