/* store.js - the "database". Everything is saved in this browser (localStorage), nothing is sent to a server.
   It handles: accounts (register / login / logout), learner progress, certificates, and admin settings. */
window.DD=window.DD||{};
(function(){
var DB_KEY='dukaan-digital-db-v2',SES_KEY='dukaan-digital-session-v2',LOCK_KEY='dukaan-digital-lock-v2';
var DEFAULT_ADMIN={email:'admin@cep.local',password:'Admin@123',name:'Course Admin'};

function defaults(){
  return {users:[],certs:[],nextId:1,settings:{
    org:'CEP Digital Marketing Training',
    course:'Digital Marketing for Small Businesses',
    signer:'Authorised Signatory',
    signerTitle:'Course Coordinator',
    required:6}};
}
var db=null;
function read(){try{var r=localStorage.getItem(DB_KEY);return r?JSON.parse(r):null}catch(e){return null}}
function persist(){try{localStorage.setItem(DB_KEY,JSON.stringify(db));DD.storeError=false}catch(e){DD.storeError=true}}
function fixShape(){
  var d=defaults();
  Object.keys(d).forEach(function(k){if(db[k]==null)db[k]=d[k]});
  Object.keys(d.settings).forEach(function(k){if(db.settings[k]==null)db.settings[k]=d.settings[k]});
}
db=read()||defaults();fixShape();

/* ----- passwords: never stored as plain text. A random salt plus PBKDF2 (slow hash) is saved instead ----- */
function toHex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(b){return ('0'+b.toString(16)).slice(-2)}).join('')}
function randomHex(n){
  var a=new Uint8Array(n);
  if(window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(a);
  else for(var i=0;i<n;i++)a[i]=Math.floor(Math.random()*256);
  return toHex(a);
}
function basicHash(s){
  var h1=0xdeadbeef,h2=0x41c6ce57,ch;
  for(var i=0;i<s.length;i++){ch=s.charCodeAt(i);h1=Math.imul(h1^ch,2654435761);h2=Math.imul(h2^ch,1597334677)}
  h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);
  h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);
  return (4294967296*(2097151&h2)+(h1>>>0)).toString(16);
}
function hashPw(pw,salt){
  var subtle=window.crypto&&window.crypto.subtle;
  if(subtle&&window.TextEncoder){
    var enc=new TextEncoder();
    return subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits'])
      .then(function(k){return subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:60000,hash:'SHA-256'},k,256)})
      .then(function(b){return 'pbkdf2:'+toHex(b)});
  }
  return Promise.resolve('basic:'+basicHash(salt+pw));
}
function newId(p){return p+Date.now().toString(36)+randomHex(3)}

/* ----- validation ----- */
function validEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}
function validPw(p){return typeof p==='string'&&p.length>=8&&/[A-Za-z]/.test(p)&&/\d/.test(p)}
var PW_RULE='Password needs at least 8 characters, with letters and numbers.';

function findByEmail(email){email=(email||'').trim().toLowerCase();return db.users.filter(function(u){return u.email===email})[0]}
function findById(id){return db.users.filter(function(u){return u.id===id})[0]}

/* ----- session (who is logged in on this browser) ----- */
function getSession(){try{return localStorage.getItem(SES_KEY)}catch(e){return null}}
function setSession(id){try{localStorage.setItem(SES_KEY,id)}catch(e){}}
function clearSession(){try{localStorage.removeItem(SES_KEY)}catch(e){}}
function current(){var id=getSession();var u=id&&findById(id);if(id&&!u)clearSession();return u||null}

/* ----- lock after 5 wrong passwords (1 minute) ----- */
function lockRead(){try{return JSON.parse(localStorage.getItem(LOCK_KEY))||{}}catch(e){return {}}}
function lockWrite(o){try{localStorage.setItem(LOCK_KEY,JSON.stringify(o))}catch(e){}}
function lockFail(email){var o=lockRead(),r=o[email]||{n:0};r.n++;if(r.n>=5){r.until=Date.now()+60000;r.n=0}o[email]=r;lockWrite(o)}
function lockClear(email){var o=lockRead();delete o[email];lockWrite(o)}

/* ----- register / login ----- */
function register(o){
  var name=(o.name||'').trim(),email=(o.email||'').trim().toLowerCase();
  if(name.length<2)return Promise.resolve({ok:false,error:'Please enter your full name.'});
  if(!validEmail(email))return Promise.resolve({ok:false,error:'Please enter a valid email address.'});
  if(!validPw(o.password))return Promise.resolve({ok:false,error:PW_RULE});
  if(o.password!==o.confirm)return Promise.resolve({ok:false,error:'The two passwords do not match.'});
  if(findByEmail(email))return Promise.resolve({ok:false,error:'This email is already registered. Please log in.'});
  var salt=randomHex(16);
  return hashPw(o.password,salt).then(function(h){
    var u={id:newId('u'),name:name,email:email,phone:(o.phone||'').trim(),biz:o.biz||'kirana',role:'learner',salt:salt,hash:h,
      created:new Date().toISOString(),lastLogin:new Date().toISOString(),
      progress:{done:{},scores:{},check:{},posts:5},profile:{institute:'',city:'',batch:''}};
    db.users.push(u);persist();setSession(u.id);
    return {ok:true,user:u};
  });
}
function login(email,pw){
  email=(email||'').trim().toLowerCase();
  var lk=lockRead()[email];
  if(lk&&lk.until&&Date.now()<lk.until)return Promise.resolve({ok:false,error:'Too many wrong attempts. Please try again in '+Math.ceil((lk.until-Date.now())/1000)+' seconds.'});
  var u=findByEmail(email);
  var bad={ok:false,error:'Email or password is not correct.'};
  if(!u){lockFail(email);return Promise.resolve(bad)}
  return hashPw(pw,u.salt).then(function(h){
    if(h!==u.hash){lockFail(email);return bad}
    lockClear(email);u.lastLogin=new Date().toISOString();persist();setSession(u.id);
    return {ok:true,user:u};
  });
}
function logout(){clearSession()}
function setPassword(id,pw){
  var u=findById(id);if(!u)return Promise.resolve({ok:false,error:'User not found.'});
  if(!validPw(pw))return Promise.resolve({ok:false,error:PW_RULE});
  u.salt=randomHex(16);
  return hashPw(pw,u.salt).then(function(h){u.hash=h;u.mustChange=false;persist();return {ok:true}});
}
function checkPassword(id,pw){var u=findById(id);if(!u)return Promise.resolve(false);return hashPw(pw,u.salt).then(function(h){return h===u.hash})}

