// src/hooks/useCrud.js - FIXED TO PREVENT LOOPS

import { useState, useCallback } from 'react'

export const useCrud = (service) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

  // Fetch data - FIXED: Removed service from dependency
  const fetchData = useCallback(async (params = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log('🔄 useCrud: Fetching data with params:', params)
      const result = await service.getAll(params)

      // Handle different response formats
      let dataArray = []
      if (Array.isArray(result)) {
        dataArray = result
      } else if (result.data && Array.isArray(result.data)) {
        dataArray = result.data
      } else if (result.students && Array.isArray(result.students)) {
        dataArray = result.students
      }

      console.log('✅ useCrud: Data fetched successfully, count:', dataArray.length)
      setData(dataArray)
    } catch (error) {
      console.error('❌ useCrud: Fetch error:', error)
      setError(error.message)
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, []) // ✅ EMPTY DEPS - service is accessed directly

  // Modal handlers
  const openModal = useCallback((item = null) => {
    setSelectedItem(item)
    setIsEditing(!!item)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedItem(null)
    setIsEditing(false)
  }, [])

  const openDeleteConfirm = useCallback((item) => {
    setSelectedItem(item)
    setIsDeleteConfirmOpen(true)
  }, [])

  const closeDeleteConfirm = useCallback(() => {
    setIsDeleteConfirmOpen(false)
    setSelectedItem(null)
  }, [])

  // CRUD operations
  const handleUpsert = useCallback(async (itemData) => {
    setIsProcessing(true)
    setError(null)

    try {
      if (isEditing && selectedItem) {
        await service.update(selectedItem._id || selectedItem.id, itemData)
      } else {
        await service.create(itemData)
      }

      closeModal()
      // Call fetchData without params to refresh
      await fetchData()
      return true
    } catch (error) {
      console.error('Upsert error:', error)
      setError(error.message)
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [isEditing, selectedItem, closeModal, fetchData]) // ✅ ONLY NECESSARY DEPS

  const handleDelete = useCallback(async () => {
    if (!selectedItem) return false

    setIsProcessing(true)
    setError(null)

    try {
      await service.delete(selectedItem._id || selectedItem.id)
      closeDeleteConfirm()
      // Call fetchData without params to refresh
      await fetchData()
      return true
    } catch (error) {
      console.error('Delete error:', error)
      setError(error.message)
      return false
    } finally {
      setIsProcessing(false)
    }
  }, [selectedItem, closeDeleteConfirm, fetchData]) // ✅ ONLY NECESSARY DEPS

  return {
    // Data
    data,
    isLoading,
    isProcessing,
    error,

    // Modal states
    isModalOpen,
    isDeleteConfirmOpen,
    isEditing,
    selectedItem,

    // Functions
    fetchData,
    openModal,
    closeModal,
    openDeleteConfirm,
    closeDeleteConfirm,
    handleUpsert,
    handleDelete,
  }
}
