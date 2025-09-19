import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CustomButton from '../../../components/ui/CustomButton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const adminSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  gender: z.enum(['male', 'female', 'other']),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), 'A valid date is required.'),
  designation: z.string().min(1, 'Designation is required'),
  joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'A valid date is required.'),
  salary: z.coerce.number().positive('Salary must be a positive number'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  country: z.string().min(1, 'Country is required'),
  profile: z.any().optional(),
});


const AdminForm = ({
  isEditing,
  selectedItem,
  onUpsert,
  onCancel,
  isProcessing,
}) => {
  const form = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      designation: '',
      joiningDate: '',
      salary: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: '',
      profile: null,
    },
  });

  useEffect(() => {
    if (isEditing && selectedItem) {
      form.reset({
        ...selectedItem,
        dob: selectedItem.dob ? new Date(selectedItem.dob).toISOString().split('T')[0] : '',
        joiningDate: selectedItem.joiningDate ? new Date(selectedItem.joiningDate).toISOString().split('T')[0] : '',
      });
    } else {
      form.reset();
    }
  }, [isEditing, selectedItem, form]);

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'profile') {
        if (data.profile && data.profile.length > 0) {
          formData.append('file', data.profile[0]);
        }
      } else {
        formData.append(key, data[key]);
      }
    });
    onUpsert(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter last name" {...field} />
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
                    <FormControl><Input type="email" placeholder="email@example.com" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="10-digit phone number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="joiningDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joining Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl><Input placeholder="Enter city" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl><Input placeholder="Enter state" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl><Input placeholder="Enter 6-digit pincode" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl><Input placeholder="Enter country" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="profile"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="md:col-span-2 flex justify-end gap-4 pt-4 border-t mt-6">
          <CustomButton type="button" variant="outline" onClick={onCancel}>
            Cancel
          </CustomButton>
          <CustomButton type="submit" loading={isProcessing} disabled={isProcessing}>
            {isEditing ? 'Update Admin' : 'Add Admin'}
          </CustomButton>
        </div>
      </form>
    </Form>
  );
};

export default AdminForm;
