import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomButton from '../../../components/ui/CustomButton';

// Define a schema for file validation
const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const materialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  file: z
    .any()
    .refine((files) => files?.length == 1, 'File is required.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png, .webp, .pdf, and .doc files are accepted.'
    ),
});

const MaterialForm = ({ onAdd, onCancel, isProcessing }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(materialSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file[0]);
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          {...register('title')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          File (PDF, DOC, Image)
        </label>
        <input
          {...register('file')}
          type="file"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.file && (
          <p className="text-red-500 text-xs mt-1">{errors.file.message}</p>
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
          Upload
        </CustomButton>
      </div>
    </form>
  );
};

export default MaterialForm;
