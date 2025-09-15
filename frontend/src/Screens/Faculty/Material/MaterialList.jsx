import React from 'react';
import CustomButton from '../../../components/ui/CustomButton';

const MaterialList = ({ materials, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {materials.map((material) => (
        <div
          key={material._id}
          className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
        >
          <div>
            <h4 className="font-semibold">{material.title}</h4>
            <a
              href={material.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Download
            </a>
          </div>
          <CustomButton variant="danger" onClick={() => onDelete(material)}>
            Delete
          </CustomButton>
        </div>
      ))}
    </div>
  );
};

export default MaterialList;
