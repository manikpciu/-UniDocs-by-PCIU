PCIU Student Portal - Updated with Node.js backend (MySQL) and email notifications.

Quick steps (VS Code):
1. Open project folder in VS Code.
2. Open terminal (Ctrl+`).
3. Install dependencies for backend:
   cd server
   npm install
4. Copy .env.example to .env and update values.
5. Create MySQL database (name matching DB_NAME in .env).
6. Start backend:
   node server.js   (or npm run dev with nodemon)
7. Frontend: open your original HTML files (they're untouched) in browser.
   Frontend calls API endpoints at http://localhost:5000/api/...

Notes:
- The original frontend design is left unchanged; new backend files were added under /server.
- For email notifications, generate a Gmail App Password and set EMAIL_USER and EMAIL_PASS in .env.
- If you want, I can integrate API calls into your frontend, but per your request I did NOT modify original client files.
