// /controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Example: Admin Login
exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM admins WHERE admin_email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.admin_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin.admin_id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: 'admin' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Example: Employee Login
exports.employeeLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM employees WHERE emp_email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const employee = rows[0];
        const isMatch = await bcrypt.compare(password, employee.emp_password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: employee.emp_id, role: 'employee' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: 'employee', emp_id: employee.emp_id });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};