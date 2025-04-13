const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',     // Replace with your MySQL username
  password: '2580', // Replace with your MySQL password
  database: 'patient_log', // Replace with your database name
  port: 5555,               // Your custom MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;