// /server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);       // Admin-specific actions
app.use('/api/employee', employeeRoutes); // Employee-specific actions

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});