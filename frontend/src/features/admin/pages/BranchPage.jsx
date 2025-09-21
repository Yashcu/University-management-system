// features/admin/pages/BranchPage.jsx - COMPLETE WITH REAL API

import React, { useEffect, useCallback, useMemo } from 'react'
import { Heading } from '@components/ui/Heading'
import { Loading } from '@components/ui/Loading'
import { NoData } from '@components/ui/NoData'
import { Button } from '@components/ui/button'
import { Modal } from '@components/ui/Modal'
import { DeleteConfirm } from '@components/ui/DeleteConfirm'
import { Input } from '@components/ui/input'
import { branchService } from '@services/api'
import { useCrud } from '@hooks/useCrud'
import { useDebounce } from '@hooks/useDebounce'
import BranchForm from '../components/BranchForm'
import BranchTable from '../components/BranchTable'
import toast from 'react-hot-toast'
import { Search, Download, Plus, Building, RefreshCw } from 'lucide-react'

const BranchPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const {
    data: branches,
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
  } = useCrud(branchService)

  // Execute search when debounced search term changes
  useEffect(() => {
    const searchParams = debouncedSearchTerm ? { name: debouncedSearchTerm } : {}
    fetchData(searchParams)
  }, [debouncedSearchTerm, fetchData])

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value)
  }, [])

  const handleExport = useCallback(async () => {
    try {
      toast.loading('Exporting branches...')

      const csvData = branches.map(branch => ({
        'Branch Name': branch.name || 'N/A',
        'Branch Code': branch.code || 'N/A',
        'Description': branch.description || 'N/A',
        'Total Students': branch.studentCount || 0,
        'Total Faculty': branch.facultyCount || 0,
        'HOD': branch.hod || 'Not Assigned',
        'Status': branch.isActive ? 'Active' : 'Inactive',
        'Created Date': branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : 'N/A',
      }))

      const csv = Object.keys(csvData[0]).join(',') + '\n' +
        csvData.map(row => Object.values(row).map(val => `"${val}"`).join(',')).join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `branches_${new Date().toISOString().split('T')[0]}.csv`
      a.click()

      toast.dismiss()
      toast.success('Branches exported successfully')
    } catch (error) {
      toast.dismiss()
      toast.error('Failed to export branches')
    }
  }, [branches])

  const hasActiveFilters = useMemo(() => searchTerm, [searchTerm])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Heading
          title="Manage Branches"
          description={`${branches.length} academic branches`}
          icon={Building}
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
            disabled={branches.length === 0}
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
            Add Branch
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Search Branches</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearchChange('')}
              className="ml-auto text-xs"
            >
              Clear Search
            </Button>
          )}
        </div>

        <div className="max-w-md">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Branch Name
          </label>
          <Input
            placeholder="Search branches by name..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loading size="lg" text="Loading branches..." />
        </div>
      ) : branches.length === 0 ? (
        <NoData
          title="No branches found"
          description={hasActiveFilters ? "Try adjusting your search terms" : "Get started by adding your first academic branch"}
          actionLabel="Add Branch"
          onAction={() => openModal()}
        />
      ) : (
        <BranchTable
          branches={branches}
          onEdit={openModal}
          onDelete={openDeleteConfirm}
        />
      )}

      {/* Modals */}
      <Modal
        title={isEditing ? 'Edit Branch' : 'Add New Branch'}
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
      >
        <BranchForm
          isEditing={isEditing}
          selectedItem={selectedItem}
          onUpsert={handleUpsert}
          onCancel={closeModal}
          isProcessing={isProcessing}
        />
      </Modal>

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Branch"
        description={`Are you sure you want to delete ${selectedItem?.name}? This action cannot be undone and will affect all associated students and faculty.`}
        isProcessing={isProcessing}
      />
    </div>
  )
}

export default BranchPage
