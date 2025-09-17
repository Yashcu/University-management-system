import React from 'react';
import Heading from '../components/ui/Heading';
import Loading from '../components/ui/Loading';
import NoData from '../components/ui/NoData';
import CustomButton from '../components/ui/CustomButton';
import Modal from '../components/ui/Modal';
import DeleteConfirm from '../components/ui/DeleteConfirm';
import { noticeService } from '../services/noticeService';
import { useCrud } from '../hooks/useCrud';
import NoticeForm from './Admin/Notice/NoticeForm';
import NoticeTable from './Admin/Notice/NoticeTable';

const Notice = () => {
  const {
    data: notices,
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
  } = useCrud(noticeService, { fetchOnMount: true });

  // This component is used in multiple places, so we determine the user type.
  // For this refactor, we are focusing on the Admin view.
  const userType = 'admin';

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Notices" />
        {userType === 'admin' && (
          <CustomButton onClick={() => openModal()}>Add Notice</CustomButton>
        )}
      </div>

      {isLoading ? (
        <Loading />
      ) : notices.length === 0 ? (
        <NoData />
      ) : (
        <NoticeTable
          notices={notices}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
        />
      )}

      {isModalOpen && (
        <Modal
          title={isEditing ? 'Edit Notice' : 'Add New Notice'}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <NoticeForm
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
        />
      )}
    </div>
  );
};

export default Notice;
