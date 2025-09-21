// features/admin/pages/SubjectPage.jsx - COMPLETE WITH REAL API

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
import { subjectService, branchService } from '@services/api'
import { useCrud } from '@hooks/useCrud'
import { useDebounce } from '@hooks/useDebounce'
import SubjectForm from '../components/SubjectForm'
import SubjectTable from '../components/SubjectTable'
import toast from 'react-hot-toast'
import { Search, Download, Plus, BookOpen, RefreshCw } from 'lucide-react'

const SubjectPage = () => {
  const [branches, setBranches] = useState([])
  const [searchParams, setSearchParams] = useState({
    name: '',
    branch: '',
    semester: '',
    subjectType: '',
  })

  const debouncedSearchParams = useDebounce(searchParams, 500)

  const {
    data: subjects,
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
  } = useCrud(subjectService)

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
      semester: '',
      subjectType: '',
    })
  }, [])

  const handleExport = useCallback(async () => {
    try {
      toast.loading('Exporting subjects...')

      const csvData = subjects.map(subject => ({
        'Subject Name': subject.name || 'N/A',
        'Subject Code': subject.code || 'N/A',
        'Branch': subject.branchId?.name || 'N/A',
        'Semester': subject.semester || 'N/A',
        'Credits': subject.credits || 'N/A',
        'Subject Type': subject.subjectType || 'N/A',
        'Theory Hours': subject.theoryHours || 0,
        'Practical Hours': subject.practicalHours || 0,
        'Total Hours': (subject.theoryHours || 0) + (subject.practicalHours || 0),
        'Status': subject.isActive ? 'Active' : 'Inactive',
      }))

      const csv = Object.keys(csvData[0]).join(',') + '\n' +
        csvData.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `subjects_${new Date().toISOString().split('T')[0]}.csv`
      a.click()

      toast.dismiss()
      toast.success('Subjects exported successfully')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to export subjects')
    }
  }, [subjects])

  const semesterOptions = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({ value: String(i + 1), label: `Semester ${i + 1}` })),
    []
  )

  const subjectTypeOptions = useMemo(() => [
    { value: 'core', label: 'Core' },
    { value: 'elective', label: 'Elective' },
    { value: 'lab', label: 'Laboratory' },
    { value: 'project', label: 'Project' },
    { value: 'internship', label: 'Internship' },
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
          title="Manage Subjects"
          description={`${subjects.length} subjects available`}
          icon={BookOpen}
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
            disabled={subjects.length === 0}
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
            Add Subject
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Subject Name
            </label>
            <Input
              placeholder="Search by subject name..."
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
              Semester
            </label>
            <Select
              value={searchParams.semester}
              onValueChange={(value) => handleSearchChange('semester', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Semesters" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                {semesterOptions.map((sem) => (
                  <SelectItem key={sem.value} value={sem.value}>
                    {sem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Subject Type
            </label>
            <Select
              value={searchParams.subjectType}
              onValueChange={(value) => handleSearchChange('subjectType', value === 'all' ? '' : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {subjectTypeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
          <Loading size="lg" text="Loading subjects..." />
        </div>
      ) : subjects.length === 0 ? (
        <NoData
          title="No subjects found"
          description={hasActiveFilters ? "Try adjusting your search filters" : "Get started by adding your first subject"}
          actionLabel="Add Subject"
          onAction={() => openModal()}
        />
      ) : (
        <SubjectTable
          subjects={subjects}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
          branches={branches}
        />
      )}

      {/* Modals */}
      <Modal
        title={isEditing ? 'Edit Subject' : 'Add New Subject'}
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
      >
        <SubjectForm
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
        title="Delete Subject"
        description={`Are you sure you want to delete ${selectedItem?.name}? This action cannot be undone and will affect all associated course materials and exams.`}
        isProcessing={isProcessing}
      />
    </div>
  )
}

export default SubjectPage
