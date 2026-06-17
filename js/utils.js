function toDateStr(d){
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  return y+'-'+m+'-'+day;
}
function addDays(dateStr, n){
  const parts=dateStr.split('-');
  const d=new Date(+parts[0],+parts[1]-1,+parts[2]);
  d.setDate(d.getDate()+n);
  return toDateStr(d);
}
function nextBizDay(dateStr){
  const parts=dateStr.split('-');
  const d=new Date(+parts[0],+parts[1]-1,+parts[2]);
  d.setDate(d.getDate()+1);
  while(d.getDay()===0||d.getDay()===6) d.setDate(d.getDate()+1);
  return toDateStr(d);
}

function initDateSel(prefix, fromYear=2024, toYear=2030){
  const yEl=document.getElementById(prefix+'-y');
  const mEl=document.getElementById(prefix+'-m');
  const dEl=document.getElementById(prefix+'-d');
  if(!yEl)return;
  yEl.innerHTML='<option value="">年</option>';
  for(let y=fromYear;y<=toYear;y++) yEl.innerHTML+=`<option value="${y}">${y}</option>`;
  mEl.innerHTML='<option value="">月</option>';
  for(let m=1;m<=12;m++) mEl.innerHTML+=`<option value="${String(m).padStart(2,'0')}">${m}</option>`;
  dEl.innerHTML='<option value="">日</option>';
  for(let d=1;d<=31;d++) dEl.innerHTML+=`<option value="${String(d).padStart(2,'0')}">${d}</option>`;
}
function getDateSel(prefix){
  const y=document.getElementById(prefix+'-y').value;
  const m=document.getElementById(prefix+'-m').value;
  const d=document.getElementById(prefix+'-d').value;
  if(!y||!m||!d)return '';
  return y+'-'+m+'-'+d;
}
function setDateSel(prefix, dateStr){
  if(!dateStr)return;
  const parts=dateStr.split('-');
  const yEl=document.getElementById(prefix+'-y');
  const mEl=document.getElementById(prefix+'-m');
  const dEl=document.getElementById(prefix+'-d');
  if(yEl) yEl.value=parts[0]||'';
  if(mEl) mEl.value=parts[1]||'';
  if(dEl) dEl.value=parts[2]||'';
}

function showToast(msg){
  const old=document.getElementById('_toast');if(old)old.remove();
  const el=document.createElement('div');el.id='_toast';el.textContent=msg;
  el.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);'
    +'background:#0d1528;border:2px solid #e8b84b;border-radius:28px;'
    +'padding:12px 24px;font-size:13px;font-weight:800;color:#e8b84b;'
    +'box-shadow:0 0 32px #e8b84b55;z-index:2147483647;'
    +'pointer-events:none;white-space:nowrap;opacity:0;transition:opacity .3s;';
  document.body.insertBefore(el,document.body.firstChild);
  void el.offsetWidth;el.style.opacity='1';
  setTimeout(()=>{el.style.opacity='0';setTimeout(()=>el.remove(),300);},2200);
}

function showHelp(title, body){
  document.getElementById('help-title').textContent=title;
  document.getElementById('help-body').textContent=body;
  document.getElementById('help-modal').style.display='flex';
}
function closeHelp(){
  document.getElementById('help-modal').style.display='none';
}

let _confirmCb=null;
function showConfirm(msg, cb){
  _confirmCb=cb;
  document.getElementById('confirm-msg').textContent=msg;
  const m=document.getElementById('confirmModal');
  m.style.display='flex';
}
function confirmOK(){
  document.getElementById('confirmModal').style.display='none';
  if(_confirmCb){ _confirmCb(); _confirmCb=null; }
}
function confirmCancel(){
  document.getElementById('confirmModal').style.display='none';
  _confirmCb=null;
}

function switchTab(tab,el){
  document.getElementById('tab-analytics').classList.toggle('hidden',tab!=='analytics');
  document.getElementById('tab-ach').classList.toggle('hidden',tab!=='ach');
  document.getElementById('tab-settings').classList.toggle('hidden',tab!=='settings');
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  if(tab==='ach') renderRecords();
  if(tab==='settings') renderCardSettings();
}
