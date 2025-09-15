import React, { useEffect, useState, useCallback } from 'react';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { facultyService } from '../../../services/facultyService';
import { branchService } from '../../../services/branchService';
import { useCrud } from '../../../hooks/useCrud';
import FacultyForm from './FacultyForm';
import FacultyTable from './FacultyTable';
import toast from 'react-hot-toast';

const Faculty = () => {
  const [branches, setBranches] = useState([]);
  const [searchParams, setSearchParams] = useState({ name: '', branch: '' });

  const {
    data: faculties,
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
  } = useCrud(facultyService);

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Faculty" />
        <CustomButton onClick={() => openModal()}>Add Faculty</CustomButton>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-6 p-4 bg-white rounded-md shadow-md grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
      >
        <input
          type="text"
          placeholder="Search by name..."
          value={searchParams.name}
          onChange={(e) =>
            setSearchParams({ ...searchParams, name: e.target.value })
          }
          className="px-4 py-2 border rounded-md"
        />
        <select
          value={searchParams.branch}
          onChange={(e) =>
            setSearchParams({ ...searchParams, branch: e.target.value })
          }
          className="px-4 py-2 border rounded-md"
        >
          <option value="">All Branches</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <CustomButton type="submit">Search</CustomButton>
      </form>

      {isLoading ? (
        <Loading />
      ) : faculties.length === 0 ? (
        <NoData />
      ) : (
        <FacultyTable
          faculties={faculties}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
        />
      )}

      {isModalOpen && (
        <Modal
          title={isEditing ? 'Edit Faculty' : 'Add New Faculty'}
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <FacultyForm
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

export default Faculty;
