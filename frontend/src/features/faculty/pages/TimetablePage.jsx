import React, { useEffect, useState, useCallback } from 'react';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import { Button } from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { timetableService } from '../../../services/api';
import { branchService } from '../../../services/api';
import { useCrud } from '../../../hooks/useCrud';
import TimetableForm from './TimetableForm';
import TimetableTable from './TimetableTable';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Timetable = () => {
  const [branches, setBranches] = useState([]);
  const [searchParams, setSearchParams] = useState({ branch: '' });

  const {
    data: timetables,
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
  } = useCrud(timetableService);

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

  const handleBranchChange = (value) => {
    const branchValue = value === 'all' ? '' : value;
    setSearchParams({ branch: branchValue });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Heading title="Manage Timetables" />
        <Button onClick={() => openModal()}>Upload Timetable</Button>
      </div>

      <div className="mb-6 max-w-xs">
        <Select onValueChange={handleBranchChange} defaultValue="all">
          <SelectTrigger>
            <SelectValue placeholder="Filter by Branch" />
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
      </div>

      {isLoading ? (
        <Loading />
      ) : timetables.length === 0 ? (
        <NoData />
      ) : (
        <TimetableTable timetables={timetables} onDelete={openDeleteConfirm} />
      )}

      {isModalOpen && (
        <Modal
          title="Upload New Timetable"
          isOpen={isModalOpen}
          onClose={closeModal}
        >
          <TimetableForm
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

export default Timetable;
