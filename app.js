/* app.js - the main controller. It decides what to show:
   - not logged in  -> login / register page
   - logged in      -> dashboard, lessons, tools, certificate (and the admin portal for admins) */
window.DD=window.DD||{};
(function(){
var $=DD.$,$$=DD.$$,ic=DD.ic,esc=DD.esc;
var R={page:'dashboard',lesson:null,authTab:'login'};
var A=DD.actions,F=DD.forms;
function S(){return DD.store}
function root(){return $('#root')}

/* ================= render ================= */
function render(){
  DD.lessons.stop();
  var u=S().current();
  if(!u){root().innerHTML=authView();return}
  if(R.page==='admin'&&u.role!=='admin')R.page='dashboard';
  root().innerHTML='<div class="shell"><aside class="side" id="side">'+sideHTML(u)+'</aside><div class="content"><main class="page" id="page"></main></div></div>';
  renderPage();
}
function renderPage(){
  var u=S().current();if(!u){render();return}
  DD.lessons.stop();
  var el=$('#page');if(!el)return;
  if(R.page==='lessons'){
    if(R.lesson){DD.lessons.open(el,R.lesson);return}
    el.innerHTML='<header class="lhead"><p class="eyebrow mono">Lessons</p><h1>Your course</h1><p class="lede">Each lesson has a video, an audio talk, a picture guide and a short quiz. Pass the quiz with two correct answers to complete a lesson.</p></header>'+DD.lessons.list();
  }else if(R.page==='tools'){
    el.innerHTML=DD.tools.view();DD.tools.calc();
  }else if(R.page==='cert'){
    el.innerHTML=certView(u);drawCert(u);
  }else if(R.page==='admin'){
    el.innerHTML=DD.admin.view();
  }else{
    el.innerHTML=dashboard(u);
  }
}
function chrome(){var s=$('#side'),u=S().current();if(s&&u)s.innerHTML=sideHTML(u)}

function sideHTML(u){
  var items=[['dashboard','Dashboard','home'],['lessons','Lessons','book'],['tools','Tools','sliders'],['cert','Certificate','award']];
  if(u.role==='admin')items.push(['admin','Admin portal','shield']);
  var n=S().doneCount(u);
  return '<div class="brand">'+brandMark()+'<span>Dukaan Digital</span></div>'+
  '<nav class="snav" aria-label="Main">'+items.map(function(i){return '<button class="sn" data-act="nav" data-page="'+i[0]+'" aria-current="'+(R.page===i[0])+'">'+ic(i[2],20)+'<span>'+i[1]+'</span></button>'}).join('')+'</nav>'+
  '<div class="sidefoot"><div class="sprog"><span class="mono muted">Progress</span><span class="btrack"><i style="width:'+(n/DD.LESSONS.length*100)+'%;background:var(--brand)"></i></span><span class="muted">'+n+' of '+DD.LESSONS.length+' lessons</span></div>'+
  '<button class="sn small" data-act="about">'+ic('info',18)+'<span>Project guide</span></button>'+
  '<button class="sn small" data-act="verify">'+ic('shield',18)+'<span>Verify a certificate</span></button>'+
  '<div class="me"><span class="avatar">'+esc(u.name.charAt(0).toUpperCase())+'</span><span class="mname"><b>'+esc(u.name)+'</b><span class="muted">'+(u.role==='admin'?'Admin':'Learner')+'</span></span>'+
  '<button class="iconbtn" data-act="logout" aria-label="Log out" title="Log out">'+ic('logout',20)+'</button></div></div>';
}
function brandMark(){return '<span class="logo">'+ic('store',20)+'</span>'}

/* ================= dashboard ================= */
function dashboard(u){
  var p=S().prog(u),n=S().doneCount(u),tot=DD.LESSONS.length,pct=Math.round(n/tot*100);
  var next=DD.LESSONS.filter(function(L){return !p.done[L.id]})[0];
  var c=S().certFor(u.id),req=S().required(),elig=S().eligible(u);
  var pts=0,max=0;DD.LESSONS.forEach(function(L){if(p.scores[L.id]!=null){pts+=p.scores[L.id];max+=L.quiz.length}});
  var avg=max?Math.round(pts/max*100)+'%':'–';
  var circ=2*Math.PI*52,off=circ*(1-n/tot);
  var certText=c?(c.revoked?'Revoked':'Issued'):(elig?'Ready to generate':'Finish '+(req-n)+' more lesson'+(req-n===1?'':'s'));
  var first=u.name.split(/\s+/)[0];
  var cta=elig?'<button class="btn primary" data-act="nav" data-page="cert">'+ic('award',18)+(c?'View my certificate':'Get my certificate')+'</button>':
    (next?'<button class="btn primary" data-act="openlesson" data-id="'+next.id+'">'+ic('play',18)+(n?'Continue: ':'Start: ')+next.title+'</button>':'');
  return '<header class="lhead"><p class="eyebrow mono">Dashboard</p><h1>Hello, '+esc(first)+'</h1><p class="lede">Learn at your own pace. Your progress is saved on your account.</p></header>'+
  '<div class="two dash"><section class="card ringcard"><svg class="ring" viewBox="0 0 120 120" width="132" height="132" role="img" aria-label="'+pct+' percent complete"><circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" stroke-width="10"/><circle cx="60" cy="60" r="52" fill="none" stroke="var(--brand)" stroke-width="10" stroke-linecap="round" stroke-dasharray="'+circ.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 60 60)"/><text x="60" y="66" text-anchor="middle" font-size="26" font-weight="800" fill="currentColor" font-family="inherit">'+pct+'%</text></svg>'+
   '<div class="stack"><h2>'+n+' of '+tot+' lessons complete</h2><p class="muted">'+(elig?'You have finished enough lessons for your certificate.':'Finish '+req+' lesson'+(req===1?'':'s')+' to unlock your certificate.')+'</p><div>'+cta+'</div></div></section>'+
  '<section class="card stack"><h2>Your summary</h2><div class="kv"><div><span class="muted">Quiz average</span><b>'+avg+'</b></div><div><span class="muted">Certificate</span><b>'+certText+'</b></div></div>'+DD.tools.bizChips()+'<p class="muted small">Examples in the lessons change to match your business.</p></section></div>'+
  '<section class="sect"><h2>Lessons</h2>'+DD.lessons.list()+'</section>';
}

/* ================= certificate page ================= */
function certView(u){
  var c=S().certFor(u.id),elig=S().eligible(u),n=S().doneCount(u),req=S().required();
  var step2=elig,step3=!!c;
  function step(i,t,done,active){return '<li class="step'+(done?' done':'')+(active?' active':'')+'"><span class="sdot">'+(done?ic('check',16):i)+'</span><span>'+t+'</span></li>'}
  var steps='<ol class="steps">'+step(1,'Finish the lessons',elig,!elig)+step(2,'Fill in your details',!!c,elig&&!c)+step(3,'Download your certificate',!!c,!!c)+'</ol>';
  var head='<header class="lhead"><p class="eyebrow mono">Certificate</p><h1>Your certificate</h1><p class="lede">Finish the lessons, confirm your details, and your certificate is created instantly with a unique ID.</p></header>'+steps;
  if(!elig){
    return head+'<section class="card stack"><h2>Not unlocked yet</h2><p>You have completed <b>'+n+'</b> of the <b>'+req+'</b> lessons needed.</p><div class="prog"><i style="width:'+Math.min(100,n/req*100)+'%"></i></div><div><button class="btn primary" data-act="nav" data-page="lessons">'+ic('book',18)+'Go to lessons</button></div></section>';
  }
  var pr=u.profile||{};
  var form='<form id="certform" class="stack" novalidate>'+
   '<label class="field" for="cf-name">Full name (as it should appear)<input id="cf-name" value="'+esc(c?c.name:u.name)+'" maxlength="60" required autocomplete="name"></label>'+
   '<label class="field" for="cf-email">Email<input id="cf-email" value="'+esc(u.email)+'" readonly></label>'+
   '<label class="field" for="cf-inst">Business or institute name<input id="cf-inst" value="'+esc(c?c.institute:(pr.institute||''))+'" maxlength="70" required placeholder="For example: Sharma Kirana Store"></label>'+
   '<div class="fgrid"><label class="field" for="cf-city">City<input id="cf-city" value="'+esc(c?c.city:(pr.city||''))+'" maxlength="40" autocomplete="address-level2"></label>'+
   '<label class="field" for="cf-batch">Batch or year<input id="cf-batch" value="'+esc(c?c.batch:(pr.batch||''))+'" maxlength="30" placeholder="For example: Batch 2026"></label></div>'+
   '<p class="errline" id="cf-err" role="alert"></p>'+
   '<div><button class="btn primary" type="submit">'+ic('award',18)+(c?'Update certificate':'Generate certificate')+'</button></div></form>';
  if(!c){
    return head+'<section class="card"><h2>Fill in your details</h2><p class="sub">These details are printed on your certificate. Check the spelling of your name.</p>'+form+'</section>';
  }
  return head+'<div class="certlayout"><section class="stack">'+
   (c.revoked?'<div class="banner bad">'+ic('info',20)+'<span>This certificate was revoked by the administrator. Please contact your trainer.</span></div>':'<div class="banner ok">'+ic('check',20)+'<span>Certificate created. ID <b class="mono">'+c.id+'</b></span></div>')+
   '<canvas id="certcanvas" class="certcanvas" aria-label="Your certificate"></canvas>'+
   '<div class="row"><button class="btn primary" data-act="certdl">'+ic('download',18)+'Download as picture (PNG)</button><button class="btn" data-act="certprint">'+ic('print',18)+'Print or save as PDF</button></div>'+
   '<p class="muted small">In the print window, choose “Save as PDF” as the printer to get a PDF file. Anyone can check this certificate with the Verify option using the ID.</p></section>'+
   (c.revoked?'':'<section class="card"><h2>Edit my details</h2><p class="sub">Fixing a spelling mistake keeps the same certificate ID.</p>'+form+'</section>')+'</div>';
}
function drawCert(u){
  var c=S().certFor(u.id),cv=$('#certcanvas');
  if(c&&cv)DD.cert.draw(cv,c);
}

/* ================= login / register page ================= */
function authView(){
  var d=S().defaultAdmin;
  var tab=R.authTab;
  var login='<form id="loginform" class="stack" novalidate>'+
    '<label class="field" for="li-email">Email<input id="li-email" type="email" autocomplete="username" required></label>'+
    '<label class="field" for="li-pw">Password<span class="pwrow"><input id="li-pw" type="password" autocomplete="current-password" required><button type="button" class="iconbtn" data-act="togglepw" data-target="li-pw" aria-label="Show password">'+ic('eye',18)+'</button></span></label>'+
    '<p class="errline" id="autherr" role="alert"></p><button class="btn primary wide" type="submit">Log in</button></form>';
  var reg='<form id="regform" class="stack" novalidate>'+
    '<label class="field" for="rg-name">Full name<input id="rg-name" autocomplete="name" maxlength="60" required></label>'+
    '<label class="field" for="rg-email">Email<input id="rg-email" type="email" autocomplete="email" required></label>'+
    '<div class="fgrid"><label class="field" for="rg-phone">Phone (optional)<input id="rg-phone" type="tel" autocomplete="tel" maxlength="15"></label>'+
    '<label class="field" for="rg-biz">My business<select id="rg-biz">'+Object.keys(DD.BIZ).map(function(k){return '<option value="'+k+'">'+DD.BIZ[k].label+'</option>'}).join('')+'</select></label></div>'+
    '<label class="field" for="rg-pw">Password<span class="pwrow"><input id="rg-pw" type="password" autocomplete="new-password" required><button type="button" class="iconbtn" data-act="togglepw" data-target="rg-pw" aria-label="Show password">'+ic('eye',18)+'</button></span><span class="hint">At least 8 characters, with letters and numbers.</span></label>'+
    '<label class="field" for="rg-pw2">Confirm password<input id="rg-pw2" type="password" autocomplete="new-password" required></label>'+
    '<p class="errline" id="autherr" role="alert"></p><button class="btn primary wide" type="submit">Create my account</button></form>';
  var how=[['user','Register','Create a free account with your email.'],['book','Learn','Watch, listen and see each lesson, then pass the quiz.'],['chart','Practise','Use the post planner and budget calculator.'],['award','Get certified','Fill in your details and download your certificate.']];
  return '<div class="pub">'+
   '<header class="pubtop"><div class="brand">'+brandMark()+'<span>Dukaan Digital</span></div><div class="row"><button class="btn ghost" data-act="about">'+ic('info',18)+'Project guide</button><button class="btn ghost" data-act="verify">'+ic('shield',18)+'Verify a certificate</button></div></header>'+
   '<div class="auth-grid"><section class="auth-copy"><p class="eyebrow mono">Free training for small businesses</p><h1>Get more customers with digital marketing</h1>'+
   '<p class="lede">Short lessons in video, audio and pictures, made for shop owners. Learn Google Maps, WhatsApp, social posts and simple ads, then earn a certificate.</p>'+
   '<ul class="ticks"><li>'+ic('video',20)+'Animated video lessons with captions</li><li>'+ic('headphones',20)+'Audio you can play while you work</li><li>'+ic('image',20)+'Picture guides and quick quizzes</li></ul></section>'+
   '<section class="card auth-card"><div class="seg2" role="tablist"><button role="tab" aria-selected="'+(tab==='login')+'" data-act="authtab" data-tab="login">Log in</button><button role="tab" aria-selected="'+(tab==='register')+'" data-act="authtab" data-tab="register">Register</button></div>'+
   (tab==='login'?login:reg)+
   '<details class="demo"><summary>Teacher or admin demo login</summary><p>Email <b class="mono">'+d.email+'</b><br>Password <b class="mono">'+d.password+'</b></p><p class="muted small">Change this password in Admin portal → Settings.</p><button class="btn mini" type="button" data-act="fillAdmin">Fill in the admin details</button></details></section></div>'+
   '<section class="how"><h2>How it works</h2><div class="howgrid">'+how.map(function(h,i){return '<div class="card"><span class="ico">'+ic(h[0],22)+'</span><h3>'+h[1]+'</h3><p class="muted">'+h[2]+'</p></div>'}).join('')+'</div></section>'+
   '<footer class="pubfoot">Dukaan Digital · Digital marketing training for small businesses</footer></div>';
}

/* ================= guide and verify (pop-ups) ================= */
function aboutHTML(){
  var d=S().defaultAdmin;
  return '<div class="guide"><h3>What this project is</h3><p>Dukaan Digital is a training website that teaches digital marketing to small shop owners. Learners create an account, finish six lessons, take quizzes, and generate a certificate.</p>'+
  '<h3>Two kinds of users</h3><ul><li><b>Learner:</b> registers, logs in, learns, takes quizzes, uses tools, creates a certificate.</li><li><b>Admin (teacher):</b> logs in to the Admin portal to see all learners, their progress, certificates, and course settings.</li></ul>'+
  '<h3>How login works</h3><p>When someone registers, the site makes a random “salt” and turns the password into a scrambled value (a hash). Only the scrambled value is saved, never the real password. At login the same steps are repeated and the two values are compared. After five wrong tries the account is locked for one minute.</p>'+
  '<h3>Where the data is stored</h3><p>Everything is saved in this browser using <b>localStorage</b>, on this computer only. There is no server. That keeps the project simple to run: just open <span class="mono">index.html</span>.</p>'+
  '<h3>How the certificate is made</h3><ol><li>The learner finishes the required lessons (the admin can change how many).</li><li>The learner fills in name, business or institute, city and batch.</li><li>The site creates a unique ID such as <span class="mono">DD-2026-AB12CD</span> and draws the certificate.</li><li>The learner downloads it as a picture or prints it to PDF. Anyone can check the ID with “Verify a certificate”.</li></ol>'+
  '<h3>Demo admin login</h3><p>Email <b class="mono">'+d.email+'</b> and password <b class="mono">'+d.password+'</b>. Change it in Admin portal → Settings.</p>'+
  '<h3>Honest limits</h3><ul><li>Data is stored per browser, so an admin only sees learners who registered on the same computer and browser.</li><li>Because there is no server, a technical person could edit the browser data. A real launch needs a backend.</li><li>The Admin portal can download a backup file to move data to another computer.</li></ul>'+
  '<h3>Next step for a real launch</h3><p>Replace <span class="mono">js/store.js</span> with a backend such as Firebase or Supabase. The rest of the site would stay the same.</p></div>';
}
A.about=function(){DD.modal('Project guide',aboutHTML(),true)};
A.verify=function(){
  DD.modal('Verify a certificate','<form id="verifyform" class="stack"><label class="field" for="vid">Certificate ID<input id="vid" placeholder="DD-2026-AB12CD" autocomplete="off" required></label><div><button class="btn primary" type="submit">'+ic('shield',18)+'Check certificate</button></div></form><div id="vres" role="status"></div><p class="muted small" style="margin-top:12px">This check uses the certificates saved in this browser.</p>');
};
F.verifyform=function(){
  var c=S().findCert($('#vid').value),r=$('#vres');
  if(!c){r.innerHTML='<div class="banner bad">'+ic('x',20)+'<span>No certificate found with this ID.</span></div>';return}
  r.innerHTML='<div class="banner '+(c.revoked?'bad':'ok')+'">'+ic(c.revoked?'x':'check',20)+'<span>'+(c.revoked?'This certificate was revoked.':'This certificate is valid.')+'</span></div>'+
   '<div class="kv"><div><span class="muted">Name</span><b>'+esc(c.name)+'</b></div><div><span class="muted">Course</span><b>'+esc(c.course)+'</b></div><div><span class="muted">Institute</span><b>'+(esc(c.institute)||'–')+'</b></div><div><span class="muted">Issued</span><b>'+DD.fmtShort(c.issued)+'</b></div><div><span class="muted">Issued by</span><b>'+esc(c.org)+'</b></div><div><span class="muted">ID</span><b class="mono">'+c.id+'</b></div></div>';
};

/* ================= actions ================= */
A.nav=function(t){R.page=t.getAttribute('data-page');R.lesson=null;render();window.scrollTo(0,0)};
A.openlesson=function(t){R.page='lessons';R.lesson=t.getAttribute('data-id');if(!$('#page'))render();else{chrome();renderPage()}};
A.lessonsback=function(){R.lesson=null;renderPage();window.scrollTo(0,0)};
A.setbiz=function(t){var u=S().current();u.biz=t.getAttribute('data-biz');S().save();renderPage()};
A.authtab=function(t){R.authTab=t.getAttribute('data-tab');render()};
A.logout=function(){S().logout();R.page='dashboard';R.lesson=null;R.authTab='login';render();window.scrollTo(0,0)};
A.togglepw=function(t){
  var i=$('#'+t.getAttribute('data-target'));if(!i)return;
  var show=i.type==='password';i.type=show?'text':'password';
  t.setAttribute('aria-label',show?'Hide password':'Show password');
};
A.fillAdmin=function(){
  R.authTab='login';render();
  var d=S().defaultAdmin;$('#li-email').value=d.email;$('#li-pw').value=d.password;
};
A.certdl=function(){var u=S().current(),c=S().certFor(u.id);if(c)DD.cert.download($('#certcanvas'),c)};
A.certprint=function(){DD.cert.print($('#certcanvas'))};

function showErr(msg){var e=$('#autherr');if(e)e.textContent=msg||''}
function busy(f,on){var b=f.querySelector('button[type=submit]');if(b){b.disabled=on}}
F.loginform=function(f){
  showErr('');busy(f,true);
  S().login($('#li-email').value,$('#li-pw').value).then(function(r){
    busy(f,false);
    if(!r.ok){showErr(r.error);return}
    R.page=r.user.role==='admin'?'admin':'dashboard';R.lesson=null;
    render();window.scrollTo(0,0);DD.toast('Welcome back, '+r.user.name.split(/\s+/)[0]);
  });
};
F.regform=function(f){
  showErr('');busy(f,true);
  S().register({name:$('#rg-name').value,email:$('#rg-email').value,phone:$('#rg-phone').value,biz:$('#rg-biz').value,password:$('#rg-pw').value,confirm:$('#rg-pw2').value}).then(function(r){
    busy(f,false);
    if(!r.ok){showErr(r.error);return}
    R.page='dashboard';R.lesson=null;render();window.scrollTo(0,0);DD.toast('Account created. Welcome!');
  });
};
F.certform=function(){
  var u=S().current(),err=$('#cf-err');err.textContent='';
  var name=$('#cf-name').value.trim(),inst=$('#cf-inst').value.trim();
  if(name.length<2){err.textContent='Please enter your full name.';return}
  if(inst.length<2){err.textContent='Please enter your business or institute name.';return}
  if(!S().eligible(u)){err.textContent='Finish the required lessons first.';return}
  var had=!!S().certFor(u.id);
  var c=S().issueCert(u,{name:name,institute:inst,city:$('#cf-city').value.trim(),batch:$('#cf-batch').value.trim()});
  if(!c){err.textContent='This certificate was revoked. Please contact your trainer.';return}
  renderPage();chrome();
  DD.toast(had?'Certificate updated':'Certificate created');
  var cv=$('#certcanvas');if(cv)cv.scrollIntoView({behavior:'smooth',block:'center'});
};

DD.app={render:render,renderPage:renderPage,chrome:chrome};

/* ================= start ================= */
root().innerHTML='<div class="loading">Loading…</div>';
S().ready.then(render);
})();
