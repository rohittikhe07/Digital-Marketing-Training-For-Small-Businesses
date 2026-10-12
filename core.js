/* core.js - small helpers shared by every file: icons, toast messages, pop-up dialogs, event routing. */
window.DD=window.DD||{};
(function(){
var ICON={
 store:'<path d="M4 9l1-5h14l1 5"/><path d="M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0A2.7 2.7 0 0020 9"/><path d="M5 12v8h14v-8"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 heart:'<path d="M12 20s-8-4.9-8-10.5A4.5 4.5 0 0112 7a4.5 4.5 0 018 2.5C20 15.1 12 20 12 20z"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
 pin:'<path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 check:'<path d="M5 12l5 5 9-10"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
 chat:'<path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/>',
 camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 megaphone:'<path d="M3 10v4h4l8 4V6L7 10H3z"/><path d="M18 9a4 4 0 010 6"/>',
 chart:'<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
 rupee:'<path d="M7 5h10M7 9h10M7 5c6 0 6 8 0 8h-.5l7 6"/>',
 tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0113 0"/><path d="M16 4.5a3.5 3.5 0 010 7M18 14a6.5 6.5 0 013.5 6"/>',
 calendar:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 bulb:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 00-3.5 10.9V15h7v-1.1A6 6 0 0012 3z"/>',
 video:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
 phone:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
 play:'<path d="M8 5l11 7-11 7z"/>',
 pause:'<path d="M8 5v14M16 5v14"/>',
 prev:'<path d="M6 5v14M19 5L9 12l10 7z"/>',
 next:'<path d="M18 5v14M5 5l10 7-10 7z"/>',
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
 headphones:'<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
 copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 21l5-3 5 3-1.5-7"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
 logout:'<path d="M9 4H5a1 1 0 00-1 1v14a1 1 0 001 1h4"/><path d="M16 8l4 4-4 4M20 12H9"/>',
 home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',
 book:'<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5z"/><path d="M4 20.5A2.5 2.5 0 016.5 18H20v3H6.5A2.5 2.5 0 014 20.5z"/>',
 sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
 print:'<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>'
};
DD.$=function(s,r){return (r||document).querySelector(s)};
DD.$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
DD.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
DD.ic=function(n,s){s=s||20;return '<svg class="ic" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICON[n]||'')+'</svg>'};
DD.fmtDate=function(iso){try{return new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}catch(e){return ''}};
DD.fmtShort=function(iso){try{return new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}catch(e){return ''}};

/* ----- event routing: any element with data-act="name" calls DD.actions.name(element) ----- */
DD.actions={};DD.inputs=[];DD.changes=[];DD.forms={};
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-act]');if(!t)return;
  var f=DD.actions[t.getAttribute('data-act')];
  if(f)f(t,e);
});
document.addEventListener('input',function(e){DD.inputs.forEach(function(f){f(e.target,e)})});
document.addEventListener('change',function(e){DD.changes.forEach(function(f){f(e.target,e)})});
document.addEventListener('submit',function(e){
  var f=DD.forms[e.target.id];
  e.preventDefault();
  if(f)f(e.target,e);
});
document.addEventListener('keydown',function(e){if(e.key==='Escape')DD.closeModal()});

/* ----- toast message ----- */
DD.toast=function(msg,kind){
  var box=DD.$('#toasts');
  if(!box){box=document.createElement('div');box.id='toasts';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box)}
  var t=document.createElement('div');t.className='toast '+(kind||'');
  t.innerHTML=DD.ic(kind==='bad'?'x':'check',18)+'<span>'+DD.esc(msg)+'</span>';
  box.appendChild(t);
  setTimeout(function(){t.classList.add('out');setTimeout(function(){t.remove()},300)},3200);
};

/* ----- pop-up dialog ----- */
DD.closeModal=function(){var o=DD.$('#overlay');if(o)o.remove()};
DD.actions.mclose=function(){DD.closeModal()};
DD.modal=function(title,html,wide){
  DD.closeModal();
  var o=document.createElement('div');o.className='overlay';o.id='overlay';
  o.innerHTML='<div class="dialog'+(wide?' wide':'')+'" role="dialog" aria-modal="true" aria-label="'+DD.esc(title)+'"><div class="dhead"><h2>'+DD.esc(title)+'</h2><button class="iconbtn" data-act="mclose" aria-label="Close">'+DD.ic('x',20)+'</button></div><div class="dbody">'+html+'</div></div>';
  document.body.appendChild(o);
  o.addEventListener('mousedown',function(e){if(e.target===o)DD.closeModal()});
  var f=o.querySelector('input,select,button.btn');if(f)f.focus();
  return o.querySelector('.dbody');
};

/* ----- save a text file to the computer (works when the site is opened from files or a server) ----- */
DD.download=function(name,text,type){
  var blob=new Blob([text],{type:type||'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;
  document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
};
})();
