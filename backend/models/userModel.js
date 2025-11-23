import { getPool } from '../config/db.js';

export async function findUserByEmail(email){
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE email = ?', 
    [email]
  );
  return rows[0];
}

export async function createUser({ name, email, student_id, password, role = 'student' }) {
  const pool = getPool();
  const [res] = await pool.query(
    'INSERT INTO users (name, email, student_id, password, role) VALUES (?,?,?,?,?)',
    [name, email, student_id, password, role]
  );

  return {
    id: res.insertId,
    name,
    email,
    student_id,
    role
  };
}

export async function findUserById(id){
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT id, name, email, student_id, role, created_at FROM users WHERE id = ?', 
    [id]
  );
  return rows[0];
}
