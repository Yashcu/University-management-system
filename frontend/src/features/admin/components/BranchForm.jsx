// features/admin/components/BranchForm.jsx - COMPLETE FORM WITH REAL API

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
import { Building, FileText, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

const branchSchema = z.object({
  name: z.string().min(1, 'Branch name is required').max(100),
  code: z.string().min(2, 'Branch code must be at least 2 characters').max(10).optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  hod: z.string().max(100, 'HOD name must be less than 100 characters').optional(),
  isActive: z.enum(['true', 'false']).default('true'),
})

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
      name: '',
      code: '',
      description: '',
      hod: '',
      isActive: 'true',
    },
  })

  useEffect(() => {
    if (isEditing && selectedItem) {
      const formData = {
        ...selectedItem,
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
      toast.error('Failed to save branch')
    }
  }

  // Generate branch code from name
  const generateBranchCode = (name) => {
    if (!name) return ''
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 4)
  }

  const handleNameChange = (value) => {
    form.setValue('name', value)
    if (!isEditing && !form.getValues('code')) {
      form.setValue('code', generateBranchCode(value))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
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
                    <FormLabel>Branch Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Computer Science Engineering"
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
                    <FormLabel>Branch Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CSE"
                        {...field}
                        className="uppercase"
                        maxLength={10}
                      />
                    </FormControl>
                    <FormDescription>
                      Short code for the branch (auto-generated from name)
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
                          placeholder="Brief description of the branch and its programs..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description of the branch (max 500 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Administrative Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Administrative Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Head of Department (HOD)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Dr. John Smith"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Name of the current HOD (optional)
                    </FormDescription>
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
                      Only active branches will be available for student enrollment
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
              : (isEditing ? 'Update Branch' : 'Create Branch')
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default BranchForm
