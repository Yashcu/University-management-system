import React, { useEffect, useState, useCallback } from 'react';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { materialService } from '../../../services/materialService';
import { subjectService } from '../../../services/subjectService';
import { useCrud } from '../../../hooks/useCrud';
import MaterialForm from './MaterialForm';
import MaterialTable from './MaterialTable';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Material = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchParams, setSearchParams] = useState({ subject: '' });

  const {
    data: materials,
    isLoading,
    isProcessing,
    isModalOpen,
    isDeleteConfirmOpen,
    selectedItem,
    fetchData,
    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleUpsert,
    handleDelete,
  } = useCrud(materialService);

  const getSubjects = useCallback(async () => {
    try {
      // Assuming you have a method to get subjects assigned to the logged-in faculty
      const { data } = await subjectService.search(); // This might need adjustment based on your API
      setSubjects(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    }
  }, []);

  useEffect(() => {
    fetchData(searchParams);
  }, [fetchData, searchParams]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  const handleSubjectChange = (value) => {
    const subjectValue = value === 'all' ? '' : value;
    setSearchParams({ subject: subjectValue });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Study Materials" />
        <CustomButton onClick={() => openModal()}>Upload Material</CustomButton>
      </div>

      <div className="mb-6 max-w-xs">
        <Select onValueChange={handleSubjectChange} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Filter by Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s) => (
              <SelectItem key={s._id} value={s._id}>
                {s.name} ({s.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Loading />
      ) : materials.length === 0 ? (
        <NoData />
      ) : (
        <MaterialTable materials={materials} onDelete={openDeleteConfirm} />
      )}

      {isModalOpen && (
        <Modal
          title="Upload New Material"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <MaterialForm
            onUpsert={handleUpsert}
            onCancel={closeModal}
            isProcessing={isProcessing}
            subjects={subjects}
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

export default Material;
