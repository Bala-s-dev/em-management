-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

-- Employee Table (as requested, with additions for login)
CREATE TABLE employees (
    emp_id INT AUTO_INCREMENT PRIMARY KEY,
    emp_name VARCHAR(100) NOT NULL,
    emp_email VARCHAR(100) NOT NULL UNIQUE,
    emp_password VARCHAR(255) NOT NULL, -- Hashed password
    emp_salary DECIMAL(10, 2),
    emp_dob DATE,
    emp_place VARCHAR(100)
);

-- Admin Table (for admin login)
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_email VARCHAR(100) NOT NULL UNIQUE,
    admin_password VARCHAR(255) NOT NULL -- Hashed password
);

-- Task Table
CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    progress INT DEFAULT 0, -- A percentage from 0 to 100
    assigned_to_emp_id INT,
    FOREIGN KEY (assigned_to_emp_id) REFERENCES employees(emp_id)
        ON DELETE SET NULL -- Keep task even if employee is deleted
        ON UPDATE CASCADE
);