/* certificate.js - draws the certificate on a canvas. The same drawing is shown on screen,
   saved as a PNG picture, and printed (use "Save as PDF" in the print window to get a PDF). */
window.DD=window.DD||{};
(function(){
var W=1600,H=1130;
var INK='#10201A',BRAND='#0B6B53',SUN='#F2B01E',MUTED='#4F6158',LINE='#C9D6CF';
var DISPLAY="'Bricolage Grotesque',Georgia,serif",BODY="'DM Sans',Arial,sans-serif",MONO="'IBM Plex Mono',monospace";

function fit(g,text,weight,size,family,maxW){
  while(size>24){g.font=weight+' '+size+'px '+family;if(g.measureText(text).width<=maxW)break;size-=2}
  return size;
}
function spaced(g,txt,px){try{g.letterSpacing=px+'px'}catch(e){}}
function draw(canvas,c){
  canvas.width=W;canvas.height=H;
  var g=canvas.getContext('2d');
  g.fillStyle='#FFFFFF';g.fillRect(0,0,W,H);
  g.textAlign='center';g.textBaseline='alphabetic';

  /* borders */
  g.strokeStyle=INK;g.lineWidth=4;g.strokeRect(28,28,W-56,H-56);
  g.strokeStyle=BRAND;g.lineWidth=2;g.strokeRect(48,48,W-96,H-96);

  /* shop awning stripe along the top */
  var x0=50,x1=W-50,sw=50,top=50,hh=44;
  g.save();g.beginPath();g.rect(x0,top,x1-x0,hh);g.clip();
  for(var x=x0,i=0;x<x1;x+=sw,i++){g.fillStyle=i%2?'#FFFFFF':BRAND;g.fillRect(x,top,sw,hh)}
  g.restore();
  g.fillStyle=SUN;g.fillRect(x0,top+hh,x1-x0,8);

  /* heading */
  g.fillStyle=MUTED;g.font='500 24px '+MONO;spaced(g,'',5);
  g.fillText((c.org||'').toUpperCase(),W/2,176);spaced(g,'',0);
  g.fillStyle=BRAND;g.font='800 96px '+DISPLAY;
  g.fillText('Certificate of Completion',W/2,290);

  g.fillStyle=MUTED;g.font='400 32px '+BODY;
  g.fillText('This is to certify that',W/2,372);

  /* name */
  var nm=c.name||'Your name';
  var ns=fit(g,nm,'800',110,DISPLAY,1100);
  g.fillStyle=INK;g.font='800 '+ns+'px '+DISPLAY;g.fillText(nm,W/2,490);
  g.strokeStyle=LINE;g.lineWidth=3;g.beginPath();g.moveTo(W/2-480,522);g.lineTo(W/2+480,522);g.stroke();

  g.fillStyle=MUTED;g.font='400 32px '+BODY;
  g.fillText('has successfully completed the course',W/2,588);
  var cs=fit(g,c.course||'',' 800'.trim(),58,DISPLAY,1200);
  g.fillStyle=INK;g.font='800 '+cs+'px '+DISPLAY;g.fillText(c.course||'',W/2,664);

  g.fillStyle=MUTED;g.font='400 28px '+BODY;
  g.fillText((c.lessons||6)+' lessons with video, audio and practical tasks',W/2,722);
  var line=[c.institute,c.city].filter(Boolean).join(', ');
  if(c.batch)line+=(line?'  ·  ':'')+c.batch;
  if(line){g.fillStyle=INK;g.font='600 30px '+BODY;g.fillText(line,W/2,778)}

  /* date, seal, signature */
  var yb=920;
  g.fillStyle=INK;g.font='600 32px '+BODY;
  g.fillText(DD.fmtDate(c.issued),360,yb);
  g.strokeStyle=INK;g.lineWidth=2;g.beginPath();g.moveTo(210,yb+16);g.lineTo(510,yb+16);g.stroke();
  g.fillStyle=MUTED;g.font='500 22px '+MONO;spaced(g,'',3);g.fillText('DATE OF ISSUE',360,yb+52);

  g.fillStyle=INK;g.font='700 34px '+DISPLAY;spaced(g,'',0);
  g.fillText(c.signer||'',1240,yb);
  g.beginPath();g.moveTo(1090,yb+16);g.lineTo(1390,yb+16);g.stroke();
  g.fillStyle=MUTED;g.font='500 22px '+MONO;spaced(g,'',3);g.fillText((c.signerTitle||'').toUpperCase(),1240,yb+52);spaced(g,'',0);

  /* seal */
  var cx=W/2,cy=yb-20;
  g.fillStyle=SUN;g.beginPath();g.arc(cx,cy,78,0,Math.PI*2);g.fill();
  g.strokeStyle=BRAND;g.lineWidth=5;g.beginPath();g.arc(cx,cy,64,0,Math.PI*2);g.stroke();
  g.fillStyle=BRAND;g.beginPath();
  for(var k=0;k<10;k++){var r=k%2?15:38,a=-Math.PI/2+k*Math.PI/5;g.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a))}
  g.closePath();g.fill();

  /* footer */
  g.fillStyle=MUTED;g.font='500 22px '+MONO;spaced(g,'',1);
  g.fillText('CERTIFICATE ID  '+c.id+'   ·   VERIFY ON THE DUKAAN DIGITAL WEBSITE',W/2,1052);spaced(g,'',0);

  /* revoked stamp */
  if(c.revoked){
    g.save();g.translate(W/2,H/2);g.rotate(-0.38);g.globalAlpha=.78;
    g.strokeStyle='#C0392B';g.fillStyle='#C0392B';g.lineWidth=10;g.strokeRect(-330,-90,660,180);
    g.font='800 120px '+DISPLAY;g.fillText('REVOKED',0,40);g.restore();
  }
}
function render(canvas,c){
  draw(canvas,c);
  /* draw again once the web fonts are ready so the picture uses them */
  if(document.fonts&&document.fonts.load){
    Promise.all([document.fonts.load("800 96px 'Bricolage Grotesque'"),document.fonts.load("400 30px 'DM Sans'"),document.fonts.load("500 22px 'IBM Plex Mono'")])
      .then(function(){if(document.body.contains(canvas))draw(canvas,c)}).catch(function(){});
  }
}
function safeName(s){return String(s||'certificate').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'')||'certificate'}
function download(canvas,c){
  var fname='Certificate-'+safeName(c.name)+'-'+c.id+'.png';
  if(canvas.toBlob){
    canvas.toBlob(function(b){
      var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fname;
      document.body.appendChild(a);a.click();
      setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
    },'image/png');
  }
}
function print(canvas){
  var area=document.getElementById('printarea');if(!area)return;
  area.innerHTML='<img alt="Certificate" src="'+canvas.toDataURL('image/png')+'">';
  setTimeout(function(){window.print()},50);
}
DD.cert={draw:render,download:download,print:print};
})();
