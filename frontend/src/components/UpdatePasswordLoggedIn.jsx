import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axiosWrapper from '../utils/AxiosWrapper';
import { IoMdClose } from 'react-icons/io';
import CustomButton from './ui/CustomButton';
import Modal from './ui/Modal';

const UpdatePasswordLoggedIn = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userToken = localStorage.getItem('userToken');
  const userType = localStorage.getItem('userType');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    toast.loading('Updating Password...');
    try {
      const response = await axiosWrapper.post(
        `/${userType.toLowerCase()}/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Update Password" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handlePasswordUpdate}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <CustomButton type="button" variant="secondary" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" loading={isLoading} disabled={isLoading}>
            Update Password
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
};

export default UpdatePasswordLoggedIn;
