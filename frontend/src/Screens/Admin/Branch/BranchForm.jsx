import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomButton from '../../../components/ui/CustomButton';

// Define the validation schema using Zod
const branchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
});

const BranchForm = ({
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
    resolver: zodResolver(branchSchema),
  });

  useEffect(() => {
    if (isEditing && selectedItem) {
      setValue('name', selectedItem.name || '');
      setValue('branchId', selectedItem.branchId || '');
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
          Branch Name
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
        <label className="block text-sm font-medium text-gray-700">
          Branch ID
        </label>
        <input
          {...register('branchId')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        {errors.branchId && (
          <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>
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
          {isEditing ? 'Update Branch' : 'Add Branch'}
        </CustomButton>
      </div>
    </form>
  );
};

export default BranchForm;
