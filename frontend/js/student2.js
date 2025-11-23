// student2.js with drag-drop
document.addEventListener('DOMContentLoaded', ()=>{
  const goRegister = document.getElementById('go-register');
  const goLogin = document.getElementById('go-login');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const authTitle = document.getElementById('auth-title');
  const btnLogin = document.getElementById('btn-student-login');
  const btnRegister = document.getElementById('btn-student-register');
  const dashboard = document.getElementById('dashboard');
  const authArea = document.getElementById('auth-area');
  const btnLogout = document.getElementById('btn-logout');
  const sName = document.getElementById('s-name');
  const sId = document.getElementById('s-id');
  const sEmail = document.getElementById('s-email');
  const myDocs = document.getElementById('my-docs');
  const dropArea = document.getElementById('drop-area');
  const pickFile = document.getElementById('pick-file');

  function showLogin(){ registerForm.classList.add('hidden'); loginForm.classList.remove('hidden'); authTitle.textContent='Student Login'; }
  function showRegister(){ loginForm.classList.add('hidden'); registerForm.classList.remove('hidden'); authTitle.textContent='Create Account'; }
  if(goRegister) goRegister.addEventListener('click', e=>{ e.preventDefault(); showRegister(); });
  if(goLogin) goLogin.addEventListener('click', e=>{ e.preventDefault(); showLogin(); });

  const user = getActiveUser();
  if(user){ showDashboard(user); }

  if(btnLogin) btnLogin.addEventListener('click', ()=>{
    const idf=document.getElementById('login-identifier').value.trim().toLowerCase();
    const pass=document.getElementById('login-password').value;
    if(!idf || !pass){ alert('Enter credentials'); return; }
    const users = loadUsers();
    const u = users.find(x=> (x.email.toLowerCase()===idf || x.username.toLowerCase()===idf) && x.password===pass);
    if(!u){ alert('Invalid credentials'); return; }
    setActiveUser(u); showDashboard(u);
  });

  if(btnRegister) btnRegister.addEventListener('click', ()=>{
    const name=document.getElementById('reg-name').value.trim();
    const sid=document.getElementById('reg-id').value.trim();
    const email=document.getElementById('reg-email').value.trim();
    const pass=document.getElementById('reg-pass').value;
    if(!name||!sid||!email||!pass){ alert('Fill all fields'); return; }
    if(!isPciuEmail(email)){ alert('Use PCIU email'); return; }
    const users = loadUsers();
    if(users.some(x=>x.email.toLowerCase()===email.toLowerCase())){ alert('Email exists'); return; }
    const username = email.split('@')[0];
    const u = { id: uid(), name, studentId: sid, email, username, password: pass, role:'student' };
    users.push(u); saveUsers(users);
    alert('Account created. Login now.'); showLogin();
  });

  if(btnLogout) btnLogout.addEventListener('click', ()=>{ clearActiveUser(); location.reload(); });

  function prevent(e){ e.preventDefault(); e.stopPropagation(); }
  ['dragenter','dragover','dragleave','drop'].forEach(evt=> dropArea.addEventListener(evt, prevent));
  dropArea.addEventListener('dragover', ()=> dropArea.classList.add('dragover'));
  dropArea.addEventListener('dragleave', ()=> dropArea.classList.remove('dragover'));
  dropArea.addEventListener('drop', async (e)=>{
    dropArea.classList.remove('dragover');
    const f = e.dataTransfer.files[0];
    if(f) await handleFileDrop(f);
  });
  pickFile.addEventListener('click', ()=> document.getElementById('doc-file').click());
  document.getElementById('doc-file').addEventListener('change', async (e)=>{ const f=e.target.files[0]; if(f) await handleFileDrop(f); });

  async function handleFileDrop(file){
    const title = document.getElementById('doc-title').value.trim() || file.name;
    const user = getActiveUser();
    if(!user){ alert('Please login'); return; }
    const dataUrl = await fileToDataUrl(file);
    const docs = loadDocs();
    docs.push({ id: uid(), studentId: user.studentId, studentName: user.name, title, filename: file.name, content: dataUrl, uploadedAt: Date.now(), status:'pending', adminNote:'' });
    saveDocs(docs);
    document.getElementById('doc-title').value=''; document.getElementById('doc-file').value='';
    renderMyDocs(user);
    alert('File uploaded. Pending approval.');
  }

  function showDashboard(user){
    authArea.classList.add('hidden');
    dashboard.classList.remove('hidden');
    sName.textContent = user.name; sId.textContent = user.studentId; sEmail.textContent = user.email;
    renderMyDocs(user);
  }

  function renderMyDocs(user){
    const docs = loadDocs().filter(d=>d.studentId===user.studentId).sort((a,b)=>b.uploadedAt - a.uploadedAt);
    myDocs.innerHTML='';
    if(docs.length===0){ myDocs.innerHTML='<div class="t-row"><div>No submissions</div><div>—</div><div>—</div><div>—</div></div>'; return; }
    docs.forEach(d=>{
      const row = document.createElement('div'); row.className='t-row';
      row.innerHTML=`<div>${d.title}</div><div><a href="${d.content}" download="${d.filename}">${d.filename}</a></div><div>${formatDate(d.uploadedAt)}</div><div class="status ${d.status}">${d.status}</div>`;
      myDocs.appendChild(row);
    });
  }
});


// ==== Document Upload & View ====
document.addEventListener("DOMContentLoaded", ()=>{
  const fileInput = document.getElementById("student-upload");
  const fileList = document.getElementById("student-file-list");

  if(fileInput){
    fileInput.addEventListener("change", ()=>{
      const file = fileInput.files[0];
      if(file){
        saveDocument(file, showStudentFiles);
      }
    });
  }

  function showStudentFiles(){
    if(!fileList) return;
    fileList.innerHTML = "";
    const docs = loadDocs().filter(d => d.user === getActiveUser()?.email);
    docs.forEach((doc, idx)=>{
      const div = document.createElement("div");
      div.innerHTML = `<p>${doc.name}</p>
        <button onclick="viewStudentFile(${idx})">View</button>`;
      fileList.appendChild(div);
    });
  }

  window.viewStudentFile = function(index){
    const docs = loadDocs().filter(d => d.user === getActiveUser()?.email);
    const doc = docs[index];
    if(doc){
      const w = window.open();
      w.document.write('<iframe src="'+doc.data+'" width="100%" height="100%"></iframe>');
    }else{
      alert("File not found!");
    }
  }

  showStudentFiles();
});
