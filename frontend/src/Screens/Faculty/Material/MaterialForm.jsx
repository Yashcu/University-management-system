import React from 'react';
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const materialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subjectId: z.string().min(1, 'Subject must be selected'),
  file: z
    .any()
    .refine((files) => files?.length == 1, "File is required."),
});

const MaterialForm = ({ onUpsert, onCancel, isProcessing, subjects }) => {
  const form = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: '',
      subjectId: '',
      file: undefined,
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('subjectId', data.subjectId);
    formData.append('file', data.file[0]);
    onUpsert(formData);
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
                <Input placeholder="e.g., Chapter 1 Notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name} ({s.code})
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
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material File (PDF, DOCX, etc.)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files)}
                />
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
            Upload Material
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default MaterialForm;
