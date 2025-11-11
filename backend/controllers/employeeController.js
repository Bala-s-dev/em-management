// /controllers/employeeController.js
const pool = require('../config/db');

// Get the logged-in employee's profile
exports.getMyProfile = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT emp_id, emp_name, emp_email, emp_salary, emp_dob, emp_place FROM employees WHERE emp_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all tasks assigned to the logged-in employee
exports.getMyTasks = async (req, res) => {
    try {
        const [tasks] = await pool.query(
            'SELECT * FROM tasks WHERE assigned_to_emp_id = ?',
            [req.params.id]
        );
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Employee updates their own task progress
exports.updateTaskProgress = async (req, res) => {
    const { taskId } = req.params;
    const { progress, status } = req.body; // Employee sends their new progress (e.g., 50)

    try {
        const [result] = await pool.query(
            'UPDATE tasks SET progress = ?, status = ? WHERE task_id = ?',
            [progress, status, taskId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task progress updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};