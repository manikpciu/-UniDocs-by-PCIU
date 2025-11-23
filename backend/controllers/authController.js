import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initDB, getPool } from "../config/db.js";

// Initialize DB
await initDB();
const db = getPool();

// --------------------------------------------
// LOGIN
// --------------------------------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Store full user info inside token so frontend can show properly
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        student_id: user.student_id,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// --------------------------------------------
// REGISTER
// --------------------------------------------
export const register = async (req, res) => {
  try {
    const { name, email, password, student_id, role } = req.body;

    if (!name || !email || !password || !student_id) {
      return res.status(400).json({ error: "All fields required" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, student_id, password, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, student_id, hashed, role || "student"]
    );

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};

// --------------------------------------------
// GET CURRENT USER
// --------------------------------------------
export const me = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, student_id, role FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: rows[0] });

  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
