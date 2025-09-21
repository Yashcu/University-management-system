import { useState, useCallback } from 'react'

export const useForm = (initialState = {}, options = {}) => {
  const { validateOnChange = false, onSubmit, onReset } = options

  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target

    let fieldValue = value

    // Handle different input types
    if (type === 'checkbox') {
      fieldValue = checked
    } else if (type === 'file') {
      fieldValue = files[0] || null
    } else if (type === 'number') {
      fieldValue = value === '' ? '' : Number(value)
    }

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }))

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }, [errors])

  const handleSelectChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    setTouched(prev => ({
      ...prev,
      [name]: true,
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }, [errors])

  const setFieldValue = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }))
  }, [])

  const validateForm = useCallback((validationSchema) => {
    const newErrors = {}

    if (typeof validationSchema === 'function') {
      const result = validationSchema(formData)
      if (result && typeof result === 'object') {
        Object.assign(newErrors, result)
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(async (validationSchema) => {
    setIsSubmitting(true)

    try {
      let isValid = true

      if (validationSchema) {
        isValid = validateForm(validationSchema)
      }

      if (isValid && onSubmit) {
        await onSubmit(formData)
      }

      return isValid
    } catch (error) {
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, onSubmit, validateForm])

  const resetForm = useCallback((newInitialState) => {
    const resetState = newInitialState || initialState
    setFormData(resetState)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)

    if (onReset) {
      onReset(resetState)
    }
  }, [initialState, onReset])

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
    }))
  }, [])

  const getFieldProps = useCallback((name) => ({
    name,
    value: formData[name] || '',
    onChange: handleInputChange,
    error: touched[name] && errors[name],
  }), [formData, handleInputChange, touched, errors])

  return {
    // Form data
    formData,
    errors,
    touched,
    isSubmitting,

    // Actions
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    updateFormData,
    validateForm,
    getFieldProps,

    // Utilities
    isDirty: Object.keys(touched).length > 0,
    isValid: Object.keys(errors).length === 0,
  }
}
