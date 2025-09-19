import React, { useEffect } from 'react';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { branchService } from '../../../services/api';
import { useCrud } from '../../../hooks/useCrud';
import BranchForm from './BranchForm';
import BranchTable from './BranchTable';

const Branch = () => {
  const {
    data: branches,
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
  } = useCrud(branchService);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Branches" />
        <Button onClick={() => openModal()}>Add Branch</Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : branches.length === 0 ? (
        <NoData />
      ) : (
        <BranchTable
          branches={branches}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
        />
      )}

      {isModalOpen && (
        <Modal
          title={isEditing ? 'Edit Branch' : 'Add New Branch'}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <BranchForm
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

export default Branch;
