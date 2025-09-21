// src/components/ui/Heading.jsx

import React from 'react'

const Heading = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}

export { Heading }
