import React, { useState } from 'react';
import api from '../../services/api';
import ProgressBar from '../common/ProgressBar';

function EmployeeTaskItem({ task, onTaskUpdate }) {
  const [currentProgress, setCurrentProgress] = useState(task.progress);

  const handleProgressChange = (e) => {
    setCurrentProgress(Number(e.target.value));
  };

  const handleUpdateTask = async () => {
    if (currentProgress === task.progress) return;

    const newStatus =
      currentProgress == 100
        ? 'Completed'
        : currentProgress > 0
        ? 'In Progress'
        : 'Pending';

    try {
      await api.put(`/employee/tasks/${task.task_id}`, {
        progress: currentProgress,
        status: newStatus,
      });
      onTaskUpdate({ ...task, progress: currentProgress, status: newStatus });
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update progress.');
      setCurrentProgress(task.progress); // Revert on failure
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
        <span
          className={`mt-2 sm:mt-0 px-3 py-1 text-xs font-medium rounded-full ${
            task.status === 'Completed'
              ? 'bg-green-100 text-green-800'
              : task.status === 'In Progress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {task.status}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">
        {task.description || 'No description.'}
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Due:{' '}
        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
      </p>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium text-gray-700">
            Update Progress
          </label>
          <span className="text-sm font-bold text-blue-600">
            {currentProgress}%
          </span>
        </div>
        <ProgressBar progress={currentProgress} />
        <input
          type="range"
          min="0"
          max="100"
          value={currentProgress}
          onChange={handleProgressChange}
          onMouseUp={handleUpdateTask} // Update when user releases slider
          onTouchEnd={handleUpdateTask} // For mobile
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
        />
      </div>
    </div>
  );
}

export default EmployeeTaskItem;