/* ----- first run: create the default admin account ----- */
function ensureAdmin(){
  return new Promise(function(resolve){
    if(db.users.some(function(u){return u.role==='admin'}))return resolve();
    var salt=randomHex(16);
    hashPw(DEFAULT_ADMIN.password,salt).then(function(h){
      var old=findByEmail(DEFAULT_ADMIN.email);
      if(old){old.role='admin';old.salt=salt;old.hash=h;old.mustChange=true}
      else db.users.push({id:newId('u'),name:DEFAULT_ADMIN.name,email:DEFAULT_ADMIN.email,phone:'',biz:'kirana',role:'admin',salt:salt,hash:h,mustChange:true,
        created:new Date().toISOString(),lastLogin:null,progress:{done:{},scores:{},check:{},posts:5},profile:{institute:'',city:'',batch:''}});
      persist();resolve();
    });
  });
}
var ready=ensureAdmin();

/* ----- progress ----- */
function prog(u){
  if(!u.progress)u.progress={};
  var p=u.progress;p.done=p.done||{};p.scores=p.scores||{};p.check=p.check||{};if(!p.posts)p.posts=5;
  return p;
}
function doneCount(u){var p=prog(u);return DD.LESSONS.filter(function(L){return p.done[L.id]}).length}
function required(){return Math.max(1,Math.min(DD.LESSONS.length,parseInt(db.settings.required,10)||DD.LESSONS.length))}
function eligible(u){return doneCount(u)>=required()}

/* ----- certificates ----- */
var ALPHA='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function newCertId(){
  var id;
  do{
    var s='';for(var i=0;i<6;i++)s+=ALPHA.charAt(Math.floor(Math.random()*ALPHA.length));
    id='DD-'+new Date().getFullYear()+'-'+s;
  }while(findCert(id));
  return id;
}
function certFor(uid){return db.certs.filter(function(c){return c.userId===uid})[0]||null}
function findCert(id){id=(id||'').trim().toUpperCase();return db.certs.filter(function(c){return c.id===id})[0]||null}
function issueCert(u,d){
  var s=db.settings,c=certFor(u.id);
  if(c&&c.revoked)return null;
  if(!c){c={id:newCertId(),userId:u.id,issued:new Date().toISOString(),course:s.course,org:s.org,signer:s.signer,signerTitle:s.signerTitle,lessons:DD.LESSONS.length};db.certs.push(c)}
  c.name=d.name;c.institute=d.institute;c.city=d.city;c.batch=d.batch;c.email=u.email;
  u.profile={institute:d.institute,city:d.city,batch:d.batch};
  persist();return c;
}

/* ----- admin helpers ----- */
function removeUser(id){
  var u=findById(id);if(!u)return false;
  db.users=db.users.filter(function(x){return x.id!==id});
  db.certs=db.certs.filter(function(c){return c.userId!==id});
  persist();return true;
}
function adminCount(){return db.users.filter(function(u){return u.role==='admin'}).length}
function exportJSON(){return JSON.stringify(db,null,2)}
function importJSON(text){
  var o;try{o=JSON.parse(text)}catch(e){return {ok:false,error:'This file is not a valid backup.'}}
  if(!o||!Array.isArray(o.users)||!Array.isArray(o.certs))return {ok:false,error:'This file is not a Dukaan Digital backup.'};
  db=o;fixShape();persist();
  if(!db.users.some(function(u){return u.role==='admin'}))return {ok:true,noAdmin:true};
  return {ok:true};
}
function resetAll(){
  db=defaults();persist();clearSession();
  return ensureAdmin();
}

DD.store={
  ready:ready,ensureAdmin:ensureAdmin,db:function(){return db},save:persist,
  users:function(){return db.users},byId:findById,current:current,
  register:register,login:login,logout:logout,setPassword:setPassword,checkPassword:checkPassword,
  prog:prog,doneCount:doneCount,required:required,eligible:eligible,
  certFor:certFor,findCert:findCert,issueCert:issueCert,
  removeUser:removeUser,adminCount:adminCount,exportJSON:exportJSON,importJSON:importJSON,resetAll:resetAll,
  settings:function(){return db.settings},pwRule:PW_RULE,defaultAdmin:DEFAULT_ADMIN,validPw:validPw
};
})();
