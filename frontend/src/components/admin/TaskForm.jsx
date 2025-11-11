import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';

function TaskForm({ taskToEdit, employees, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'Pending',
    progress: 0,
    assigned_to_emp_id: '',
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        ...taskToEdit,
        due_date: taskToEdit.due_date
          ? new Date(taskToEdit.due_date).toISOString().split('T')[0]
          : '',
        assigned_to_emp_id: taskToEdit.assigned_to_emp_id || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'Pending',
        progress: 0,
        assigned_to_emp_id: '',
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'progress' && {
        status:
          value == 100 ? 'Completed' : value > 0 ? 'In Progress' : 'Pending',
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        due_date: formData.due_date === '' ? null : formData.due_date,
        assigned_to_emp_id:
          formData.assigned_to_emp_id === ''
            ? null
            : formData.assigned_to_emp_id,
      };

      if (taskToEdit) {
        await api.put(`/admin/tasks/${taskToEdit.task_id}`, dataToSubmit);
      } else {
        await api.post('/admin/tasks', dataToSubmit);
      }
      onSave();
    } catch (err) {
      console.error('Failed to save task', err);
      alert('Error: ' + (err.response?.data?.message || 'Failed to save'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">
        {taskToEdit ? 'Edit Task' : 'Add New Task'}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assign To
          </label>
          <select
            name="assigned_to_emp_id"
            value={formData.assigned_to_emp_id}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.emp_id} value={emp.emp_id}>
                {emp.emp_name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        <Input
          label="Due Date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Progress: {formData.progress}%
          </label>
          <input
            type="range"
            name="progress"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      <div className="flex justify-end pt-4 space-x-3">
        <Button onClick={onCancel} variant="gray">
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

export default TaskForm;
