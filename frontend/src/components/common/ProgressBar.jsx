import React from 'react';

function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%`, transition: 'width 0.3s' }}
      ></div>
    </div>
  );
}

export default ProgressBar;
