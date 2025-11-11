import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Input from '../ui/Input';
import Button from '../ui/Button';

function EmployeeForm({ employeeToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    emp_name: '',
    emp_email: '',
    emp_password: '',
    emp_salary: '',
    emp_dob: '',
    emp_place: '',
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        ...employeeToEdit,
        emp_password: '', // Don't pre-fill password
        emp_dob: employeeToEdit.emp_dob
          ? new Date(employeeToEdit.emp_dob).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        emp_name: '',
        emp_email: '',
        emp_password: '',
        emp_salary: '',
        emp_dob: '',
        emp_place: '',
      });
    }
  }, [employeeToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };
      if (!dataToSubmit.emp_password) delete dataToSubmit.emp_password;
      if (dataToSubmit.emp_salary === '') dataToSubmit.emp_salary = null;
      if (dataToSubmit.emp_dob === '') dataToSubmit.emp_dob = null;

      if (employeeToEdit) {
        await api.put(
          `/admin/employees/${employeeToEdit.emp_id}`,
          dataToSubmit
        );
      } else {
        await api.post('/admin/employees', dataToSubmit);
      }
      onSave();
    } catch (err) {
      console.error('Failed to save employee', err);
      alert('Error: ' + (err.response?.data?.message || 'Failed to save'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h3 className="text-xl font-semibold">
        {employeeToEdit ? 'Edit Employee' : 'Add New Employee'}
      </h3>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Input
          label="Name"
          name="emp_name"
          value={formData.emp_name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="emp_email"
          type="email"
          value={formData.emp_email}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          name="emp_password"
          type="password"
          placeholder={employeeToEdit ? 'Leave blank to keep same' : 'Required'}
          onChange={handleChange}
          required={!employeeToEdit}
        />
        <Input
          label="Salary"
          name="emp_salary"
          type="number"
          value={formData.emp_salary}
          onChange={handleChange}
        />
        <Input
          label="Date of Birth"
          name="emp_dob"
          type="date"
          value={formData.emp_dob}
          onChange={handleChange}
        />
        <Input
          label="Place"
          name="emp_place"
          value={formData.emp_place}
          onChange={handleChange}
        />
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

export default EmployeeForm;
