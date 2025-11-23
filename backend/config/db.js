import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool;

export async function initDB() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'pciu_student_portal',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(200),
      student_id VARCHAR(50),
      email VARCHAR(255) UNIQUE,
      password VARCHAR(255),
      role ENUM('student','admin') DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      filename VARCHAR(255),
      originalname VARCHAR(255),
      status ENUM('pending','approved','rejected') DEFAULT 'pending',
      admin_note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  return pool;
}

export function getPool() {
  if (!pool) throw new Error('Call initDB first');
  return pool;
}

// ADD THIS LINE ⬇️⬇️⬇️
export default { initDB, getPool };
