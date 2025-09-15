import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import Heading from '../../../components/ui/Heading';
import Loading from '../../../components/ui/Loading';
import NoData from '../../../components/ui/NoData';
import CustomButton from '../../../components/ui/CustomButton';
import Modal from '../../../components/ui/Modal';
import DeleteConfirm from '../../../components/ui/DeleteConfirm';
import { subjectService } from '../../../services/subjectService';
import { materialService } from '../../../services/materialService';
import MaterialForm from './MaterialForm';
import MaterialList from './MaterialList';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const getSubjects = useCallback(async () => {
    try {
      const { data } = await subjectService.search();
      setSubjects(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch subjects');
    }
  }, []);

  const getMaterials = useCallback(async () => {
    if (!selectedSubject) {
      setMaterials([]);
      return;
    }
    setIsLoading(true);
    try {
      const { data } =
        await materialService.getMaterialsBySubject(selectedSubject);
      setMaterials(data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch materials');
      setMaterials([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubject]);

  useEffect(() => {
    getSubjects();
  }, [getSubjects]);

  useEffect(() => {
    getMaterials();
  }, [getMaterials]);

  const handleAddMaterial = async (formData) => {
    formData.append('subject', selectedSubject);
    setIsProcessing(true);
    toast.loading('Uploading Material...');
    try {
      await materialService.addMaterial(formData);
      toast.dismiss();
      toast.success('Material added successfully!');
      setIsModalOpen(false);
      getMaterials();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to add material.');
    } finally {
      setIsProcessing(false);
    }
  };

  const openDeleteConfirm = (material) => {
    setSelectedMaterial(material);
    setIsDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMaterial) return;
    setIsProcessing(true);
    toast.loading('Deleting material...');
    try {
      await materialService.deleteMaterial(selectedMaterial._id);
      toast.dismiss();
      toast.success('Material deleted successfully!');
      setIsDeleteConfirmOpen(false);
      setSelectedMaterial(null);
      getMaterials();
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message || 'Failed to delete material.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Heading title="Study Material" />
        <CustomButton
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedSubject}
        >
          Add Material
        </CustomButton>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium">Select Subject</label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-md"
        >
          <option value="">Select a Subject to View Materials</option>
          {subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : !selectedSubject ? null : materials.length === 0 ? (
        <NoData />
      ) : (
        <MaterialList materials={materials} onDelete={openDeleteConfirm} />
      )}

      {isModalOpen && (
        <Modal
          title="Add New Material"
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <MaterialForm
            onAdd={handleAddMaterial}
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

export default Material;
