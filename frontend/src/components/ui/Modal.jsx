// src/components/ui/Modal.jsx - MORE STABLE VERSION

import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

const Modal = ({ title, isOpen, onClose, children, size = 'md' }) => {
  const modalRef = useRef(null)

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'

      // Focus management
      if (modalRef.current) {
        modalRef.current.focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Don't render if not open
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  }

  // Handle backdrop click - only close when clicking the actual backdrop
  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not any child elements
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]"> {/* Higher z-index */}
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
        style={{ zIndex: 9998 }}
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 overflow-y-auto"
        style={{ zIndex: 9999 }}
        onClick={handleBackdropClick} // Handle clicks on the container
      >
        <div className="flex items-center justify-center min-h-full p-4">
          {/* Modal Content */}
          <div
            ref={modalRef}
            className={`
              bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}
              transform transition-all max-h-[90vh] overflow-hidden
              animate-in fade-in-0 zoom-in-95 duration-200
              relative
            `}
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white sticky top-0 z-10">
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onClose()
                }}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] bg-white">
              <div className="px-6 py-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { Modal }
