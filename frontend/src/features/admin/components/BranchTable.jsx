// features/admin/components/BranchTable.jsx - COMPLETE TABLE WITH REAL API

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { Input } from '@components/ui/input'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Building,
  Users,
  UserCheck,
  Calendar,
  ArrowUpDown,
  Search
} from 'lucide-react'

const BranchTable = ({ branches, onEdit, onDelete }) => {
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')

  // Memoized filtered and sorted branches
  const processedBranches = useMemo(() => {
    let filtered = branches

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.hod?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || ''
          bValue = b.name?.toLowerCase() || ''
          break
        case 'code':
          aValue = a.code?.toLowerCase() || ''
          bValue = b.code?.toLowerCase() || ''
          break
        case 'hod':
          aValue = a.hod?.toLowerCase() || ''
          bValue = b.hod?.toLowerCase() || ''
          break
        case 'studentCount':
          aValue = a.studentCount || 0
          bValue = b.studentCount || 0
          break
        case 'facultyCount':
          aValue = a.facultyCount || 0
          bValue = b.facultyCount || 0
          break
        case 'createdAt':
          aValue = a.createdAt ? new Date(a.createdAt) : new Date(0)
          bValue = b.createdAt ? new Date(b.createdAt) : new Date(0)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [branches, searchTerm, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getStatusBadgeVariant = (isActive) => {
    return isActive ? 'default' : 'secondary'
  }

  const SortableHeader = ({ field, children, className = "" }) => (
    <TableHead className={`cursor-pointer select-none hover:bg-gray-100 ${className}`} onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-4 w-4 text-gray-400" />
      </div>
    </TableHead>
  )

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>

        <div className="text-sm text-gray-600">
          Showing {processedBranches.length} of {branches.length} branches
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="name">Branch Name</SortableHeader>
              <SortableHeader field="code">Code</SortableHeader>
              <SortableHeader field="hod">HOD</SortableHeader>
              <SortableHeader field="studentCount">Students</SortableHeader>
              <SortableHeader field="facultyCount">Faculty</SortableHeader>
              <TableHead>Status</TableHead>
              <SortableHeader field="createdAt">Created</SortableHeader>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedBranches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No branches match your search criteria' : 'No branches found'}
                </TableCell>
              </TableRow>
            ) : (
              processedBranches.map((branch) => (
                <TableRow key={branch._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Building className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {branch.name || 'N/A'}
                        </span>
                        {branch.description && (
                          <span className="text-xs text-gray-500 max-w-[200px] truncate" title={branch.description}>
                            {branch.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {branch.code || 'N/A'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-gray-400" />
                      <span>{branch.hod || 'Not Assigned'}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="font-medium">{branch.studentCount || 0}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-400" />
                      <span className="font-medium">{branch.facultyCount || 0}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(branch.isActive)}>
                      {branch.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {branch.createdAt
                          ? new Date(branch.createdAt).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onEdit(branch)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(branch)}
                          className="flex items-center gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default BranchTable
