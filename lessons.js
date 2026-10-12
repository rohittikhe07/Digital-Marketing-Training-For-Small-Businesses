/* lessons.js - the lesson pages: Watch (animated video), Listen (audio), See (picture guide) and Quiz.
   Progress is saved on the logged-in learner's account (see store.js). */
window.DD=window.DD||{};
(function(){
var $=DD.$,$$=DD.$$,ic=DD.ic;
var LS={id:null,tab:'watch',el:null};
var VP=null,AP=null,TOK=0;
var TTS=('speechSynthesis' in window&&typeof SpeechSynthesisUtterance!=='undefined');

function U(){return DD.store.current()}
function P(){return DD.store.prog(U())}
function B(){var u=U();return DD.BIZ[u&&u.biz]||DD.BIZ.kirana}
function fill(s){return String(s).replace(/\{(\w+)\}/g,function(m,k){return B()[k]||m})}
function byId(id){return DD.LESSONS.filter(function(L){return L.id===id})[0]}

/* ---------- list of lessons (cards) ---------- */
function list(){
  var p=P();
  return '<div class="lesson-grid">'+DD.LESSONS.map(function(L,i){
    var ok=p.done[L.id],sc=p.scores[L.id];
    return '<button class="lcard" data-act="openlesson" data-id="'+L.id+'">'+
      '<span class="lnum'+(ok?' ok':'')+'">'+(ok?ic('check',18):(i+1))+'</span>'+
      '<span class="ltitle">'+L.title+'</span>'+
      '<span class="lsum">'+fill(L.summary)+'</span>'+
      '<span class="lmeta mono">'+ic('video',14)+ic('headphones',14)+ic('image',14)+' '+L.min+' min'+(sc!=null?' · quiz '+sc+'/'+L.quiz.length:'')+'</span></button>';
  }).join('')+'</div>';
}

/* ---------- speech ---------- */
function say(text,cb,rate){
  try{
    if(!TTS){cb&&cb();return}
    speechSynthesis.cancel();
    var u=new SpeechSynthesisUtterance(text);u.rate=rate||1;u.lang='en-IN';
    u.onend=function(){cb&&cb()};u.onerror=function(){cb&&cb()};
    speechSynthesis.speak(u);
  }catch(e){cb&&cb()}
}
function stop(){
  if(VP&&VP.timer)clearInterval(VP.timer);
  VP=null;AP=null;TOK++;
  try{if(TTS)speechSynthesis.cancel()}catch(e){}
}

/* ---------- page ---------- */
function open(el,id){LS.el=el;LS.id=id;LS.tab='watch';render();window.scrollTo(0,0)}
function render(){
  stop();
  var el=LS.el;if(!el)return;
  var L=byId(LS.id);if(!L)return;
  var idx=DD.LESSONS.indexOf(L);
  var tabs=[['watch','video','Watch'],['listen','headphones','Listen'],['see','image','See'],['quiz','check','Quiz']];
  var panel=LS.tab==='watch'?watchPanel(L):LS.tab==='listen'?listenPanel(L):LS.tab==='see'?seePanel(L):quizPanel(L);
  var order=['watch','listen','see','quiz'],nextTab=order[order.indexOf(LS.tab)+1];
  var cta=nextTab?'<div class="cta-row"><button class="btn primary" data-act="ltab" data-tab="'+nextTab+'">'+(nextTab==='quiz'?'Take the quiz':'Next: '+nextTab)+ic('arrow',18)+'</button></div>':'';
  el.innerHTML='<button class="btn ghost" data-act="lessonsback">'+ic('back',18)+'All lessons</button>'+
  '<header class="lhead"><p class="eyebrow mono">Lesson '+(idx+1)+' of '+DD.LESSONS.length+' · '+L.min+' min</p><h1>'+L.title+'</h1><p class="lede">'+fill(L.summary)+'</p></header>'+
  '<div class="tabs" role="tablist" aria-label="Lesson format">'+tabs.map(function(t){return '<button class="tab" role="tab" aria-selected="'+(LS.tab===t[0])+'" data-act="ltab" data-tab="'+t[0]+'">'+ic(t[1],18)+t[2]+'</button>'}).join('')+'</div>'+
  '<div id="panel">'+panel+'</div>'+cta+nextBar(L);
  if(LS.tab==='watch')vpInit(L);
  if(LS.tab==='listen')apInit(L);
}
function nextBar(L){
  var i=DD.LESSONS.indexOf(L),prev=DD.LESSONS[i-1],next=DD.LESSONS[i+1];
  return '<div class="nextbar">'+(prev?'<button class="btn" data-act="openlesson" data-id="'+prev.id+'">'+ic('prev',18)+prev.title+'</button>':'<span></span>')+
   (next?'<button class="btn" data-act="openlesson" data-id="'+next.id+'">'+next.title+ic('next',18)+'</button>':'<button class="btn primary" data-act="nav" data-page="cert">'+ic('award',18)+'Go to certificate</button>')+'</div>';
}

/* ---------- Watch ---------- */
function watchPanel(){
  return '<div class="player"><div class="stage" id="vstage"></div><div id="vctrl"></div></div>'+
  '<div class="upload"><h3>'+ic('video',20)+'Use your own lesson video</h3><p>Trainers can add a recorded video to play instead of the animated one. It stays on this device.</p><input type="file" id="upv" accept="video/*" aria-label="Choose a video file"><div id="upv-out"></div></div>';
}
function vpInit(L){
  VP={L:L,i:0,elapsed:0,playing:false,started:false,ended:false,speed:1,nar:false,cap:true,spDone:true,timer:setInterval(vpTick,100)};
  vpScene();vpCtrl();
}
function vpDur(){var w=fill(VP.L.scenes[VP.i].text).split(/\s+/).length;return Math.max(5200,w*440)/VP.speed}
function vpScene(){
  var st=$('#vstage');if(!st||!VP)return;
  var sc=VP.L.scenes[VP.i];
  st.setAttribute('data-s',VP.i%4);
  st.innerHTML='<div class="smeta mono">Scene '+(VP.i+1)+' of '+VP.L.scenes.length+'</div><div class="sbody"><div class="sicon">'+ic(sc.icon,52)+'</div><h2 class="shead">'+fill(sc.head)+'</h2>'+(VP.cap?'<p class="scap">'+fill(sc.text)+'</p>':'')+'</div>'+(!VP.started?'<button class="bigplay" data-act="vplay">'+ic('play',20)+'Play video</button>':'');
}
function vpCtrl(){
  var c=$('#vctrl');if(!c||!VP)return;
  var L=VP.L;
  c.innerHTML='<div class="segs">'+L.scenes.map(function(s,i){return '<button class="seg" data-act="vseg" data-i="'+i+'" aria-label="Go to scene '+(i+1)+': '+fill(s.head)+'"><span class="bar"><span class="fill" style="width:'+(i<VP.i?100:0)+'%"></span></span></button>'}).join('')+'</div>'+
  '<div class="ctrls"><button class="cbtn" data-act="vplay">'+ic(VP.playing?'pause':'play',18)+(VP.playing?'Pause':(VP.ended?'Replay':'Play'))+'</button>'+
  '<button class="cbtn" data-act="vprev" aria-label="Previous scene">'+ic('prev',18)+'</button>'+
  '<button class="cbtn" data-act="vnext" aria-label="Next scene">'+ic('next',18)+'</button>'+
  '<button class="cbtn" data-act="vnar" aria-pressed="'+VP.nar+'"'+(TTS?'':' disabled title="Voice is not available in this browser"')+'>'+ic('headphones',18)+'Voice '+(VP.nar?'on':'off')+'</button>'+
  '<button class="cbtn" data-act="vcap" aria-pressed="'+VP.cap+'">Captions</button>'+
  '<label class="spd">Speed <select id="vspd">'+[0.75,1,1.25,1.5].map(function(v){return '<option value="'+v+'"'+(v===VP.speed?' selected':'')+'>'+v+'x</option>'}).join('')+'</select></label></div>';
}
function vpSay(){
  if(!VP)return;
  var idx=VP.i,my=++TOK;VP.spDone=false;
  var sc=VP.L.scenes[idx];
  say(fill(sc.head)+'. '+fill(sc.text),function(){if(VP&&VP.i===idx&&TOK===my)VP.spDone=true},VP.speed);
}
function vpGo(i){
  if(!VP)return;
  VP.i=Math.max(0,Math.min(VP.L.scenes.length-1,i));VP.elapsed=0;VP.ended=false;VP.started=true;
  vpScene();vpCtrl();
  if(VP.playing&&VP.nar)vpSay();else{TOK++;try{if(TTS)speechSynthesis.cancel()}catch(e){}}
}
function vpToggle(){
  if(!VP)return;
  if(VP.playing){VP.playing=false;TOK++;try{if(TTS)speechSynthesis.cancel()}catch(e){}}
  else{
    if(VP.ended){VP.i=0;VP.elapsed=0;VP.ended=false}
    VP.playing=true;VP.started=true;vpScene();
    if(VP.nar)vpSay();
  }
  vpCtrl();
}
function vpTick(){
  if(!VP||!VP.playing)return;
  VP.elapsed+=100;
  var d=vpDur();
  var ready=!VP.nar||VP.spDone||VP.elapsed>d+9000;
  if(VP.elapsed>=d&&ready){
    if(VP.i<VP.L.scenes.length-1)vpGo(VP.i+1);
    else{VP.playing=false;VP.ended=true;vpCtrl()}
  }else{
    var f=$$('.seg .fill')[VP.i];
    if(f)f.style.width=Math.min(100,VP.elapsed/d*100)+'%';
  }
}

/* ---------- Listen ---------- */
function apParas(L){
  return ['Welcome. This lesson is called '+L.title+'.'].concat(L.scenes.map(function(s){return s.head+'. '+s.text}),L.talk,[L.recap]).map(fill);
}
function listenPanel(L){
  var paras=apParas(L),bars='';
  for(var k=0;k<28;k++)bars+='<i style="--k:'+k+'"></i>';
  var mins=Math.max(1,Math.round(paras.join(' ').split(/\s+/).length/150));
  return '<div class="audio" id="audio"><div class="wave" aria-hidden="true">'+bars+'</div>'+
  (TTS?'':'<p class="note">Your browser cannot read aloud here. You can read the text below, or add your own recording.</p>')+
  '<div class="actrl"><button class="btn primary" id="aplay" data-act="aplay">'+ic('play',20)+' Play lesson</button>'+
  '<button class="btn" data-act="aprev" aria-label="Previous part">'+ic('prev',18)+'</button><button class="btn" data-act="anext" aria-label="Next part">'+ic('next',18)+'</button>'+
  '<label class="spd">Speed <select id="aspd"><option value="0.75">0.75x</option><option value="1" selected>1x</option><option value="1.25">1.25x</option><option value="1.5">1.5x</option></select></label>'+
  '<span class="mono muted">About '+mins+' min</span></div>'+
  '<div class="tr" aria-label="Lesson text">'+paras.map(function(p,i){return '<p data-act="aseek" data-i="'+i+'">'+p+'</p>'}).join('')+'</div></div>'+
  '<div class="upload"><h3>'+ic('headphones',20)+'Use your own recording</h3><p>Record the lesson in your own voice and add the file here. It stays on this device.</p><input type="file" id="upa" accept="audio/*" aria-label="Choose an audio file"><div id="upa-out"></div></div>';
}
function apInit(L){AP={L:L,paras:apParas(L),i:-1,playing:false,speed:1};apPaint()}
function apPaint(){
  var root=$('#audio');if(!root||!AP)return;
  root.classList.toggle('playing',AP.playing);
  var b=$('#aplay');
  if(b)b.innerHTML=ic(AP.playing?'pause':'play',20)+' '+(AP.playing?'Pause':(AP.i>=0?'Resume':'Play lesson'));
  $$('.tr p',root).forEach(function(p,k){p.classList.toggle('on',k===AP.i)});
  var cur=$('.tr p.on',root);
  if(cur&&AP.playing){var box=$('.tr',root);box.scrollTop=cur.offsetTop-box.offsetTop-12}
}
function apPlay(i){
  if(!AP)return;
  if(!TTS){apPaint();return}
  i=Math.max(0,Math.min(AP.paras.length-1,i));
  AP.i=i;AP.playing=true;
  var my=++TOK;apPaint();
  say(AP.paras[i],function(){
    if(!AP||TOK!==my||!AP.playing)return;
    if(i<AP.paras.length-1)apPlay(i+1);else{AP.playing=false;AP.i=-1;apPaint()}
  },AP.speed);
}
function apPause(){if(!AP)return;AP.playing=false;TOK++;try{if(TTS)speechSynthesis.cancel()}catch(e){}apPaint()}

/* ---------- See (picture guide) ---------- */
function seePanel(L){
  return '<div class="poster"><div class="poster-top"><p class="mono">Picture guide</p><h2>'+L.title+'</h2></div><div class="poster-body">'+
  '<div class="pgrid">'+L.steps.map(function(s){return '<div class="pstep"><span class="ico">'+ic(s[0],24)+'</span><h3>'+fill(s[1])+'</h3><p>'+fill(s[2])+'</p></div>'}).join('')+'</div>'+
  '<div class="dd"><div class="yes"><h3>Do this</h3><ul>'+L.dos.map(function(d){return '<li>'+ic('check',18)+'<span>'+fill(d)+'</span></li>'}).join('')+'</ul></div>'+
  '<div class="no"><h3>Avoid this</h3><ul>'+L.donts.map(function(d){return '<li>'+ic('x',18)+'<span>'+fill(d)+'</span></li>'}).join('')+'</ul></div></div>'+
  '<div class="try">'+ic('bulb',26)+'<div><b>Try this today</b><p>'+fill(L.tryit)+'</p></div></div>'+
  '</div></div>'+
  '<div class="upload"><h3>'+ic('image',20)+'Add your own picture</h3><p>Add a photo of your shop or product to put beside this guide. It stays on this device.</p><input type="file" id="upi" accept="image/*" aria-label="Choose an image"><div id="upi-out"></div></div>';
}

/* ---------- Quiz ---------- */
function quizPanel(L){
  var p=P(),best=p.scores[L.id];
  return (p.done[L.id]?'<div class="banner ok">'+ic('check',20)+'Lesson complete'+(best!=null?'. Best score: '+best+' of '+L.quiz.length:'')+'</div>':'')+
  '<form id="quiz" onsubmit="return false">'+L.quiz.map(function(q,qi){
    return '<fieldset class="q" id="q'+qi+'"><legend>'+(qi+1)+'. '+fill(q.q)+'</legend>'+q.o.map(function(o,oi){
      return '<label class="opt"><input type="radio" name="q'+qi+'" value="'+oi+'"><span>'+fill(o)+'</span></label>'}).join('')+'<p class="why" hidden></p></fieldset>'}).join('')+
  '<div id="qres"></div><button class="btn primary" type="button" data-act="check">'+ic('check',18)+'Check my answers</button></form>';
}
function checkQuiz(){
  var L=byId(LS.id),score=0,missing=0;
  L.quiz.forEach(function(q,qi){if(!$('input[name="q'+qi+'"]:checked'))missing++});
  var res=$('#qres');
  if(missing){res.innerHTML='<p class="note" role="alert">Please answer all '+L.quiz.length+' questions first.</p>';return}
  L.quiz.forEach(function(q,qi){
    var fs=$('#q'+qi),sel=parseInt($('input[name="q'+qi+'"]:checked').value,10),ok=sel===q.a;
    if(ok)score++;
    $$('.opt',fs).forEach(function(lb,oi){lb.classList.remove('right','wrong');if(oi===q.a)lb.classList.add('right');else if(oi===sel)lb.classList.add('wrong')});
    var w=$('.why',fs);w.hidden=false;
    w.innerHTML=(ok?'<b class="r">Correct.</b> ':'<b class="w">Not quite.</b> The answer is “'+fill(q.o[q.a])+'”. ')+fill(q.why);
    $$('input',fs).forEach(function(i){i.disabled=true});
  });
  var p=P(),pass=score>=2;
  if(pass)p.done[L.id]=true;
  if(p.scores[L.id]==null||score>p.scores[L.id])p.scores[L.id]=score;
  DD.store.save();
  if(DD.app&&DD.app.chrome)DD.app.chrome();
  var i=DD.LESSONS.indexOf(L),next=DD.LESSONS[i+1];
  var allDone=DD.store.eligible(U());
  res.innerHTML='<div class="result"><b>You scored '+score+' of '+L.quiz.length+'.</b><span>'+(pass?'Well done. This lesson is complete.':'Pass with two correct answers. Watch the lesson again and try once more.')+'</span>'+
   (pass&&allDone?'<span class="good">You have finished enough lessons to get your certificate.</span>':'')+
   '<div class="row"><button class="btn" type="button" data-act="retry">Try again</button>'+
   (pass?(allDone?'<button class="btn primary" type="button" data-act="nav" data-page="cert">'+ic('award',18)+'Get your certificate</button>':(next?'<button class="btn primary" type="button" data-act="openlesson" data-id="'+next.id+'">Next lesson'+ic('next',18)+'</button>':'')):'')+'</div></div>';
  var btn=$('[data-act="check"]');if(btn)btn.hidden=true;
}

/* ---------- events ---------- */
var A=DD.actions;
A.ltab=function(t){LS.tab=t.getAttribute('data-tab');render();window.scrollTo(0,0)};
A.retry=function(){render()};
A.check=checkQuiz;
A.vplay=vpToggle;
A.vprev=function(){if(VP)vpGo(VP.i-1)};
A.vnext=function(){if(VP)vpGo(VP.i+1)};
A.vseg=function(t){vpGo(parseInt(t.getAttribute('data-i'),10))};
A.vnar=function(){if(VP&&TTS){VP.nar=!VP.nar;if(VP.nar&&VP.playing)vpSay();else{TOK++;try{speechSynthesis.cancel()}catch(x){}}vpCtrl()}};
A.vcap=function(){if(VP){VP.cap=!VP.cap;vpScene();vpCtrl()}};
A.aplay=function(){if(AP){AP.playing?apPause():apPlay(AP.i>=0?AP.i:0)}};
A.aprev=function(){if(AP)apPlay(AP.i-1)};
A.anext=function(){if(AP)apPlay(AP.i+1)};
A.aseek=function(t){if(AP)apPlay(parseInt(t.getAttribute('data-i'),10))};

DD.changes.push(function(t){
  var id=t.id||'';
  if(id==='vspd'&&VP){VP.speed=parseFloat(t.value);if(VP.playing&&VP.nar)vpSay()}
  if(id==='aspd'&&AP){AP.speed=parseFloat(t.value);if(AP.playing)apPlay(AP.i)}
  if((id==='upv'||id==='upa'||id==='upi')&&t.files&&t.files[0]){
    var url=URL.createObjectURL(t.files[0]),out=$('#'+id+'-out');
    if(id==='upv'){if(VP){VP.playing=false;TOK++}out.innerHTML='<video class="usermedia" controls playsinline src="'+url+'"></video>'}
    if(id==='upa'){apPause();out.innerHTML='<audio controls src="'+url+'" style="width:100%"></audio>'}
    if(id==='upi'){out.innerHTML='<img class="usermedia" alt="Your picture" src="'+url+'">'}
  }
});

DD.lessons={list:list,open:open,stop:stop,byId:byId};
})();
