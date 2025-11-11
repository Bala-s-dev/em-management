// /routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    createTask,
    getAllTasks,
    updateTask,
    deleteTask
} = require('../controllers/adminController');

// --- Employee Management ---
router.post('/employees', createEmployee);
router.get('/employees', getAllEmployees);
router.get('/employees/:id', getEmployeeById);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

// --- Task Management ---
router.post('/tasks', createTask);
router.get('/tasks', getAllTasks);
router.get('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// THIS IS THE FIX:
module.exports = router;