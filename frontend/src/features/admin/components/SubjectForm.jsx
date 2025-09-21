// features/admin/components/SubjectForm.jsx - COMPLETE FORM WITH REAL API

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@components/ui/form'
import { Input } from '@components/ui/input'
import { Textarea } from '@components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { BookOpen, Clock, Award, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required').max(100),
  code: z.string().min(2, 'Subject code must be at least 2 characters').max(10),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  branchId: z.string().min(1, 'Branch must be selected'),
  semester: z.coerce.number().int().min(1).max(8),
  credits: z.coerce.number().int().min(1).max(10),
  subjectType: z.enum(['core', 'elective', 'lab', 'project', 'internship']),
  theoryHours: z.coerce.number().int().min(0).max(10).default(0),
  practicalHours: z.coerce.number().int().min(0).max(10).default(0),
  isActive: z.enum(['true', 'false']).default('true'),
})

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
      name: '',
      code: '',
      description: '',
      branchId: '',
      semester: 1,
      credits: 3,
      subjectType: 'core',
      theoryHours: 3,
      practicalHours: 0,
      isActive: 'true',
    },
  })

  useEffect(() => {
    if (isEditing && selectedItem) {
      const formData = {
        ...selectedItem,
        branchId: selectedItem.branchId?._id || selectedItem.branchId || '',
        isActive: selectedItem.isActive ? 'true' : 'false',
      }
      form.reset(formData)
    } else {
      form.reset()
    }
  }, [isEditing, selectedItem, form])

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        isActive: data.isActive === 'true',
      }

      await onUpsert(formData)
    } catch (error) {
      toast.error('Failed to save subject')
    }
  }

  // Generate subject code from name and branch
  const generateSubjectCode = (name, branchCode) => {
    if (!name || !branchCode) return ''
    const nameCode = name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').substring(0, 3)
    return `${branchCode}${nameCode}`
  }

  const handleNameChange = (value) => {
    form.setValue('name', value)
    if (!isEditing && !form.getValues('code')) {
      const selectedBranch = branches.find(b => b._id === form.getValues('branchId'))
      if (selectedBranch?.code) {
        form.setValue('code', generateSubjectCode(value, selectedBranch.code))
      }
    }
  }

  const handleBranchChange = (branchId) => {
    form.setValue('branchId', branchId)
    if (!isEditing && !form.getValues('code')) {
      const selectedBranch = branches.find(b => b._id === branchId)
      if (selectedBranch?.code && form.getValues('name')) {
        form.setValue('code', generateSubjectCode(form.getValues('name'), selectedBranch.code))
      }
    }
  }

  const semesterOptions = Array.from({ length: 8 }, (_, i) => i + 1)
  const creditOptions = Array.from({ length: 10 }, (_, i) => i + 1)
  const subjectTypeOptions = [
    { value: 'core', label: 'Core Subject' },
    { value: 'elective', label: 'Elective' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'project', label: 'Project Work' },
    { value: 'internship', label: 'Internship' },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Data Structures and Algorithms"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          handleNameChange(e.target.value)
                        }}
                      />
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
                    <FormLabel>Subject Code *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CSEDSA"
                        {...field}
                        className="uppercase"
                        maxLength={10}
                      />
                    </FormControl>
                    <FormDescription>
                      Unique code for the subject (auto-generated)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the subject content and objectives..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description of the subject (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Academic Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch *</FormLabel>
                    <Select onValueChange={handleBranchChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch._id} value={branch._id}>
                            {branch.name}
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
                    <FormLabel>Semester *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {semesterOptions.map((sem) => (
                          <SelectItem key={sem} value={String(sem)}>
                            Semester {sem}
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
                name="subjectType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectTypeOptions.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Hours and Credits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hours and Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credits *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select credits" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {creditOptions.map((credit) => (
                          <SelectItem key={credit} value={String(credit)}>
                            {credit} Credit{credit > 1 ? 's' : ''}
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
                name="theoryHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theory Hours/Week</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="practicalHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practical Hours/Week</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Only active subjects will be available for course planning
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
          <Button type="submit" disabled={isProcessing}>
            {isProcessing
              ? (isEditing ? 'Updating...' : 'Creating...')
              : (isEditing ? 'Update Subject' : 'Create Subject')
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default SubjectForm
