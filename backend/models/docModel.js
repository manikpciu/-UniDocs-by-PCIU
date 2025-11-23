// backend/models/docModel.js
import { getPool } from '../config/db.js';

export async function createDocument({ user_id, filename, originalname }) {
  const pool = getPool();
  const [res] = await pool.query(
    'INSERT INTO documents (user_id, filename, originalname) VALUES (?,?,?)',
    [user_id, filename, originalname]
  );
  return { id: res.insertId };
}

export async function getDocumentsByUser(user_id) {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
  return rows;
}

export async function getAllDocuments() {
  const pool = getPool();
  const [rows] = await pool.query('SELECT d.*, u.name, u.email FROM documents d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC');
  return rows;
}

export async function updateDocStatus(id, status, admin_note='') {
  const pool = getPool();
  await pool.query('UPDATE documents SET status = ?, admin_note = ? WHERE id = ?', [status, admin_note, id]);
  return true;
}
