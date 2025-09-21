import React from 'react'
import { Button } from '@components/ui/button'
import { FileX } from 'lucide-react'

export const NoData = ({
  title = 'No data found',
  description = 'There are no items to display',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <FileX className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}

export default NoData
