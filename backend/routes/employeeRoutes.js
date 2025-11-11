// /routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const {
    getMyProfile,
    getMyTasks,
    updateTaskProgress
} = require('../controllers/employeeController'); // Make sure controller exists

// Routes are prefixed with /api/employee
router.get('/profile/:id', getMyProfile);
router.get('/tasks/:id', getMyTasks);
router.put('/tasks/:taskId', updateTaskProgress);

// THIS IS THE FIX:
module.exports = router;