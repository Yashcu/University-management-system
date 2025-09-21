// features/admin/pages/FacultyPage.jsx - COMPLETE WITH REAL API

import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { Heading } from '@components/ui/Heading'
import { Loading } from '@components/ui/Loading'
import { NoData } from '@components/ui/NoData'
import { Button } from '@components/ui/button'
import { Modal } from '@components/ui/Modal'
import { DeleteConfirm } from '@components/ui/DeleteConfirm'
import { Input } from '@components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { facultyService, branchService } from '@services/api'
import { useCrud } from '@hooks/useCrud'
import { useDebounce } from '@hooks/useDebounce'
import FacultyForm from '../components/FacultyForm'
import FacultyTable from '../components/FacultyTable'
import toast from 'react-hot-toast'
import { Search, Download, Plus, Users, RefreshCw } from 'lucide-react'

const FacultyPage = () => {
  const [branches, setBranches] = useState([])
  const [searchParams, setSearchParams] = useState({
    name: '',
    branch: '',
    designation: '',
  })

  const debouncedSearchParams = useDebounce(searchParams, 500)

  const {
    data: faculties,
    isLoading,
    isProcessing,
    isModalOpen,
    isDeleteConfirmOpen,
    isEditing,
    selectedItem,
    fetchData,
    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleUpsert,
    handleDelete,
  } = useCrud(facultyService)

  const getBranches = useCallback(async () => {
    try {
      const response = await branchService.search()
      const branchData = Array.isArray(response) ? response : response?.data || []
      setBranches(branchData)
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      toast.error('Failed to fetch branches')
    }
  }, [])

  useEffect(() => {
    const activeSearchParams = Object.fromEntries(
      Object.entries(debouncedSearchParams).filter(([, value]) => value)
    )
    fetchData(activeSearchParams)
  }, [debouncedSearchParams, fetchData])

  useEffect(() => {
    getBranches()
  }, [getBranches])

  const handleSearchChange = useCallback((field, value) => {
    setSearchParams(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchParams({
      name: '',
      branch: '',
      designation: '',
    })
  }, [])

  const handleExport = useCallback(async () => {
    try {
      toast.loading('Exporting faculty data...')

      const csvData = faculties.map(faculty => ({
        'Name': `${faculty.firstName || ''} ${faculty.lastName || ''}`.trim(),
        'Email': faculty.email || 'N/A',
        'Phone': faculty.phone || 'N/A',
        'Branch': faculty.branchId?.name || 'N/A',
        'Designation': faculty.designation || 'N/A',
        'Joining Date': faculty.joiningDate ? new Date(faculty.joiningDate).toLocaleDateString() : 'N/A',
        'Salary': faculty.salary ? `₹${faculty.salary.toLocaleString()}` : 'N/A',
        'Gender': faculty.gender || 'N/A',
        'City': faculty.city || 'N/A',
      }))

      const csv = Object.keys(csvData[0]).join(',') + '\n' +
        csvData.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `faculty_${new Date().toISOString().split('T')[0]}.csv`
      a.click()

      toast.dismiss()
      toast.success('Faculty data exported successfully')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to export faculty data')
    }
  }, [faculties])

  const designationOptions = useMemo(() => [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Senior Lecturer',
    'HOD',
    'Dean'
  ], [])

  const hasActiveFilters = useMemo(() =>
    Object.values(searchParams).some(value => value),
    [searchParams]
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading
          title="Manage Faculty"
          description={`${faculties.length} faculty members`}
          icon={Users}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => fetchData()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={faculties.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Faculty
          </Button>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Search & Filter</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="ml-auto text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Name
            </label>
            <Input
              placeholder="Search by faculty name..."
              value={searchParams.name}
              onChange={(e) => handleSearchChange('name', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Branch
            </label>
            <Select
              value={searchParams.branch}
              onValueChange={(value) => handleSearchChange('branch', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Designation
            </label>
            <Select
              value={searchParams.designation}
              onValueChange={(value) => handleSearchChange('designation', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Designations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Designations</SelectItem>
                {designationOptions.map((designation) => (
                  <SelectItem key={designation} value={designation}>
                    {designation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loading size="lg" text="Loading faculty..." />
        </div>
      ) : faculties.length === 0 ? (
        <NoData
          title="No faculty found"
          description={hasActiveFilters ? "Try adjusting your search filters" : "Get started by adding your first faculty member"}
          actionLabel="Add Faculty"
          onAction={() => openModal()}
        />
      ) : (
        <FacultyTable
          faculties={faculties}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
          branches={branches}
        />
      )}

      {/* Modals */}
      <Modal
        title={isEditing ? 'Edit Faculty Member' : 'Add New Faculty Member'}
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
      >
        <FacultyForm
          isEditing={isEditing}
          selectedItem={selectedItem}
          onUpsert={handleUpsert}
          onCancel={closeModal}
          isProcessing={isProcessing}
          branches={branches}
        />
      </Modal>

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Faculty Member"
        description={`Are you sure you want to delete ${selectedItem?.firstName} ${selectedItem?.lastName}? This action cannot be undone.`}
        isProcessing={isProcessing}
      />
    </div>
  )
}

export default FacultyPage
