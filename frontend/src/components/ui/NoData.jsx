const NoData = ({ title, message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full my-20 text-center">
      <img
        src="/assets/empty.svg"
        alt="No data found"
        className="w-64 h-64 mb-4"
      />
      <h3 className="text-xl font-semibold text-gray-800">
        {title || 'No Data Found'}
      </h3>
      <p className="text-gray-500 mt-2">
        {message || 'There is nothing to show here yet.'}
      </p>
    </div>
  );
};

export default NoData;
