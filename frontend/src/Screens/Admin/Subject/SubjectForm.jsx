import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomButton from '../../../components/ui/CustomButton';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  subjectCode: z.string().min(1, 'Subject code is required'),
  branch: z.string().min(1, 'Branch must be selected'),
  semester: z.coerce
    .number()
    .min(1, 'Semester is required')
    .max(8, 'Semester must be between 1 and 8'),
});

const SubjectForm = ({
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
  } = useForm({
    resolver: zodResolver(subjectSchema),
  });

  useEffect(() => {
    if (isEditing && selectedItem) {
      setValue('name', selectedItem.name || '');
      setValue('subjectCode', selectedItem.subjectCode || '');
      setValue('branch', selectedItem.branch?._id || '');
      setValue('semester', selectedItem.semester || '');
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
          Subject Name
        </label>
        <input
          {...register('name')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Subject Code
        </label>
        <input
          {...register('subjectCode')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.subjectCode && (
          <p className="text-red-500 text-xs mt-1">
            {errors.subjectCode.message}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Branch
        </label>
        <select
          {...register('branch')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
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
        <label className="block text-sm font-medium text-gray-700">
          Semester
        </label>
        <input
          {...register('semester')}
          type="number"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.semester && (
          <p className="text-red-500 text-xs mt-1">{errors.semester.message}</p>
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
          {isEditing ? 'Update Subject' : 'Add Subject'}
        </CustomButton>
      </div>
    </form>
  );
};

export default SubjectForm;
