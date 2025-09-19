import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomButton from '../../../components/ui/CustomButton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const branchSchema = z.object({
  name: z.string().min(1, 'Branch name is required'),
  code: z.string().min(1, 'Branch code is required'),
});

const BranchForm = ({
  isEditing,
  selectedItem,
  onUpsert,
  onCancel,
  isProcessing,
}) => {
  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: selectedItem?.name || '',
      code: selectedItem?.code || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: selectedItem?.name || '',
      code: selectedItem?.code || '',
    });
  }, [isEditing, selectedItem, form]);

  const onSubmit = (data) => {
    onUpsert(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Computer Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., CS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4 border-t mt-6">
          <CustomButton type="button" variant="outline" onClick={onCancel}>
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
    </Form>
  );
};

export default BranchForm;
