// features/admin/components/FacultyTable.jsx - COMPLETE TABLE WITH REAL API

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Phone,
  Mail,
  Calendar,
  IndianRupee,
  ArrowUpDown,
  Search,
  Building
} from 'lucide-react'

const FacultyTable = ({ faculties, onEdit, onDelete, branches }) => {
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [filterBranch, setFilterBranch] = useState('all')
  const [filterDesignation, setFilterDesignation] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Extract unique designations for filter
  const designations = useMemo(() => {
    const unique = [...new Set(faculties.map(f => f.designation).filter(Boolean))]
    return unique.sort()
  }, [faculties])

  // Memoized filtered and sorted faculties
  const processedFaculties = useMemo(() => {
    let filtered = faculties

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(faculty =>
        `${faculty.firstName || ''} ${faculty.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.phone?.includes(searchTerm) ||
        faculty.designation?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply branch filter
    if (filterBranch && filterBranch !== 'all') {
      filtered = filtered.filter(faculty => {
        const branchId = faculty.branchId?._id || faculty.branchId
        return branchId === filterBranch
      })
    }

    // Apply designation filter
    if (filterDesignation && filterDesignation !== 'all') {
      filtered = filtered.filter(faculty => faculty.designation === filterDesignation)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase()
          bValue = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase()
          break
        case 'email':
          aValue = a.email || ''
          bValue = b.email || ''
          break
        case 'branch':
          aValue = a.branchId?.name || ''
          bValue = b.branchId?.name || ''
          break
        case 'designation':
          aValue = a.designation || ''
          bValue = b.designation || ''
          break
        case 'joiningDate':
          aValue = a.joiningDate ? new Date(a.joiningDate) : new Date(0)
          bValue = b.joiningDate ? new Date(b.joiningDate) : new Date(0)
          break
        case 'salary':
          aValue = a.salary || 0
          bValue = b.salary || 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [faculties, searchTerm, filterBranch, filterDesignation, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getDesignationBadgeVariant = (designation) => {
    switch (designation?.toLowerCase()) {
      case 'professor':
      case 'hod':
      case 'dean':
      case 'principal':
        return 'default'
      case 'associate professor':
        return 'secondary'
      case 'assistant professor':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getSeniorityLevel = (joiningDate) => {
    if (!joiningDate) return 'New'
    const years = (new Date() - new Date(joiningDate)) / (1000 * 60 * 60 * 24 * 365)
    if (years >= 10) return 'Senior'
    if (years >= 5) return 'Experienced'
    if (years >= 2) return 'Regular'
    return 'New'
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
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by branch" />
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

          <Select value={filterDesignation} onValueChange={setFilterDesignation}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Designations</SelectItem>
              {designations.map((designation) => (
                <SelectItem key={designation} value={designation}>
                  {designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-gray-600">
          Showing {processedFaculties.length} of {faculties.length} faculty members
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Profile</TableHead>
              <SortableHeader field="name">Name</SortableHeader>
              <SortableHeader field="email">Contact</SortableHeader>
              <SortableHeader field="branch">Department</SortableHeader>
              <SortableHeader field="designation">Position</SortableHeader>
              <SortableHeader field="joiningDate">Experience</SortableHeader>
              <SortableHeader field="salary">Salary</SortableHeader>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedFaculties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  {searchTerm || filterBranch !== 'all' || filterDesignation !== 'all'
                    ? 'No faculty members match your search criteria'
                    : 'No faculty members found'
                  }
                </TableCell>
              </TableRow>
            ) : (
              processedFaculties.map((faculty) => (
                <TableRow key={faculty._id} className="hover:bg-gray-50">
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={faculty.profile}
                        alt={`${faculty.firstName} ${faculty.lastName}`}
                      />
                      <AvatarFallback className="text-xs">
                        {faculty.firstName?.[0] || 'F'}
                        {faculty.lastName?.[0] || 'T'}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {`${faculty.firstName || ''} ${faculty.lastName || ''}`.trim() || 'N/A'}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Building className="h-3 w-3" />
                        <span>ID: {faculty._id?.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {faculty.email && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="truncate max-w-[200px]" title={faculty.email}>
                            {faculty.email}
                          </span>
                        </div>
                      )}
                      {faculty.phone && (
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{faculty.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {faculty.branchId?.name || 'N/A'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge variant={getDesignationBadgeVariant(faculty.designation)}>
                      {faculty.designation || 'N/A'}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {faculty.joiningDate ? (
                        <>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{new Date(faculty.joiningDate).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="text-xs w-fit">
                            {getSeniorityLevel(faculty.joiningDate)}
                          </Badge>
                        </>
                      ) : (
                        <span className="text-gray-500 text-sm">N/A</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {faculty.salary ? (
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <IndianRupee className="h-3 w-3 text-gray-400" />
                        <span>{(faculty.salary / 1000).toFixed(0)}K</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
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
                          onClick={() => onEdit(faculty)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(faculty)}
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

export default FacultyTable
