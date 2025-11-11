// /controllers/adminController.js
const pool = require('../config/db');
const bcrypt = require('bcryptjs'); // We'll need this to hash passwords

// --- EMPLOYEE MANAGEMENT ---

// POST /api/admin/employees - Create a new employee
exports.createEmployee = async (req, res) => {
    const { emp_name, emp_email, emp_password, emp_salary, emp_dob, emp_place } = req.body;

    // Basic validation
    if (!emp_name || !emp_email || !emp_password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    try {
        // Check if employee already exists
        const [existing] = await pool.query('SELECT emp_email FROM employees WHERE emp_email = ?', [emp_email]);
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Employee with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(emp_password, salt);

        // Insert new employee
        const [result] = await pool.query(
            'INSERT INTO employees (emp_name, emp_email, emp_password, emp_salary, emp_dob, emp_place) VALUES (?, ?, ?, ?, ?, ?)',
            [emp_name, emp_email, hashedPassword, emp_salary, emp_dob, emp_place]
        );

        res.status(201).json({
            message: 'Employee created successfully',
            emp_id: result.insertId
        });

    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /api/admin/employees - Get all employees
exports.getAllEmployees = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT emp_id, emp_name, emp_email, emp_salary, emp_dob, emp_place FROM employees');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /api/admin/employees/:id - Get a single employee
exports.getEmployeeById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT emp_id, emp_name, emp_email, emp_salary, emp_dob, emp_place FROM employees WHERE emp_id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// PUT /api/admin/employees/:id - Update an employee
exports.updateEmployee = async (req, res) => {
    const { emp_name, emp_email, emp_salary, emp_dob, emp_place } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE employees SET emp_name = ?, emp_email = ?, emp_salary = ?, emp_dob = ?, emp_place = ? WHERE emp_id = ?',
            [emp_name, emp_email, emp_salary, emp_dob, emp_place, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// DELETE /api/admin/employees/:id - Delete an employee
exports.deleteEmployee = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM employees WHERE emp_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// --- TASK MANAGEMENT ---

// POST /api/admin/tasks - Create a new task
exports.createTask = async (req, res) => {
    const { title, description, due_date, assigned_to_emp_id } = req.body;

    if (!title || !assigned_to_emp_id) {
        return res.status(400).json({ message: 'Title and assigned employee ID are required.' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO tasks (title, description, due_date, assigned_to_emp_id) VALUES (?, ?, ?, ?)',
            [title, description, due_date, assigned_to_emp_id]
        );
        res.status(201).json({ message: 'Task created successfully', task_id: result.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /api/admin/tasks - Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        // Join with employees table to get the employee's name
        const [tasks] = await pool.query(`
      SELECT t.*, e.emp_name 
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to_emp_id = e.emp_id
      ORDER BY t.due_date DESC
    `);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// PUT /api/admin/tasks/:id - Update a task (Admin can update anything)
exports.updateTask = async (req, res) => {
    const { title, description, due_date, status, progress, assigned_to_emp_id } = req.body;

    try {
        const [result] = await pool.query(
            'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ?, progress = ?, assigned_to_emp_id = ? WHERE task_id = ?',
            [title, description, due_date, status, progress, assigned_to_emp_id, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// DELETE /api/admin/tasks/:id - Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM tasks WHERE task_id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};