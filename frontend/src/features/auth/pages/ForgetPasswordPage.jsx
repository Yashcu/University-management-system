import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { authService } from '../services/authService';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and select your role to receive a password reset
            link.
          </CardDescription>
        </CardHeader>
        <form onSubmit={forgetPasswordHandler}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userType">I am a</Label>
              <Select value={userType} onValueChange={setUserType}>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              className="w-full"
              type="submit"
              loading={loading}
              disabled={loading}
            >
              Send Reset Link
            </Button>
            <div className="mt-4 text-center text-sm">
              <Link to="/" className="underline">
                Back to Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default ForgetPassword;
