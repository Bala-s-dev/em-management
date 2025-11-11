import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import TaskForm from './TaskForm';
import ProgressBar from '../common/ProgressBar';

// Table Header Cell
function Th({ children }) {
  return (
    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
      {children}
    </th>
  );
}

// Table Data Cell
function Td({ children, className = '' }) {
  return (
    <td
      className={`px-6 py-4 text-sm text-gray-900 whitespace-nowrap ${className}`}
    >
      {children}
    </td>
  );
}

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/admin/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/admin/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), fetchEmployees()]).then(() => {
      setLoading(false);
    });
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingTask(null);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/admin/tasks/${id}`);
        fetchTasks(); // Refetch
      } catch (err) {
        console.error('Failed to delete task', err);
      }
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setEditingTask(null);
    fetchTasks(); // Refetch after save
  };

  if (loading)
    return (
      <p className="text-center text-gray-600">
        Loading tasks and employees...
      </p>
    );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>Add New Task</Button>
      </div>

      {showModal && (
        <Modal onCancel={handleCancel}>
          <TaskForm
            taskToEdit={editingTask}
            employees={employees}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Modal>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Title</Th>
              <Th>Assigned To</Th>
              <Th>Status</Th>
              <Th>Progress</Th>
              <Th>Due Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <tr>
                <Td colSpan="6" className="text-center">
                  No tasks found.
                </Td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.task_id}>
                  <Td>{task.title}</Td>
                  <Td>{task.emp_name || 'Unassigned'}</Td>
                  <Td>{task.status}</Td>
                  <Td>
                    <div className="flex items-center">
                      <div className="w-32">
                        <ProgressBar progress={task.progress} />
                      </div>
                      <span className="ml-2 text-xs">{task.progress}%</span>
                    </div>
                  </Td>
                  <Td>
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString()
                      : 'N/A'}
                  </Td>
                  <Td className="space-x-2">
                    <Button onClick={() => handleEdit(task)} variant="green">
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(task.task_id)}
                      variant="red"
                    >
                      Delete
                    </Button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskManagement;
