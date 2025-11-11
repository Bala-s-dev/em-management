// /routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin, employeeLogin } = require('../controllers/authController');

// Routes are prefixed with /api/auth
router.post('/admin/login', adminLogin);
router.post('/employee/login', employeeLogin);

// THIS IS THE FIX:
module.exports = router;