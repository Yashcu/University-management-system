import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useCrud = (service, onFetchSuccess) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = useCallback(
    async (params = {}) => {
      setIsLoading(true);
      try {
        const res = await service.search(params);
        const fetchedData = res.data?.data || [];
        setData(fetchedData);
        if (onFetchSuccess) onFetchSuccess(fetchedData);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch data.');
        setData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [service, onFetchSuccess]
  );

  const openModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setSelectedItem(item);
    } else {
      setIsEditing(false);
      setSelectedItem(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setIsEditing(false);
  };

  const openDeleteConfirm = (item) => {
    setSelectedItem(item);
    setIsDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedItem(null);
  };

  const handleUpsert = async (formData) => {
    setIsProcessing(true);
    const action = isEditing ? 'Updating' : 'Adding';
    toast.loading(`${action} item...`);

    try {
      let res;
      if (isEditing) {
        res = await service.update(selectedItem._id, formData);
      } else {
        res = await service.add(formData);
      }
      toast.dismiss();
      toast.success(res.data.message);
      closeModal();
      fetchData(); // Refresh data
    } catch (error) {
      toast.dismiss();
      toast.error(
        error.response?.data?.message ||
          `Failed to ${action.toLowerCase()} item.`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsProcessing(true);
    toast.loading('Deleting item...');
    try {
      const res = await service.delete(selectedItem._id);
      toast.dismiss();
      toast.success(res.data.message);
      closeDeleteConfirm();
      fetchData(); // Refresh data
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to delete item.');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    data,
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
  };
};
