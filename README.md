# PCIU DocTrack — Student Document Management Portal

A full-stack web application for **Port City International University** where students can submit academic documents online and admins can review, approve, or reject them with email notifications.

---

## Features

- Student registration, login & document upload
- Admin dashboard to approve / reject submissions
- Real-time status tracking (Pending → Approved / Rejected)
- Automatic email notification on status change
- Course-wise filtering & submission link generator
- JWT authentication with encrypted passwords

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Auth | JWT + bcryptjs |
| File Upload | Multer |
| Email | Nodemailer (Gmail) |

---

## Quick Setup

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create .env file
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=pciu_portal
JWT_SECRET=your_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
PORT=5000

# 3. Create MySQL database
CREATE DATABASE pciu_portal;

# 4. Start server
node server.js
```

Then open `frontend/pages/index.html` in your browser.

---

## Pages

- `index.html` — Landing page
- `student.html` — Student login & document dashboard
- `admin.html` — Admin panel with review tools

---

> Built for PCIU · Academic Year 2025–26
