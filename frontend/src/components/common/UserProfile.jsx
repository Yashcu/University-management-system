import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Heading from '../ui/Heading';
import Loading from '../ui/Loading';
import CustomButton from '../ui/CustomButton';
import UpdatePasswordLoggedIn from '../UpdatePasswordLoggedIn';
import { profileService } from '../../services/profileService';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await profileService.getProfile();
      const profileData = data?.data || null;
      setProfile(profileData);
      if (profileData) {
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        setPhone(profileData.phone || '');
        setPreview(profileData.profilePic?.url || '');
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    toast.loading('Updating Profile...');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const res = await profileService.updateProfile(formData);
      toast.dismiss();
      if (res.data?.success) {
        toast.success('Profile updated successfully!');
        getProfile();
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Dynamically render extra fields based on user type
  const renderExtraFields = () => {
    if (!profile) return null;

    if (profile.studentId) {
      // It's a student
      return (
        <div>
          <label>Student ID</label>
          <input
            type="text"
            value={profile.studentId}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>
      );
    }
    // Faculty and Student have a branch
    if (profile.branch) {
      return (
        <div>
          <label>Branch</label>
          <input
            type="text"
            value={profile.branch?.name || 'N/A'}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Heading title="My Profile" />
      {isLoading ? (
        <Loading />
      ) : !profile ? (
        <p>Could not load profile.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div className="md:col-span-2">
            <form
              onSubmit={updateProfileHandler}
              className="bg-white p-6 rounded-lg shadow-md space-y-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={preview || '/assets/avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <label
                    htmlFor="profile-pic-upload"
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Change Photo
                  </label>
                  <input
                    id="profile-pic-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div>
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              {renderExtraFields()}
              <div className="flex justify-between items-center">
                <CustomButton
                  type="submit"
                  loading={isProcessing}
                  disabled={isProcessing}
                >
                  Update Profile
                </CustomButton>
                <CustomButton
                  type="button"
                  variant="secondary"
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change Password
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      )}
      {isPasswordModalOpen && (
        <UpdatePasswordLoggedIn
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
