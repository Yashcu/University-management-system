import React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

const Loading = React.memo(() => {
  return (
    <div className="w-full h-[40vh] flex justify-center items-center flex-col gap-4">
      <AiOutlineLoading className="animate-spin text-black text-4xl" />
    </div>
  );
});

export default Loading;
