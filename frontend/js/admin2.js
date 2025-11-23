const API = "http://localhost:5000/api";
let token = localStorage.getItem("token_admin") || null;

// Elements
const adminAuth = document.getElementById("admin-auth");
const adminPanel = document.getElementById("admin-panel");
const btnLogin = document.getElementById("btn-admin-login");
const btnLogout = document.getElementById("btn-admin-logout");
const docsTable = document.getElementById("all-docs");
const searchInput = document.getElementById("search-input");
const filterStatus = document.getElementById("filter-status");

// Admin Login
btnLogin.onclick = async () => {
    const user = document.getElementById("admin-name").value.trim();
    const pass = document.getElementById("admin-pass").value.trim();

    if (!user || !pass) return alert("Enter credentials");

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user, password: pass })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error || "Invalid!");

    if (data.user.role !== "admin")
        return alert("You are not an admin!");

    token = data.token;
    localStorage.setItem("token_admin", token);

    adminAuth.classList.add("hidden");
    adminPanel.classList.remove("hidden");

    loadAllDocs();
};

// Logout
btnLogout.onclick = () => {
    localStorage.removeItem("token_admin");
    token = null;
    adminPanel.classList.add("hidden");
    adminAuth.classList.remove("hidden");
};

// Load ALL Documents
async function loadAllDocs() {
    const res = await fetch(`${API}/doc/all`, {
        headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (!res.ok) return alert("Failed to load");

    renderDocs(data.documents);
}

// Render Cards
function renderDocs(list) {
    docsTable.innerHTML = "";

    let search = searchInput.value.toLowerCase();
    let status = filterStatus.value;

    const filtered = list.filter(doc =>
        (status === "" || doc.status === status) &&
        (
            doc.name.toLowerCase().includes(search) ||
            doc.student_id.toLowerCase().includes(search) ||
            doc.originalname.toLowerCase().includes(search)
        )
    );

    if (filtered.length === 0) {
        docsTable.innerHTML = "<p>No documents found.</p>";
        return;
    }

    filtered.forEach(doc => {
        const card = document.createElement("div");
        card.className = "doc-card";

        card.innerHTML = `
            <h3>${doc.originalname}</h3>
            <p><b>Student:</b> ${doc.name} (${doc.student_id})</p>
            <p><b>Email:</b> ${doc.email}</p>
            <p><b>Date:</b> ${doc.created_at}</p>
            <p><b>Status:</b> <span class="status-${doc.status}">
                ${doc.status.toUpperCase()}
            </span></p>

            <p><a href="http://localhost:5000/uploads/${doc.filename}" target="_blank">View File</a></p>

            <textarea id="note-${doc.id}" placeholder="Admin note...">${doc.admin_note || ""}</textarea>

            <button onclick="changeStatus(${doc.id}, 'approved')">Approve</button>
            <button onclick="changeStatus(${doc.id}, 'rejected')" class="reject-btn">Reject</button>
        `;

        docsTable.appendChild(card);
    });
}

// Change status (Approve / Reject)
async function changeStatus(id, status) {
    const note = document.getElementById(`note-${id}`).value;

    const res = await fetch(`${API}/doc/status/${id}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status, admin_note: note })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    alert("Updated!");
    loadAllDocs();
}

// Filters
searchInput.oninput = loadAllDocs;
filterStatus.onchange = loadAllDocs;

// Auto login if token exists
if (token) {
    adminAuth.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    loadAllDocs();
}
