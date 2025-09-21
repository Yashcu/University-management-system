import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import { marksService } from '@services/api'

export const useMarks = (initialFilters = {}) => {
  const [marks, setMarks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    examId: '',
    subjectId: '',
    studentId: '',
    branchId: '',
    ...initialFilters
  })

  const getMarks = useCallback(
    async (customFilters = null) => {
      const activeFilters = customFilters || filters
      const { examId, subjectId, studentId, branchId } = activeFilters

      // Reset marks if required filters are missing
      if (!examId && !subjectId && !studentId) {
        setMarks([])
        setError(null)
        return []
      }

      setIsLoading(true)
      setError(null)

      try {
        const params = {}
        if (examId) params.examId = examId
        if (subjectId) params.subjectId = subjectId
        if (studentId) params.studentId = studentId
        if (branchId) params.branchId = branchId

        const response = await marksService.search(params)
        const marksData = Array.isArray(response) ? response : response?.data || []

        setMarks(marksData)
        return marksData
      } catch (error) {
        const errorMessage = error.message || 'Failed to fetch marks'
        setError(errorMessage)
        toast.error(errorMessage)
        setMarks([])
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [filters]
  )

  const addMarks = useCallback(async (marksData) => {
    setIsLoading(true)

    try {
      const response = await marksService.create(marksData)
      toast.success('Marks added successfully')

      // Refresh marks after adding
      await getMarks()

      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to add marks'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [getMarks])

  const updateMarks = useCallback(async (marksId, marksData) => {
    setIsLoading(true)

    try {
      const response = await marksService.update(marksId, marksData)
      toast.success('Marks updated successfully')

      // Refresh marks after updating
      await getMarks()

      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to update marks'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [getMarks])

  const deleteMarks = useCallback(async (marksId) => {
    setIsLoading(true)

    try {
      const response = await marksService.delete(marksId)
      toast.success('Marks deleted successfully')

      // Refresh marks after deleting
      await getMarks()

      return response
    } catch (error) {
      const errorMessage = error.message || 'Failed to delete marks'
      toast.error(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [getMarks])

  // Auto-fetch when filters change
  useEffect(() => {
    const hasValidFilters = filters.examId || filters.subjectId || filters.studentId
    if (hasValidFilters) {
      getMarks()
    }
  }, [filters, getMarks])

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      examId: '',
      subjectId: '',
      studentId: '',
      branchId: '',
    })
    setMarks([])
    setError(null)
  }, [])

  // Group marks by different criteria
  const groupedMarks = {
    byExam: marks.reduce((acc, mark) => {
      const examName = mark.exam?.name || 'Unknown Exam'
      if (!acc[examName]) acc[examName] = []
      acc[examName].push(mark)
      return acc
    }, {}),

    bySubject: marks.reduce((acc, mark) => {
      const subjectName = mark.subject?.name || 'Unknown Subject'
      if (!acc[subjectName]) acc[subjectName] = []
      acc[subjectName].push(mark)
      return acc
    }, {}),

    byStudent: marks.reduce((acc, mark) => {
      const studentName = mark.student?.name || 'Unknown Student'
      if (!acc[studentName]) acc[studentName] = []
      acc[studentName].push(mark)
      return acc
    }, {}),
  }

  // Calculate statistics
  const stats = {
    totalMarks: marks.length,
    averageMarks: marks.length > 0
      ? marks.reduce((sum, mark) => sum + (mark.obtainedMarks || 0), 0) / marks.length
      : 0,
    highestMarks: marks.length > 0
      ? Math.max(...marks.map(mark => mark.obtainedMarks || 0))
      : 0,
    lowestMarks: marks.length > 0
      ? Math.min(...marks.map(mark => mark.obtainedMarks || 0))
      : 0,
  }

  return {
    // Data
    marks,
    groupedMarks,
    stats,
    filters,

    // States
    isLoading,
    error,

    // Actions
    getMarks,
    addMarks,
    updateMarks,
    deleteMarks,
    handleFilterChange,
    resetFilters,

    // Utilities
    hasMarks: marks.length > 0,
    hasValidFilters: !!(filters.examId || filters.subjectId || filters.studentId),
  }
}
