import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CustomButton from '../components/ui/CustomButton';
import { authService } from '../services/authService';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetId, type } = useParams();
  const navigate = useNavigate();

  const updatePasswordHandler = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      return toast.error('Please fill all the fields');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    toast.loading('Updating Password...');
    try {
      const { data } = await authService.updatePassword(resetId, type, {
        newPassword: password,
      });
      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
        navigate('/');
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || 'Failed to update password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={updatePasswordHandler}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Update Password
        </h2>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new password"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm new password"
          />
        </div>

        <CustomButton
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Update Password
        </CustomButton>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default UpdatePassword;
