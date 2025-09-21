import React from 'react'

// Simple calendar replacement - just use HTML date input for now
export const Calendar = ({
  mode = 'single',
  selected,
  onSelect,
  disabled,
  className,
  initialFocus,
  ...props
}) => {
  const handleDateChange = (e) => {
    const date = e.target.value ? new Date(e.target.value) : null
    onSelect(date)
  }

  const formatDate = (date) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <input
      type="date"
      value={formatDate(selected)}
      onChange={handleDateChange}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    />
  )
}
