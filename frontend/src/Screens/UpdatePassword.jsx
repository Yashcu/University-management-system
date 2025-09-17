import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import CustomButton from '../components/ui/CustomButton';
import { authService } from '../services/authService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Update Password</CardTitle>
          <CardDescription>Enter your new password below.</CardDescription>
        </CardHeader>
        <form onSubmit={updatePasswordHandler}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </CardContent>
          <CardFooter>
            <CustomButton className="w-full" type="submit" loading={loading} disabled={loading}>
              Update Password
            </CustomButton>
          </CardFooter>
        </form>
      </Card>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default UpdatePassword;
