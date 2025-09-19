import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // FIX: Added useSelector and useDispatch
import toast from 'react-hot-toast';
import Heading from '../ui/Heading';
import Loading from '../ui/Loading';
import CustomButton from '../ui/CustomButton';
import UpdatePasswordLoggedIn from '../UpdatePasswordLoggedIn';
import { profileService } from '../../services/profileService';
import { fetchUserProfile } from '../../redux/authSlice';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user: profile, loading: isLoading } = useSelector(
    (state) => state.auth
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
      setPreview(profile.profileUrl || '');
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

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

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });
    if (profilePic) {
      formPayload.append('file', profilePic);
    }

    try {
      await profileService.updateMyProfile(profile._id, formPayload);
      toast.dismiss();
      toast.success('Profile updated successfully!');
      dispatch(fetchUserProfile());
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderExtraFields = () => {
    if (!profile) return null;

    if (profile.enrollmentNo) {
      return (
        <div>
          <label>Enrollment No</label>
          <input
            type="text"
            value={profile.enrollmentNo}
            disabled
            className="w-full px-4 py-2 border rounded-md bg-gray-100"
          />
        </div>
      );
    }
    if (profile.branchId) {
      return (
        <div>
          <label>Branch</label>
          <input
            type="text"
            value={profile.branchId?.name || 'N/A'}
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
              {/* Image and Upload Button */}
              <div className="flex items-center space-x-4">
                <img
                  src={preview || '/assets/avatar.png'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <label
                    htmlFor="profile-pic-upload"
                    className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
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

              {/* Form Fields using the single formData state */}
              <div>
                <label>First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label>Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  id="phone"
                  type="text"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>

              {renderExtraFields()}

              <div className="flex justify-between items-center pt-4 border-t">
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
