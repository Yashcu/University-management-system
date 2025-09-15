import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomButton from '../../../components/ui/CustomButton';

const facultySchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  branch: z.string().min(1, 'Branch must be selected'),
  profilePic: z.any().optional(),
});

const FacultyForm = ({
  isEditing,
  selectedItem,
  onUpsert,
  onCancel,
  isProcessing,
  branches,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(facultySchema),
  });

  useEffect(() => {
    if (isEditing && selectedItem) {
      setValue('name', selectedItem.name || '');
      setValue('email', selectedItem.email || '');
      setValue('phone', selectedItem.phone || '');
      setValue('branch', selectedItem.branch?._id || '');
    } else {
      reset();
    }
  }, [isEditing, selectedItem, setValue, reset]);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'profilePic') {
        if (data.profilePic && data.profilePic.length > 0) {
          formData.append(key, data.profilePic[0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });
    onUpsert(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Full Name</label>
        <input
          {...register('name')}
          className="w-full px-4 py-2 border rounded-md"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label>Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-4 py-2 border rounded-md"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label>Phone</label>
        <input
          {...register('phone')}
          className="w-full px-4 py-2 border rounded-md"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
        )}
      </div>
      <div>
        <label>Branch</label>
        <select
          {...register('branch')}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        {errors.branch && (
          <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>
        )}
      </div>
      <div>
        <label>Profile Picture</label>
        <input
          {...register('profilePic')}
          type="file"
          className="w-full px-4 py-2 border rounded-md"
        />
        {!isEditing && !watch('profilePic') && (
          <p className="text-red-500 text-xs mt-1">
            Profile picture is required for new faculty.
          </p>
        )}
      </div>
      <div className="flex justify-end gap-4 pt-4 border-t mt-6">
        <CustomButton type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </CustomButton>
        <CustomButton
          type="submit"
          loading={isProcessing}
          disabled={isProcessing}
        >
          {isEditing ? 'Update Faculty' : 'Add Faculty'}
        </CustomButton>
      </div>
    </form>
  );
};

export default FacultyForm;
