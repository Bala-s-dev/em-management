const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// --- THE ADMIN TO CREATE ---
const adminEmail = 'admin@company.com';
const adminPassword = 'adminpass123';
// ----------------------------

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'employee_db',
};

async function forceCreateAdmin() {
    console.log('Connecting to database...');
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connected.');

        // 1. DELETE the old user first
        console.log(`Attempting to delete user: ${adminEmail}...`);
        const [deleteResult] = await connection.query(
            'DELETE FROM admins WHERE admin_email = ?',
            [adminEmail]
        );
        if (deleteResult.affectedRows > 0) {
            console.log('...Old admin user deleted successfully.');
        } else {
            console.log('...No old admin user found to delete. That is OK.');
        }

        // 2. Hash the new password
        console.log(`Hashing new password: ${adminPassword}`);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);
        console.log('Password hashed.');

        // 3. Insert the new admin
        await connection.query(
            'INSERT INTO admins (admin_email, admin_password) VALUES (?, ?)',
            [adminEmail, hashedPassword]
        );

        console.log('---------------------------------');
        console.log('✅ Admin user was forcefully created!');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
        console.log('---------------------------------');
        console.log('You can now log in.');

    } catch (err) {
        console.error('Error during force-create:', err.message);
        console.log('Hint: Check your .env file settings (DB_PASSWORD, etc.)');
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

forceCreateAdmin();