import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import CustomButton from '../components/ui/CustomButton';
import { authService } from '../services/authService';
import { loginSuccess } from '../redux/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('student');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!email || !password || !userType) {
      return toast.error('Please fill all the fields');
    }
    setLoading(true);
    toast.loading('Logging In');

    try {
      const { data } = await authService.login({ email, password, userType });

      toast.dismiss();
      if (data.success) {
        dispatch(loginSuccess({ userToken: data.data.accessToken, userType }));
        toast.success('Login Successful!');
        navigate(`/${userType}`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error?.response?.data?.message || 'Login Failed!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        onSubmit={loginHandler}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

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
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="userType"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Login as
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
          Login
        </CustomButton>

        <div className="mt-4 text-center">
          <Link
            to="/forget-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;
