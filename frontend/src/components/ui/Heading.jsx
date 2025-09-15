import React from 'react';

const Heading = React.memo((props) => {
  return (
    <div className="flex justify-between items-center w-full">
      <p className="font-semibold text-3xl border-l-8 border-red-500 pl-3">
        {props.title}
      </p>
    </div>
  );
});

export default Heading;
