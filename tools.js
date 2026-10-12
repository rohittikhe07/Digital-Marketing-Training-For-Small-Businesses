/* tools.js - the three practical tools: weekly post planner, ad budget calculator, 30-day checklist. */
window.DD=window.DD||{};
(function(){
var $=DD.$,$$=DD.$$,ic=DD.ic;
var PLAN=[];
var DAYS=[
 ['Mon','Teach','Quick tip from our {shop}: [write one useful tip about {item}]. Questions? Message us on WhatsApp.'],
 ['Tue','Show','New at our {shop}: {post}. Visit us or message to know more.'],
 ['Wed','Offer','This week only: {offer}. Valid till [date]. Show this post at the counter.'],
 ['Thu','Story','Thank you [customer name] for the kind words! [paste a real review here]'],
 ['Fri','Behind the scenes','A look behind the scenes at our {shop}. Meet the team and see how we work.'],
 ['Sat','Reminder','Planning your weekend? Come by our {shop}. {offer}. Call or message us on WhatsApp.'],
 ['Sun','Rest and reply','Reply to every comment and message, then plan next week.']
];
var PICK={3:[0,2,4],5:[0,1,2,3,4],7:[0,1,2,3,4,5,6]};
var CHECK=['Write one goal for the next 30 days','Claim your Google Business Profile','Upload 10 real photos to Google','Set up your WhatsApp Business profile','Add 5 products to the catalogue','Create an Instagram or Facebook page','Post 3 times in the first week','Ask 5 happy customers for a review','Start one offer with an end date','Count new customers on day 30'];

function U(){return DD.store.current()}
function B(){return DD.BIZ[U().biz]||DD.BIZ.kirana}
function fill(s){return String(s).replace(/\{(\w+)\}/g,function(m,k){return B()[k]||m})}
function P(){return DD.store.prog(U())}

function bizChips(){
  var u=U();
  return '<div class="chiprow"><span class="mono muted">My business</span><div class="chips" role="group" aria-label="Your business type">'+Object.keys(DD.BIZ).map(function(k){return '<button class="chip" data-act="setbiz" data-biz="'+k+'" aria-pressed="'+(u.biz===k)+'">'+DD.BIZ[k].label+'</button>'}).join('')+'</div></div>';
}
function planHTML(){
  var idxs=PICK[P().posts]||PICK[5];PLAN=[];
  return idxs.map(function(i){
    var d=DAYS[i],cap=fill(d[2]);PLAN.push(cap);
    var n=PLAN.length-1;
    return '<div class="day"><div class="d">'+d[0]+'</div><div><div class="k">'+d[1]+'</div><p class="cap" id="cap'+n+'">'+DD.esc(cap)+'</p>'+(i===6?'':'<button class="btn mini" data-act="copy" data-i="'+n+'">'+ic('copy',16)+'Copy caption</button>')+'</div></div>';
  }).join('');
}
function fld(id,label,val){return '<label class="field" for="'+id+'">'+label+'<input id="'+id+'" type="number" min="0" step="any" inputmode="decimal" value="'+val+'"></label>'}
function view(){
  var p=P(),n=CHECK.filter(function(c,i){return p.check[i]}).length;
  return '<header class="lhead"><p class="eyebrow mono">Tools</p><h1>Plan, estimate and track</h1><p class="lede">Three simple tools you can use right now for your '+B().shop+'.</p></header>'+
  '<div class="gap">'+bizChips()+'</div><div class="tools">'+
  '<section class="card"><h2>Weekly post planner</h2><p class="sub">Captions you can copy. Change the words in [brackets].</p>'+
   '<div class="chips" role="group" aria-label="Posts per week">'+[3,5,7].map(function(k){return '<button class="chip" data-act="posts" data-n="'+k+'" aria-pressed="'+(p.posts===k)+'">'+k+' days a week</button>'}).join('')+'</div>'+
   '<div class="plan" id="plan">'+planHTML()+'</div></section>'+
  '<section class="card"><h2>Ad budget calculator</h2><p class="sub">These are example numbers. Replace them with your own.</p>'+
   '<div class="fgrid">'+fld('c-budget','Daily budget (₹)',100)+fld('c-days','Days',5)+fld('c-cpc','Cost per click (₹)',8)+fld('c-enq','Clicks that message you (%)',10)+fld('c-cust','Messages that buy (%)',30)+fld('c-sale','Average sale (₹)',400)+'</div>'+
   '<div class="out" id="cout"></div><div class="bars" id="cbars"></div><p id="cnote" class="note"></p></section>'+
  '<section class="card"><h2>30-day launch checklist</h2><p class="sub"><span id="ckn">'+n+'</span> of '+CHECK.length+' done. Your ticks are saved on your account.</p><div class="prog"><i id="ckbar" style="width:'+(n/CHECK.length*100)+'%"></i></div>'+
   '<ul class="check">'+CHECK.map(function(c,i){return '<li><label><input type="checkbox" data-ck="'+i+'"'+(p.check[i]?' checked':'')+'><span>'+c+'</span></label></li>'}).join('')+'</ul></section>'+
  '</div>';
}
function num(id){var el=$('#'+id);var v=el?parseFloat(el.value):0;return isFinite(v)&&v>0?v:0}
function inr(v){return '₹'+Math.round(v).toLocaleString('en-IN')}
function calc(){
  if(!$('#cout'))return;
  var spend=num('c-budget')*num('c-days'),cpc=num('c-cpc');
  var clicks=cpc?spend/cpc:0,enq=clicks*num('c-enq')/100,cust=enq*num('c-cust')/100,rev=cust*num('c-sale');
  var per=cust>0?spend/cust:0,perEnq=enq>0?spend/enq:0;
  function st(v,l){return '<div class="stat"><div class="v">'+v+'</div><div class="l">'+l+'</div></div>'}
  $('#cout').innerHTML=st(inr(spend),'Total spend')+st(Math.round(clicks).toLocaleString('en-IN'),'Clicks')+st(enq.toFixed(1),'Messages')+st(cust.toFixed(1),'New customers')+st(enq>0?inr(perEnq):'–','Cost per message')+st(cust>0?inr(per):'–','Cost per customer');
  var mx=Math.max(spend,rev,1);
  $('#cbars').innerHTML='<div class="brow"><span>Spend</span><span class="btrack"><i style="width:'+(spend/mx*100)+'%;background:var(--bad)"></i></span><span>'+inr(spend)+'</span></div>'+
   '<div class="brow"><span>Sales</span><span class="btrack"><i style="width:'+(rev/mx*100)+'%;background:var(--good)"></i></span><span>'+inr(rev)+'</span></div>';
  $('#cnote').textContent=spend===0?'Enter a budget and number of days to see an estimate.':(rev>=spend?'On these numbers the sales cover the ad spend. Test with a small budget to see if real results match.':'On these numbers sales are lower than spend. Improve your photo or offer, lower the cost per click, or raise your average sale before spending more.');
}
function copyText(text,btn,idx){
  var done=function(msg){var o=btn.innerHTML;btn.textContent=msg;setTimeout(function(){btn.innerHTML=o},1600)};
  var fallback=function(){
    var el=$('#cap'+idx);
    if(el){var r=document.createRange();r.selectNodeContents(el);var s=window.getSelection();s.removeAllRanges();s.addRange(r)}
    done('Press copy now');
  };
  try{navigator.clipboard.writeText(text).then(function(){done('Copied')},fallback)}catch(e){fallback()}
}

DD.actions.posts=function(t){
  var p=P();p.posts=parseInt(t.getAttribute('data-n'),10);DD.store.save();
  $$('[data-act="posts"]').forEach(function(b){b.setAttribute('aria-pressed',String(b===t))});
  $('#plan').innerHTML=planHTML();
};
DD.actions.copy=function(t){var i=parseInt(t.getAttribute('data-i'),10);copyText(PLAN[i],t,i)};
DD.inputs.push(function(t){if((t.id||'').indexOf('c-')===0)calc()});
DD.changes.push(function(t){
  if(t.hasAttribute&&t.hasAttribute('data-ck')){
    var p=P();p.check[t.getAttribute('data-ck')]=t.checked?1:0;DD.store.save();
    var n=CHECK.filter(function(c,i){return p.check[i]}).length;
    $('#ckn').textContent=n;$('#ckbar').style.width=(n/CHECK.length*100)+'%';
  }
});
DD.tools={view:view,calc:calc,bizChips:bizChips};
})();
