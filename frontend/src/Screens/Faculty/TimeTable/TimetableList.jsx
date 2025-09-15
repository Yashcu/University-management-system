import React from 'react';
import CustomButton from '../../../components/ui/CustomButton';

const TimetableList = ({ timetables, onDelete }) => {
  return (
    <div className="mt-6 space-y-4">
      {timetables.map((timetable) => (
        <div
          key={timetable._id}
          className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
        >
          <p className="font-semibold">
            Timetable for {timetable.branch?.name}
          </p>
          <div className="flex gap-4">
            <a
              href={timetable.file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View/Download
            </a>
            <CustomButton
              variant="danger"
              size="sm"
              onClick={() => onDelete(timetable)}
            >
              Delete
            </CustomButton>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimetableList;
