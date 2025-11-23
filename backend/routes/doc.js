// backend/routes/doc.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadDoc, getMyDocs, getAll, changeStatus } from '../controllers/docController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random()*1E9) + ext);
  }
});

const upload = multer({ storage });

// FIXED → must match frontend: "document"
router.post('/upload', authMiddleware, upload.single('document'), uploadDoc);

router.get('/my', authMiddleware, getMyDocs);
router.get('/all', authMiddleware, adminOnly, getAll);
router.post('/status/:id', authMiddleware, adminOnly, changeStatus);

export default router;
