// backend/controllers/docController.js
import { createDocument, getDocumentsByUser, getAllDocuments, updateDocStatus } from '../models/docModel.js';
import { sendEmail } from '../utils/mailer.js';

export async function uploadDoc(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const user_id = req.user.id;
    const filename = req.file.filename;
    const originalname = req.file.originalname;

    await createDocument({ user_id, filename, originalname });

    const rows = await getDocumentsByUser(user_id);
    res.json({ documents: rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getMyDocs(req, res) {
  try {
    const rows = await getDocumentsByUser(req.user.id);
    res.json({ documents: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getAll(req, res) {
  try {
    const rows = await getAllDocuments();
    res.json({ documents: rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function changeStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, admin_note } = req.body;

    await updateDocStatus(id, status, admin_note || '');

    const docs = await getAllDocuments();
    const doc = docs.find(d => d.id == id);

    if (doc && doc.email) {
      const subject = `Your document status: ${status}`;
      const html = `
        <p>Dear ${doc.name},</p>
        <p>Your document <strong>${doc.originalname}</strong> is now <strong>${status}</strong>.</p>
        <p>Note: ${admin_note || 'No note provided.'}</p>
      `;
      await sendEmail(doc.email, subject, html);
    }

    res.json({ message: 'Status updated' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
