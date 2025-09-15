import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { branchService } from '../../../services/branchService';
import { timetableService } from '../../../services/timetableService';
import TimetableForm from './TimetableForm';
import TimetableList from './TimetableList';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);

  const getBranches = useCallback(async () => {
    try {
      const { data } = await branchService.search();
      setBranches(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch branches');
    }
  }, []);

  const getTimetables = useCallback(async () => {
    if (!selectedBranch) {
      setTimetables([]);
      return;
    }
    setIsLoading(true);
    try {
      const { data } =
        await timetableService.getTimetableByBranch(selectedBranch);
      setTimetables(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch timetables');
      setTimetables([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch]);

  useEffect(() => {
    getBranches();
  }, [getBranches]);

  useEffect(() => {
    getTimetables();
  }, [getTimetables]);

  const handleAddTimetable = async (formData) => {
    formData.append('branch', selectedBranch);
    setIsProcessing(true);
    toast.loading('Uploading Timetable...');
    try {
      await timetableService.addTimetable(formData);
      toast.dismiss();
      toast.success('Timetable added successfully!');
      setIsModalOpen(false);
      getTimetables();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to add timetable.');
    } finally {
      setIsProcessing(false);
    }
  };

  const openDeleteConfirm = (timetable) => {
    setSelectedTimetable(timetable);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTimetable) return;
    setIsProcessing(true);
    toast.loading('Deleting timetable...');
    try {
      await timetableService.deleteTimetable(selectedTimetable._id);
      toast.dismiss();
      toast.success('Timetable deleted successfully!');
      setIsDeleteConfirmOpen(false);
      setSelectedTimetable(null);
      getTimetables();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || 'Failed to delete timetable.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading title="Timetables" />
        <CustomButton
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedBranch}
        >
          Add Timetable
        </CustomButton>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium">Select Branch</label>
        <select
          value={selectedBranch}
          onChange={(e) => setSelectedBranch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md"
        >
          <option value="">Select a Branch to View Timetable</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : !selectedBranch ? null : timetables.length === 0 ? (
        <NoData />
      ) : (
        <TimetableList timetables={timetables} onDelete={openDeleteConfirm} />
      )}

      {isModalOpen && (
        <Modal
          title="Add New Timetable"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <TimetableForm
            onAdd={handleAddTimetable}
            onCancel={() => setIsModalOpen(false)}
            isProcessing={isProcessing}
          />
        </Modal>
      )}

      {isDeleteConfirmOpen && (
        <DeleteConfirm
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default Timetable;
