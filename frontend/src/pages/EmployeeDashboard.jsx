import React from 'react';
import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import EmployeeTaskItem from '../components/employee/EmployeeTaskItem';

function EmployeeDashboard() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/employee/profile/${auth.userId}`);
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/employee/tasks/${auth.userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const onTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.task_id === updatedTask.task_id ? updatedTask : task
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProfile(), fetchTasks()]).then(() => {
      setLoading(false);
    });
  }, [auth.userId]);

  if (loading) return <Header title="Loading..." />;

  return (
    <div>
      <Header title={`Welcome, ${profile ? profile.emp_name : 'Employee'}`} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="p-6 bg-white shadow-lg rounded-xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your Profile
              </h2>
              {profile ? (
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-600">Name:</span>{' '}
                    <span className="text-gray-900">{profile.emp_name}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-600">Email:</span>{' '}
                    <span className="text-gray-900">{profile.emp_email}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-600">Place:</span>{' '}
                    <span className="text-gray-900">
                      {profile.emp_place || 'N/A'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="font-medium text-gray-600">DOB:</span>{' '}
                    <span className="text-gray-900">
                      {profile.emp_dob
                        ? new Date(profile.emp_dob).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </li>
                </ul>
              ) : (
                <p>Could not load profile.</p>
              )}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your Tasks
            </h2>
            <div className="space-y-6">
              {tasks.length === 0 ? (
                <p className="p-6 bg-white shadow-lg rounded-xl">
                  You have no tasks assigned.
                </p>
              ) : (
                tasks.map((task) => (
                  <EmployeeTaskItem
                    key={task.task_id}
                    task={task}
                    onTaskUpdate={onTaskUpdate}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default EmployeeDashboard;
