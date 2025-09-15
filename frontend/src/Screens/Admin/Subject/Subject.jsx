import React, { useEffect, useState, useCallback } from 'react';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { subjectService } from '../../../services/subjectService';
import { branchService } from '../../../services/branchService';
import { useCrud } from '../../../hooks/useCrud';
import SubjectForm from './SubjectForm';
import SubjectTable from './SubjectTable';
import toast from 'react-hot-toast';

const Subject = () => {
  const [branches, setBranches] = useState([]);

  const {
    data: subjects,
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
  } = useCrud(subjectService);

  const getBranches = useCallback(async () => {
    try {
      const { data } = await branchService.search();
      setBranches(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch branches');
    }
  }, []);

  useEffect(() => {
    fetchData();
    getBranches();
  }, [fetchData, getBranches]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Subjects" />
        <CustomButton onClick={() => openModal()}>Add Subject</CustomButton>
      </div>

      {isLoading ? (
        <Loading />
      ) : subjects.length === 0 ? (
        <NoData />
      ) : (
        <SubjectTable
          subjects={subjects}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
        />
      )}

      {isModalOpen && (
        <Modal
          title={isEditing ? 'Edit Subject' : 'Add New Subject'}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <SubjectForm
            isEditing={isEditing}
            selectedItem={selectedItem}
            onUpsert={handleUpsert}
            onCancel={closeModal}
            isProcessing={isProcessing}
            branches={branches}
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

export default Subject;
