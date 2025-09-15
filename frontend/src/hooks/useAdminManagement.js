import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminService } from '../services/adminService';

export const useAdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    gender: '',
    dob: '',
    designation: '',
    joiningDate: '',
    salary: '',
    status: 'active',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
    bloodGroup: '',
  });

  const getAdminsHandler = useCallback(async () => {
    try {
      setDataLoading(true);
      const response = await adminService.search();
      if (response.data.success) {
        setAdmins(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setAdmins([]);
        return;
      }
      console.error(error);
      toast.error(error.response?.data?.message || 'Error fetching admins');
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    getAdminsHandler();
  }, [getAdminsHandler]);

  const addAdminHandler = async () => {
    try {
      toast.loading(isEditing ? 'Updating Admin' : 'Adding Admin');

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'emergencyContact') {
          for (const subKey in formData.emergencyContact) {
            formDataToSend.append(
              `emergencyContact[${subKey}]`,
              formData.emergencyContact[subKey]
            );
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      if (file) {
        formDataToSend.append('file', file);
      }

      let response;
      if (isEditing) {
        response = await adminService.update(selectedAdminId, formDataToSend);
      } else {
        response = await adminService.add(formDataToSend);
      }

      toast.dismiss();
      if (response.data.success) {
        if (!isEditing) {
          toast.success(
            `Admin created successfully! Default password: admin123`
          );
        } else {
          toast.success(response.data.message);
        }
        resetForm();
        getAdminsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  const deleteAdminHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedAdminId(id);
  };

  const editAdminHandler = (admin) => {
    setFormData({
      firstName: admin.firstName || '',
      lastName: admin.lastName || '',
      email: admin.email || '',
      phone: admin.phone || '',
      profile: admin.profile || '',
      address: admin.address || '',
      city: admin.city || '',
      state: admin.state || '',
      pincode: admin.pincode || '',
      country: admin.country || '',
      gender: admin.gender || '',
      dob: admin.dob?.split('T')[0] || '',
      designation: admin.designation || '',
      joiningDate: admin.joiningDate?.split('T')[0] || '',
      salary: admin.salary || '',
      status: admin.status || 'active',
      emergencyContact: {
        name: admin.emergencyContact?.name || '',
        relationship: admin.emergencyContact?.relationship || '',
        phone: admin.emergencyContact?.phone || '',
      },
      bloodGroup: admin.bloodGroup || '',
    });
    setSelectedAdminId(admin._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading('Deleting Admin');
      const response = await adminService.delete(selectedAdminId);
      toast.dismiss();
      if (response.data.success) {
        toast.success('Admin has been deleted successfully');
        setIsDeleteConfirmOpen(false);
        getAdminsHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error');
    }
  };

  const resetForm = () => {
    setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        profile: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        gender: '',
        dob: '',
        designation: '',
        joiningDate: '',
        salary: '',
        status: 'active',
        emergencyContact: {
            name: '',
            relationship: '',
            phone: '',
        },
        bloodGroup: '',
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedAdminId(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  return {
    admins,
    dataLoading,
    showAddForm,
    isDeleteConfirmOpen,
    isEditing,
    formData,
    file,
    setFile,
    setShowAddForm,
    addAdminHandler,
    deleteAdminHandler,
    editAdminHandler,
    confirmDelete,
    resetForm,
    handleInputChange,
    handleEmergencyContactChange,
    setIsDeleteConfirmOpen,
  };
};
