import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import docRoutes from "./routes/doc.js";
import { initDB } from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Initialize Database
initDB()
  .then(() => console.log("✅ Database Connected"))
  .catch((err) => console.error("❌ DB Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doc", docRoutes);

// Default Route
app.get("/", (req, res) => {
  res.json({ message: "PCIU Backend Running..." });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
