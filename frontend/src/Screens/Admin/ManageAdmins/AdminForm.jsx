import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomButton from '../../../components/ui/CustomButton';

const adminSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

const AdminForm = ({
  isEditing,
  selectedItem,
  onUpsert,
  onCancel,
  isProcessing,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(adminSchema),
  });

  useEffect(() => {
    if (isEditing && selectedItem) {
      setValue('name', selectedItem.name || '');
      setValue('email', selectedItem.email || '');
      setValue('phone', selectedItem.phone || '');
    } else {
      reset();
    }
  }, [isEditing, selectedItem, setValue, reset]);

  const onSubmit = (data) => {
    onUpsert(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          {...register('name')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          {...register('phone')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
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
          {isEditing ? 'Update Admin' : 'Add Admin'}
        </CustomButton>
      </div>
    </form>
  );
};

export default AdminForm;
