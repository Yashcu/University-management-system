import React, { useEffect, useState, useCallback } from 'react';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { materialService } from '../../../services/api';
import { subjectService } from '../../../services/api';
import { branchService } from '../../../services/api';
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

const semesters = [1,2,3,4,5,6,7,8];
const materialTypes = [
  { value: 'notes', label: 'Notes' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'syllabus', label: 'Syllabus' },
  { value: 'other', label: 'Other' }
];

const Material = () => {
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
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
      const { data } = await subjectService.search();
      setSubjects(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    }
  }, []);

  const getBranches = useCallback(async () => {
    try {
      const { data } = await branchService.search();
      setBranches(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch branches');
    }
  }, []);

  useEffect(() => {
    if (searchParams.subject) {
      fetchData(searchParams);
    }
  }, [fetchData, searchParams]);

  useEffect(() => {
    getSubjects();
    getBranches();
  }, [getSubjects, getBranches]);

  const handleSubjectChange = (value) => {
    setSearchParams({ subject: value === 'all' ? '' : value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Study Materials" />
        <Button onClick={() => openModal()}>Upload Material</Button>
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
            branches={branches}
            semesters={semesters}
            materialTypes={materialTypes}
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
