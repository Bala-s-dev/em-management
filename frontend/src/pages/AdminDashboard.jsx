import React, { useState } from 'react';
import Header from '../components/common/Header';
import EmployeeManagement from '../components/admin/EmployeeManagement';
import TaskManagement from '../components/admin/TaskManagement';

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md ${
        isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}

function AdminDashboard() {
  const [view, setView] = useState('employees'); // 'employees' or 'tasks'

  return (
    <div>
      <Header title="Admin Dashboard" />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <nav className="flex my-6 space-x-4">
          <TabButton
            label="Manage Employees"
            isActive={view === 'employees'}
            onClick={() => setView('employees')}
          />
          <TabButton
            label="Manage Tasks"
            isActive={view === 'tasks'}
            onClick={() => setView('tasks')}
          />
        </nav>

        <div>
          {view === 'employees' && <EmployeeManagement />}
          {view === 'tasks' && <TaskManagement />}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
