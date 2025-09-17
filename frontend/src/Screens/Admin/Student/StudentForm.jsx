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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const studentSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  branch: z.string().min(1, 'Branch must be selected'),
  profilePic: z.any().optional(),
});

const StudentForm = ({
  isEditing,
  selectedItem,
  onUpsert,
  onCancel,
  isProcessing,
  branches,
}) => {
  const form = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentId: selectedItem?.studentId || '',
      name: selectedItem?.name || '',
      email: selectedItem?.email || '',
      phone: selectedItem?.phone || '',
      branch: selectedItem?.branch?._id || '',
      profilePic: null,
    },
  });

  useEffect(() => {
    if (isEditing && selectedItem) {
      form.reset({
        studentId: selectedItem.studentId || '',
        name: selectedItem.name || '',
        email: selectedItem.email || '',
        phone: selectedItem.phone || '',
        branch: selectedItem.branch?._id || '',
      });
    } else {
      form.reset({
        studentId: '',
        name: '',
        email: '',
        phone: '',
        branch: '',
        profilePic: null,
      });
    }
  }, [isEditing, selectedItem, form]);

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="studentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter student ID" {...field} disabled={isEditing} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="branch"
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
          name="profilePic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
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
            {isEditing ? 'Update Student' : 'Add Student'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default StudentForm;
