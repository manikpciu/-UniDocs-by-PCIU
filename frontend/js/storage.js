// storage.js helpers
const LS_USERS_KEY = 'pciu_users';
const LS_DOCS_KEY = 'pciu_documents';
const LS_ACTIVE_USER = 'pciu_active_user';

function loadUsers(){ try{ return JSON.parse(localStorage.getItem(LS_USERS_KEY)) || []; }catch(e){ return []; } }
function saveUsers(u){ localStorage.setItem(LS_USERS_KEY, JSON.stringify(u)); }

function loadDocs(){ try{ return JSON.parse(localStorage.getItem(LS_DOCS_KEY)) || []; }catch(e){ return []; } }
function saveDocs(d){ localStorage.setItem(LS_DOCS_KEY, JSON.stringify(d)); }

function setActiveUser(u){ localStorage.setItem(LS_ACTIVE_USER, JSON.stringify(u)); }
function getActiveUser(){ try{ return JSON.parse(localStorage.getItem(LS_ACTIVE_USER)); }catch(e){ return null; } }

// New helper: save file with Base64
function saveDocument(file, callback){
  const reader = new FileReader();
  reader.onload = function(e){
    let docs = loadDocs();
    docs.push({ name: file.name, data: e.target.result, user: getActiveUser()?.email || "" });
    saveDocs(docs);
    if(callback) callback();
  };
  reader.readAsDataURL(file);
}
