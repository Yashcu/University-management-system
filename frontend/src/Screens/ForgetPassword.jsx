import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import CustomButton from '../components/ui/CustomButton';
import { authService } from '../services/authService';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);

  const forgetPasswordHandler = async (e) => {
    e.preventDefault();
    if (!email || !userType) {
      return toast.error('Please fill all fields');
    }
    setLoading(true);
    toast.loading('Sending Reset Link...');

    try {
      const { data } = await authService.forgetPassword({ email, userType });
      toast.dismiss();
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || 'Failed to send reset link.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={forgetPasswordHandler}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email and select your role to receive a password reset
          link.
        </p>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="userType"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            I am a
          </label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <CustomButton
          type="submit"
          className="w-full"
          loading={loading}
          disabled={loading}
        >
          Send Reset Link
        </CustomButton>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default ForgetPassword;
