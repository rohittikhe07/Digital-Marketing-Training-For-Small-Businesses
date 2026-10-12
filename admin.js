/* admin.js - the Admin portal. Only accounts with the "admin" role can open it.
   Tabs: Overview, Learners, Certificates, Settings (including backup and restore). */
window.DD=window.DD||{};
(function(){
var $=DD.$,$$=DD.$$,ic=DD.ic,esc=DD.esc;
var AD={tab:'overview',q:''};
function S(){return DD.store}
function learners(){return S().users().filter(function(u){return u.role==='learner'})}
function me(){return S().current()}
function refresh(){if(DD.app&&DD.app.renderPage)DD.app.renderPage()}

/* ---------- Overview ---------- */
function overview(){
  var L=learners(),total=L.length;
  var eligible=L.filter(function(u){return S().eligible(u)}).length;
  var certs=S().db().certs,valid=certs.filter(function(c){return !c.revoked}).length;
  var pts=0,max=0;
  L.forEach(function(u){var p=S().prog(u);DD.LESSONS.forEach(function(les){if(p.scores[les.id]!=null){pts+=p.scores[les.id];max+=les.quiz.length}})});
  var avg=max?Math.round(pts/max*100)+'%':'–';
  var recent=L.slice().sort(function(a,b){return a.created<b.created?1:-1}).slice(0,5);
  function tile(v,l,i){return '<div class="stat tile"><span class="sico">'+ic(i,20)+'</span><div class="v">'+v+'</div><div class="l">'+l+'</div></div>'}
  var bars=DD.LESSONS.map(function(les,i){
    var n=L.filter(function(u){return S().prog(u).done[les.id]}).length,pct=total?Math.round(n/total*100):0;
    return '<div class="brow wide"><span>'+(i+1)+'. '+les.title+'</span><span class="btrack"><i style="width:'+pct+'%;background:var(--brand)"></i></span><span>'+n+'/'+total+'</span></div>';
  }).join('');
  return (me().mustChange?'<div class="banner warn">'+ic('info',20)+'<span>You are still using the default admin password. Open the Settings tab and change it.</span></div>':'')+
  '<div class="tiles">'+tile(total,'Registered learners','users')+tile(eligible,'Eligible for certificate','award')+tile(valid,'Certificates issued','shield')+tile(avg,'Average quiz score','chart')+'</div>'+
  '<div class="two">'+
   '<section class="card"><h2>Lesson completion</h2><p class="sub">How many learners finished each lesson.</p><div class="bars">'+bars+'</div></section>'+
   '<section class="card"><h2>Newest learners</h2>'+(recent.length?'<ul class="plain">'+recent.map(function(u){return '<li><span><b>'+esc(u.name)+'</b><br><span class="muted">'+esc(u.email)+'</span></span><span class="muted">'+DD.fmtShort(u.created)+'</span></li>'}).join('')+'</ul>':'<p class="empty">No learners yet. Ask a student to register on the login page.</p>')+
   '<p class="note" style="margin-top:14px">Accounts and progress are stored in this browser only. Use Settings → Backup to move the data to another computer.</p></section></div>';
}

/* ---------- Learners ---------- */
function rows(){
  var q=AD.q.trim().toLowerCase();
  var L=S().users().filter(function(u){return !q||u.name.toLowerCase().indexOf(q)>-1||u.email.indexOf(q)>-1||(u.phone||'').indexOf(q)>-1});
  if(!L.length)return '<tr><td colspan="6" class="empty">No learners match your search.</td></tr>';
  return L.map(function(u){
    var n=S().doneCount(u),c=S().certFor(u.id);
    var cert=c?(c.revoked?'<span class="tag bad">Revoked</span>':'<span class="tag good">Issued</span>'):(S().eligible(u)?'<span class="tag warn">Not generated</span>':'<span class="tag">Not yet</span>');
    return '<tr><td><b>'+esc(u.name)+'</b>'+(u.role==='admin'?' <span class="tag brand">Admin</span>':'')+'<br><span class="muted">'+esc(u.email)+'</span></td>'+
      '<td>'+esc((DD.BIZ[u.biz]||{}).label||'')+'</td><td>'+DD.fmtShort(u.created)+'</td>'+
      '<td><div class="mprog"><span class="btrack"><i style="width:'+(n/DD.LESSONS.length*100)+'%;background:var(--brand)"></i></span><span>'+n+'/'+DD.LESSONS.length+'</span></div></td>'+
      '<td>'+cert+'</td><td><button class="btn mini" data-act="adview" data-id="'+u.id+'">'+ic('eye',16)+'View</button></td></tr>';
  }).join('');
}
function learnersTab(){
  return '<section class="card"><div class="toolbar"><label class="field grow" for="adq"><span class="sr">Search</span><input id="adq" type="search" placeholder="Search by name, email or phone" value="'+esc(AD.q)+'"></label>'+
   '<button class="btn" data-act="adcsv">'+ic('download',18)+'Download CSV</button></div>'+
   '<div class="tablewrap"><table class="table"><thead><tr><th>Learner</th><th>Business</th><th>Joined</th><th>Progress</th><th>Certificate</th><th><span class="sr">Actions</span></th></tr></thead><tbody id="adrows">'+rows()+'</tbody></table></div></section>';
}
function openLearner(id){
  var u=S().byId(id);if(!u){DD.closeModal();return}
  var p=S().prog(u),c=S().certFor(u.id),self=me().id===u.id;
  var html='<div class="kv">'+
   '<div><span class="muted">Email</span><b>'+esc(u.email)+'</b></div><div><span class="muted">Phone</span><b>'+(esc(u.phone)||'–')+'</b></div>'+
   '<div><span class="muted">Business</span><b>'+esc((DD.BIZ[u.biz]||{}).label||'')+'</b></div><div><span class="muted">Role</span><b>'+(u.role==='admin'?'Admin':'Learner')+'</b></div>'+
   '<div><span class="muted">Joined</span><b>'+DD.fmtShort(u.created)+'</b></div><div><span class="muted">Last login</span><b>'+(u.lastLogin?DD.fmtShort(u.lastLogin):'–')+'</b></div></div>'+
   '<h3 class="h3">Progress</h3><ul class="plain">'+DD.LESSONS.map(function(L,i){
     var ok=p.done[L.id],sc=p.scores[L.id];
     return '<li><span>'+(i+1)+'. '+L.title+'</span><span class="'+(ok?'good':'muted')+'">'+(ok?'Complete':'Not complete')+(sc!=null?' · quiz '+sc+'/'+L.quiz.length:'')+'</span></li>'}).join('')+'</ul>'+
   '<h3 class="h3">Certificate</h3>'+(c?'<p>ID <b class="mono">'+c.id+'</b> · '+(c.revoked?'<span class="bad">Revoked</span>':'<span class="good">Valid</span>')+' · issued '+DD.fmtShort(c.issued)+'</p>':'<p class="muted">No certificate generated yet.</p>')+
   '<h3 class="h3">Actions</h3><div class="row">'+
   '<button class="btn" data-act="adall" data-id="'+u.id+'">Mark all lessons complete (demo)</button>'+
   '<button class="btn" data-act="adreset" data-id="'+u.id+'">Reset progress</button>'+
   (u.role==='learner'?'<button class="btn" data-act="adrole" data-id="'+u.id+'">Make admin</button>':(!self?'<button class="btn" data-act="adrole" data-id="'+u.id+'">Make learner</button>':''))+
   (!self?'<button class="btn danger" data-act="addel" data-id="'+u.id+'">'+ic('trash',16)+'Delete account</button>':'')+'</div>'+
   '<form id="adpwform" class="inline" data-id="'+u.id+'" style="margin-top:16px"><label class="field grow" for="adpw">Set a new password for this learner<input id="adpw" type="text" autocomplete="off" placeholder="New password"></label><button class="btn" type="submit">Save password</button></form><p class="errline" id="adpwerr" role="alert"></p>';
  DD.modal(u.name,html,true);
}

/* ---------- Certificates ---------- */
function certsTab(){
  var cs=S().db().certs.slice().sort(function(a,b){return a.issued<b.issued?1:-1});
  return '<section class="card"><div class="tablewrap"><table class="table"><thead><tr><th>Certificate ID</th><th>Name</th><th>Institute</th><th>Issued</th><th>Status</th><th><span class="sr">Actions</span></th></tr></thead><tbody>'+
   (cs.length?cs.map(function(c){
     return '<tr><td class="mono">'+c.id+'</td><td><b>'+esc(c.name)+'</b><br><span class="muted">'+esc(c.email||'')+'</span></td><td>'+(esc(c.institute)||'–')+'</td><td>'+DD.fmtShort(c.issued)+'</td>'+
      '<td>'+(c.revoked?'<span class="tag bad">Revoked</span>':'<span class="tag good">Valid</span>')+'</td>'+
      '<td><div class="row"><button class="btn mini" data-act="adcert" data-id="'+c.id+'">'+ic('eye',16)+'View</button><button class="btn mini" data-act="adrevoke" data-id="'+c.id+'">'+(c.revoked?'Reinstate':'Revoke')+'</button></div></td></tr>';
   }).join(''):'<tr><td colspan="6" class="empty">No certificates yet. They appear here when learners generate them.</td></tr>')+
   '</tbody></table></div></section>';
}
function openCert(id){
  var c=S().findCert(id);if(!c)return;
  var body=DD.modal('Certificate '+c.id,'<canvas id="admincanvas" class="certcanvas" aria-label="Certificate preview"></canvas><div class="row" style="margin-top:14px"><button class="btn primary" data-act="admindl" data-id="'+c.id+'">'+ic('download',18)+'Download PNG</button><button class="btn" data-act="adprint" data-id="'+c.id+'">'+ic('print',18)+'Print or save as PDF</button></div>',true);
  DD.cert.draw($('#admincanvas'),c);
}

/* ---------- Settings ---------- */
function settingsTab(){
  var s=S().settings();
  return '<div class="two"><section class="card"><h2>Course and certificate</h2><p class="sub">These details are printed on new certificates.</p>'+
   '<form id="setform" class="stack"><label class="field" for="s-org">Organisation name<input id="s-org" value="'+esc(s.org)+'" maxlength="70" required></label>'+
   '<label class="field" for="s-course">Course name<input id="s-course" value="'+esc(s.course)+'" maxlength="70" required></label>'+
   '<label class="field" for="s-signer">Signatory name<input id="s-signer" value="'+esc(s.signer)+'" maxlength="50" required></label>'+
   '<label class="field" for="s-title">Signatory title<input id="s-title" value="'+esc(s.signerTitle)+'" maxlength="50" required></label>'+
   '<label class="field" for="s-req">Lessons needed for a certificate<select id="s-req">'+DD.LESSONS.map(function(L,i){return '<option value="'+(i+1)+'"'+(S().required()===i+1?' selected':'')+'>'+(i+1)+(i+1===DD.LESSONS.length?' (all lessons)':'')+'</option>'}).join('')+'</select></label>'+
   '<div><button class="btn primary" type="submit">Save settings</button></div></form></section>'+
  '<div class="stack"><section class="card"><h2>Change my password</h2><form id="mypwform" class="stack"><label class="field" for="mp-old">Current password<input id="mp-old" type="password" autocomplete="current-password"></label><label class="field" for="mp-new">New password<input id="mp-new" type="password" autocomplete="new-password"></label><p class="errline" id="mp-err" role="alert"></p><div><button class="btn primary" type="submit">Update password</button></div></form></section>'+
  '<section class="card"><h2>Data and backup</h2><p class="sub">All data lives in this browser. Download a backup before clearing browser data or changing computer.</p>'+
   '<div class="row"><button class="btn" data-act="adbackup">'+ic('download',18)+'Download backup</button><label class="btn" for="adimport">Restore backup</label><input id="adimport" type="file" accept="application/json,.json" class="sr"></div>'+
   '<div class="row" style="margin-top:12px"><button class="btn danger" data-act="adwipe">'+ic('trash',16)+'Erase all data</button></div></section></div></div>';
}

/* ---------- view ---------- */
function view(){
  var tabs=[['overview','Overview','chart'],['learners','Learners','users'],['certs','Certificates','award'],['settings','Settings','sliders']];
  var body=AD.tab==='overview'?overview():AD.tab==='learners'?learnersTab():AD.tab==='certs'?certsTab():settingsTab();
  return '<header class="lhead"><p class="eyebrow mono">Admin portal</p><h1>Manage the course</h1><p class="lede">See who has registered, check progress, and manage certificates.</p></header>'+
  '<div class="tabs" role="tablist" aria-label="Admin sections">'+tabs.map(function(t){return '<button class="tab" role="tab" aria-selected="'+(AD.tab===t[0])+'" data-act="adtab" data-tab="'+t[0]+'">'+ic(t[2],18)+t[1]+'</button>'}).join('')+'</div>'+body;
}

/* ---------- actions ---------- */
var A=DD.actions,F=DD.forms;
function csvCell(v){v=String(v==null?'':v);return '"'+v.replace(/"/g,'""')+'"'}
A.adtab=function(t){AD.tab=t.getAttribute('data-tab');refresh()};
A.adview=function(t){openLearner(t.getAttribute('data-id'))};
A.adcsv=function(){
  var head=['Name','Email','Phone','Business','Role','Joined','Lessons completed','Certificate ID','Certificate status'];
  var lines=[head.map(csvCell).join(',')];
  S().users().forEach(function(u){
    var c=S().certFor(u.id);
    lines.push([u.name,u.email,u.phone,(DD.BIZ[u.biz]||{}).label,u.role,u.created.slice(0,10),S().doneCount(u)+'/'+DD.LESSONS.length,c?c.id:'',c?(c.revoked?'Revoked':'Valid'):''].map(csvCell).join(','));
  });
  DD.download('learners.csv','﻿'+lines.join('\r\n'),'text/csv');
  DD.toast('Learner list downloaded');
};
A.adall=function(t){
  var u=S().byId(t.getAttribute('data-id'));if(!u)return;
  var p=S().prog(u);
  DD.LESSONS.forEach(function(L){p.done[L.id]=true;if(p.scores[L.id]==null)p.scores[L.id]=L.quiz.length});
  S().save();DD.toast('All lessons marked complete');openLearner(u.id);refresh();
};
A.adreset=function(t){
  var u=S().byId(t.getAttribute('data-id'));if(!u)return;
  if(t.getAttribute('data-sure')!=='1'){t.setAttribute('data-sure','1');t.textContent='Click again to reset';return}
  u.progress={done:{},scores:{},check:{},posts:5};S().save();DD.toast('Progress reset');openLearner(u.id);refresh();
};
A.adrole=function(t){
  var u=S().byId(t.getAttribute('data-id'));if(!u)return;
  if(u.role==='admin'&&S().adminCount()<=1){DD.toast('There must be at least one admin','bad');return}
  u.role=u.role==='admin'?'learner':'admin';S().save();DD.toast('Role updated');openLearner(u.id);refresh();
};
A.addel=function(t){
  var u=S().byId(t.getAttribute('data-id'));if(!u)return;
  if(t.getAttribute('data-sure')!=='1'){t.setAttribute('data-sure','1');t.textContent='Click again to delete';return}
  S().removeUser(u.id);DD.closeModal();DD.toast('Account deleted');refresh();
};
F.adpwform=function(f){
  var id=f.getAttribute('data-id'),pw=$('#adpw').value;
  S().setPassword(id,pw).then(function(r){
    if(!r.ok){$('#adpwerr').textContent=r.error;return}
    DD.toast('Password updated');DD.closeModal();
  });
};
A.adcert=function(t){openCert(t.getAttribute('data-id'))};
A.adrevoke=function(t){
  var c=S().findCert(t.getAttribute('data-id'));if(!c)return;
  c.revoked=!c.revoked;S().save();DD.toast(c.revoked?'Certificate revoked':'Certificate reinstated');refresh();
};
A.admindl=function(t){var c=S().findCert(t.getAttribute('data-id'));if(c)DD.cert.download($('#admincanvas'),c)};
A.adprint=function(){DD.cert.print($('#admincanvas'))};
F.setform=function(){
  var s=S().settings();
  s.org=$('#s-org').value.trim()||s.org;s.course=$('#s-course').value.trim()||s.course;
  s.signer=$('#s-signer').value.trim()||s.signer;s.signerTitle=$('#s-title').value.trim()||s.signerTitle;
  s.required=parseInt($('#s-req').value,10)||DD.LESSONS.length;
  S().save();DD.toast('Settings saved');
};
F.mypwform=function(){
  var u=me(),err=$('#mp-err');err.textContent='';
  S().checkPassword(u.id,$('#mp-old').value).then(function(ok){
    if(!ok){err.textContent='Your current password is not correct.';return}
    S().setPassword(u.id,$('#mp-new').value).then(function(r){
      if(!r.ok){err.textContent=r.error;return}
      DD.toast('Password updated');refresh();
    });
  });
};
A.adbackup=function(){
  DD.download('dukaan-digital-backup-'+new Date().toISOString().slice(0,10)+'.json',S().exportJSON(),'application/json');
  DD.toast('Backup downloaded');
};
A.adwipe=function(){
  DD.modal('Erase all data','<p>This deletes every account, progress record and certificate in this browser, and creates a fresh default admin account. This cannot be undone.</p><div class="row" style="margin-top:16px"><button class="btn danger" data-act="adwipeyes">Yes, erase everything</button><button class="btn" data-act="mclose">Cancel</button></div>');
};
A.adwipeyes=function(){S().resetAll().then(function(){DD.closeModal();DD.toast('All data erased');if(DD.app)DD.app.render()})};
DD.inputs.push(function(t){
  if(t.id==='adq'){AD.q=t.value;var b=$('#adrows');if(b)b.innerHTML=rows()}
});
DD.changes.push(function(t){
  if(t.id==='adimport'&&t.files&&t.files[0]){
    var fr=new FileReader();
    fr.onload=function(){
      var txt=String(fr.result);
      var body=DD.modal('Restore backup','<p>This replaces all accounts, progress and certificates in this browser with the data in <b>'+esc(t.files[0].name)+'</b>.</p><div class="row" style="margin-top:16px"><button class="btn primary" id="doimport">Restore now</button><button class="btn" data-act="mclose">Cancel</button></div>');
      $('#doimport').onclick=function(){
        var r=S().importJSON(txt);
        if(!r.ok){DD.toast(r.error,'bad');return}
        var go=function(){DD.closeModal();DD.toast('Backup restored');if(DD.app)DD.app.render()};
        if(r.noAdmin)S().ensureAdmin().then(go);else go();
      };
    };
    fr.readAsText(t.files[0]);t.value='';
  }
});
DD.admin={view:view};
})();
