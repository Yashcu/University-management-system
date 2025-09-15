import React from 'react';
import { IoMdClose } from 'react-icons/io';

const Modal = React.memo(({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <IoMdClose className="text-2xl" />
        </button>
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        {children}
      </div>
    </div>
  );
});

export default Modal;
