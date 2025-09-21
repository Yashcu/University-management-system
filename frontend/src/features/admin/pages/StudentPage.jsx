import React, { useEffect, useState } from 'react'
import { Button } from '../../../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog'
import { Input } from '../../../components/ui/input'
import { Heading } from '../../../components/ui/Heading'
import StudentTable from '../components/StudentTable'
import StudentForm from '../components/StudentForm'
import { studentService } from '../../../services/studentService'
import { useDebounce } from '../../../hooks/useDebounce'
import toast from 'react-hot-toast'
import { Plus, RefreshCw, Users } from 'lucide-react'

export default function StudentPage() {
  const [students, setStudents] = useState([])
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 500)
  const [open, setOpen] = useState(false)

  // Fetch students
  async function fetchStudents() {
    setLoading(true)
    try {
      const res = await studentService.getAll({ firstName: debounced })
      setStudents(res.data || [])
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  // Fetch branches for form
  async function fetchBranches() {
    try {
      const token = localStorage.getItem('userToken')
      const res = await fetch('http://localhost:8000/api/branch', {
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` }
      })
      if (res.ok) {
        const json = await res.json()
        setBranches(json.data || json || [])
      }
    } catch {}
  }

  useEffect(() => {
    fetchStudents()
  }, [debounced])

  useEffect(() => {
    fetchBranches()
  }, [])

  async function handleCreate(data) {
    try {
      await studentService.create(data)
      toast.success('Student created')
      setOpen(false)
      fetchStudents()
    } catch (e) {
      toast.error(e.message || 'Failed to create')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Heading title="Student Management" description={`${students.length} students`} icon={Users} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchStudents} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4" /> Add Student</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Add New Student</DialogTitle></DialogHeader>
              <div className="px-1">
                <StudentForm onSubmit={handleCreate} onCancel={() => setOpen(false)} branches={branches} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Input
        placeholder="Search by first name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <StudentTable students={students} loading={loading} onDelete={() => fetchStudents()} branches={branches} />
    </div>
  )
}
