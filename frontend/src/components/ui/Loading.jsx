import React from 'react'
import { Loader2 } from 'lucide-react'

const Loading = React.memo(({
  size = 'default',
  text = 'Loading...',
  className = '',
  showText = true
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <Loader2
        className={`animate-spin text-blue-600 ${sizeClasses[size]}`}
      />
      {showText && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
})

Loading.displayName = 'Loading'

export { Loading }
export default Loading
