// features/admin/components/SubjectTable.jsx - COMPLETE TABLE WITH REAL API

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
  BookOpen,
  Clock,
  Award,
  ArrowUpDown,
  Search
} from 'lucide-react'

const SubjectTable = ({ subjects, onEdit, onDelete, branches }) => {
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchTerm, setSearchTerm] = useState('')

  // Memoized filtered and sorted subjects
  const processedSubjects = useMemo(() => {
    let filtered = subjects

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(subject =>
        subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.branchId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
        case 'branch':
          aValue = a.branchId?.name?.toLowerCase() || ''
          bValue = b.branchId?.name?.toLowerCase() || ''
          break
        case 'semester':
          aValue = a.semester || 0
          bValue = b.semester || 0
          break
        case 'credits':
          aValue = a.credits || 0
          bValue = b.credits || 0
          break
        case 'totalHours':
          aValue = (a.theoryHours || 0) + (a.practicalHours || 0)
          bValue = (b.theoryHours || 0) + (b.practicalHours || 0)
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [subjects, searchTerm, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getSubjectTypeBadgeVariant = (type) => {
    switch (type) {
      case 'core': return 'default'
      case 'elective': return 'secondary'
      case 'lab': return 'outline'
      case 'project': return 'destructive'
      default: return 'outline'
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
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>

        <div className="text-sm text-gray-600">
          Showing {processedSubjects.length} of {subjects.length} subjects
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="name">Subject</SortableHeader>
              <SortableHeader field="code">Code</SortableHeader>
              <SortableHeader field="branch">Branch</SortableHeader>
              <SortableHeader field="semester">Sem</SortableHeader>
              <TableHead>Type</TableHead>
              <SortableHeader field="credits">Credits</SortableHeader>
              <SortableHeader field="totalHours">Hours</SortableHeader>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedSubjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No subjects match your search criteria' : 'No subjects found'}
                </TableCell>
              </TableRow>
            ) : (
              processedSubjects.map((subject) => (
                <TableRow key={subject._id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {subject.name || 'N/A'}
                        </span>
                        {subject.description && (
                          <span className="text-xs text-gray-500 max-w-[200px] truncate" title={subject.description}>
                            {subject.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {subject.code || 'N/A'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {subject.branchId?.name || 'N/A'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {subject.semester || 'N/A'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getSubjectTypeBadgeVariant(subject.subjectType)}>
                      {subject.subjectType?.charAt(0).toUpperCase() + subject.subjectType?.slice(1) || 'N/A'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{subject.credits || 0}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span>
                          T:{subject.theoryHours || 0} P:{subject.practicalHours || 0}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Total: {(subject.theoryHours || 0) + (subject.practicalHours || 0)}h
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(subject.isActive)}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </Badge>
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
                          onClick={() => onEdit(subject)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(subject)}
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

export default SubjectTable
