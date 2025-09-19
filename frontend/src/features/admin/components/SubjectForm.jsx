import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  branchId: z.string().min(1, 'Branch must be selected'),
  semester: z.string().min(1, 'Semester is required'),
});

const SubjectForm = ({
  isEditing,
  selectedItem,
  onUpsert,
  onCancel,
  isProcessing,
  branches,
}) => {
  const form = useForm({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: selectedItem?.name || '',
      code: selectedItem?.code || '',
      branchId: selectedItem?.branchId?._id || '',
      semester: selectedItem?.semester?.toString() || '',
    },
  });

  useEffect(() => {
    form.reset({
      name: selectedItem?.name || '',
      code: selectedItem?.code || '',
      branchId: selectedItem?.branchId?._id || '',
      semester: selectedItem?.semester?.toString() || '',
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
              <FormLabel>Subject Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Data Structures" {...field} />
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
              <FormLabel>Subject Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g., CS201" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branchId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b._id} value={b._id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isProcessing}
            disabled={isProcessing}
          >
            {isEditing ? 'Update Subject' : 'Add Subject'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubjectForm;
