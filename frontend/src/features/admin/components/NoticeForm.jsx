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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const noticeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['student', 'faculty', 'both'], {
    required_error: 'Target audience is required',
  }),
});

const NoticeForm = ({
  isEditing,
  selectedItem,
  onUpsert,
  onCancel,
  isProcessing,
}) => {
  const form = useForm({
    resolver: zodResolver(noticeSchema),
    defaultValues: {
      title: selectedItem?.title || '',
      description: selectedItem?.description || '',
      type: selectedItem?.type || '',
    },
  });

  useEffect(() => {
    form.reset({
      title: selectedItem?.title || '',
      description: selectedItem?.description || '',
      type: selectedItem?.type || '',
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Holiday Announcement" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FIX: Field name changed to 'description' */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the notice details here."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* FIX: Field name changed to 'type' */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select who this notice is for" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="both">All</SelectItem>
                  <SelectItem value="student">Students Only</SelectItem>
                  <SelectItem value="faculty">Faculty Only</SelectItem>
                </SelectContent>
              </Select>
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
            {isEditing ? 'Update Notice' : 'Add Notice'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NoticeForm;
