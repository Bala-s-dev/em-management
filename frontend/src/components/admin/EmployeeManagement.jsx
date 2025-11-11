import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import EmployeeForm from './EmployeeForm';

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

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };

  const handleCancel = () => {
    setEditingEmployee(null);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await api.delete(`/admin/employees/${id}`);
        fetchEmployees(); // Refetch
      } catch (err) {
        console.error('Failed to delete employee', err);
      }
    }
  };

  const handleSave = () => {
    setShowModal(false);
    setEditingEmployee(null);
    fetchEmployees(); // Refetch after save
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading employees...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>Add New Employee</Button>
      </div>

      {showModal && (
        <Modal onCancel={handleCancel}>
          <EmployeeForm
            employeeToEdit={editingEmployee}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Modal>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Salary</Th>
              <Th>Place</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.length === 0 ? (
              <tr>
                <Td colSpan="5" className="text-center">
                  No employees found.
                </Td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.emp_id}>
                  <Td>{emp.emp_name}</Td>
                  <Td>{emp.emp_email}</Td>
                  <Td>${Number(emp.emp_salary).toLocaleString()}</Td>
                  <Td>{emp.emp_place}</Td>
                  <Td className="space-x-2">
                    <Button onClick={() => handleEdit(emp)} variant="green">
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(emp.emp_id)}
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

export default EmployeeManagement;
