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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Subject = () => {
  const [branches, setBranches] = useState([]);
  const [searchParams, setSearchParams] = useState({ name: '', branch: '' });

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
    fetchData(searchParams);
  }, [fetchData, searchParams]);

  useEffect(() => {
    getBranches();
  }, [getBranches]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchParams);
  };

  const handleBranchChange = (value) => {
    setSearchParams({ ...searchParams, branch: value === 'all' ? '' : value });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Subjects" />
        <CustomButton onClick={() => openModal()}>Add Subject</CustomButton>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-6 p-4 bg-white rounded-md shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        <Input
          type="text"
          placeholder="Search by name..."
          value={searchParams.name}
          onChange={(e) =>
            setSearchParams({ ...searchParams, name: e.target.value })
          }
        />
        <Select onValueChange={handleBranchChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Branches" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map((b) => (
              <SelectItem key={b._id} value={b._id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CustomButton type="submit">Search</CustomButton>
      </form>

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
