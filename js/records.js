let _recTab='year';

function cycleRecTab(){
  const cycle=['year','month','day'];
  _recTab=cycle[(cycle.indexOf(_recTab)+1)%cycle.length];
  renderRecords();
}

function renderRecords(){
  const now=getTradeDate();
  const y=now.getFullYear(), m=now.getMonth()+1, d=now.getDate();
  const todayStr=y+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0');
  const thisMonthStr=y+'-'+String(m).padStart(2,'0');
  const thisYearStr=String(y);

  const labels={year:'年', month:'月', day:'日'};
  const btn=document.getElementById('rec-tab-btn');
  if(btn) btn.textContent=labels[_recTab];

  function setRec(id, dateId, val, dateVal, color){
    const el=document.getElementById(id);
    const de=document.getElementById(dateId);
    if(el){ el.textContent=val; el.style.webkitTextFillColor=color||'#e8d8b0'; el.style.color=color||'#e8d8b0'; }
    if(de){ de.textContent=dateVal; de.style.webkitTextFillColor='#5a6a8a'; }
  }

  const groups={};

  if(_recTab==='day'){
    trades.filter(t=>t.date<todayStr).forEach(t=>{
      if(!groups[t.date]) groups[t.date]=[];
      groups[t.date].push(t.pnl);
    });
  } else if(_recTab==='month'){
    trades.filter(t=>!t.date.startsWith(thisMonthStr)&&t.date<todayStr).forEach(t=>{
      const ym=t.date.slice(0,7);
      if(!groups[ym]) groups[ym]=[];
      groups[ym].push(t.pnl);
    });
  } else {
    trades.filter(t=>!t.date.startsWith(thisYearStr)).forEach(t=>{
      const yr=t.date.slice(0,4);
      if(!groups[yr]) groups[yr]=[];
      groups[yr].push(t.pnl);
    });
  }

  const entries=Object.entries(groups);

  const curLabels={year:'今年暫定', month:'今月暫定', day:'今日暫定'};
  const curLabel=curLabels[_recTab];

  let curTrades;
  if(_recTab==='day') curTrades=trades.filter(t=>t.date===todayStr);
  else if(_recTab==='month') curTrades=trades.filter(t=>t.date.startsWith(thisMonthStr));
  else curTrades=trades.filter(t=>t.date.startsWith(thisYearStr));

  const curGroups={};
  if(_recTab==='day'){
    curTrades.forEach(t=>{ if(!curGroups[t.date]) curGroups[t.date]=[]; curGroups[t.date].push(t.pnl); });
  } else if(_recTab==='month'){
    curTrades.forEach(t=>{ const ym=t.date.slice(0,7); if(!curGroups[ym]) curGroups[ym]=[]; curGroups[ym].push(t.pnl); });
  } else {
    curTrades.forEach(t=>{ const yr=t.date.slice(0,4); if(!curGroups[yr]) curGroups[yr]=[]; curGroups[yr].push(t.pnl); });
  }

  function calcBestFrom(grps){
    const ents=Object.entries(grps);
    if(!ents.length) return null;
    let bp=null,bpf=null,brr=null,noL=true;
    ents.forEach(([key,pnls])=>{
      const total=pnls.reduce((s,p)=>s+p,0);
      if(bp===null||total>bp) bp=total;
      const wins=pnls.filter(p=>p>0),losses=pnls.filter(p=>p<0);
      const gw=wins.reduce((s,p)=>s+p,0),gl=Math.abs(losses.reduce((s,p)=>s+p,0));
      const pf=gl>0?gw/gl:(gw>0?99:0);
      if(bpf===null||pf>bpf) bpf=pf;
      if(losses.length>0){
        noL=false;
        const avgW=wins.length?gw/wins.length:0,avgL=gl/losses.length;
        const rr=avgL>0?avgW/avgL:0;
        if(brr===null||rr>brr) brr=rr;
      }
    });
    return {pnl:bp,pf:bpf,rr:brr,noLoss:noL};
  }

  const cur=calcBestFrom(curGroups);

  function subTxt(val, fmt){ return cur&&val!==null ? curLabel+': '+fmt(val) : curLabel+': データなし'; }

  if(!entries.length){
    setRec('rec-pnl','rec-pnl-date','—', cur?subTxt(cur.pnl,v=>(v>=0?'+':'')+Math.round(v).toLocaleString()+'円'):'データなし','#3a4a6a');
    setRec('rec-pf','rec-pf-date','—', cur?subTxt(cur.pf,v=>v>=99?'∞':v.toFixed(2)):'データなし','#3a4a6a');
    setRec('rec-rr','rec-rr-date','—', cur?(cur.noLoss?curLabel+': 無敗北':subTxt(cur.rr,v=>v.toFixed(2))):'データなし','#3a4a6a');
    return;
  }

  function fmtKey(key){
    if(_recTab==='day') return key.slice(5).replace('-','/');
    if(_recTab==='month'){const p=key.split('-');return p[1]+'月';}
    return key+'年';
  }

  let bestPnl=null, bestPnlKey='';
  let bestPf=null, bestPfKey='';
  let bestRr=null, bestRrKey='', noLoss=true;

  entries.forEach(([key, pnls])=>{
    const total=pnls.reduce((s,p)=>s+p,0);
    if(bestPnl===null||total>bestPnl){ bestPnl=total; bestPnlKey=key; }

    const wins=pnls.filter(p=>p>0), losses=pnls.filter(p=>p<0);
    const gw=wins.reduce((s,p)=>s+p,0);
    const gl=Math.abs(losses.reduce((s,p)=>s+p,0));
    const pf=gl>0?gw/gl:(gw>0?99:0);
    if(bestPf===null||pf>bestPf){ bestPf=pf; bestPfKey=key; }

    if(losses.length>0){
      noLoss=false;
      const avgW=wins.length?gw/wins.length:0;
      const avgL=gl/losses.length;
      const rr=avgL>0?avgW/avgL:0;
      if(bestRr===null||rr>bestRr){ bestRr=rr; bestRrKey=key; }
    }
  });

  function setRecFull(id, dateId, val, dateVal, color, sub, subColor){
    const el=document.getElementById(id);
    const de=document.getElementById(dateId);
    if(el){ el.textContent=val; el.style.webkitTextFillColor=color||'#e8d8b0'; el.style.color=color||'#e8d8b0'; }
    if(de){
      const sc=subColor||'#5a6a8a';
      de.innerHTML=dateVal+(sub?'<br><span style="font-size:10px;font-weight:700;color:'+sc+';-webkit-text-fill-color:'+sc+';">'+sub+'</span>':'');
    }
  }

  const curPnlSub=cur&&cur.pnl!==null?curLabel+': '+(cur.pnl>=0?'+':'')+Math.round(cur.pnl).toLocaleString()+'円':curLabel+': データなし';
  const curPnlColor=cur&&cur.pnl!==null?(cur.pnl>=0?'#2dcc8a':'#ff4444'):'#5a6a8a';
  const curPfSub=cur&&cur.pf!==null?curLabel+': '+(cur.pf>=99?'∞':cur.pf.toFixed(2)):curLabel+': データなし';
  const curRrSub=cur?(cur.noLoss?curLabel+': 無敗北':cur.rr!==null?curLabel+': '+cur.rr.toFixed(2):curLabel+': データなし'):curLabel+': データなし';

  setRecFull('rec-pnl','rec-pnl-date',
    bestPnl!==null?(bestPnl>=0?'+':'')+Math.round(bestPnl).toLocaleString()+'円':'—',
    bestPnlKey?fmtKey(bestPnlKey):'',
    bestPnl>=0?'#2dcc8a':'#ff4444', curPnlSub, curPnlColor);

  const pfColor=bestPf>=99||bestPf>=1.5?'#2dcc8a':bestPf<1?'#ff4444':'#8a9ab0';
  const curPfColor=cur&&cur.pf!==null?(cur.pf>=99||cur.pf>=1.5?'#2dcc8a':cur.pf<1?'#ff4444':'#8a9ab0'):'#5a6a8a';
  setRecFull('rec-pf','rec-pf-date',
    bestPf!==null?(bestPf>=99?'∞':bestPf.toFixed(2)):'—',
    bestPfKey?fmtKey(bestPfKey):'',
    pfColor, curPfSub, curPfColor);

  if(noLoss){
    setRecFull('rec-rr','rec-rr-date','無敗北','負けなし','#2dcc8a', curRrSub, '#2dcc8a');
  } else {
    const rrColor=bestRr>=2?'#2dcc8a':bestRr<1?'#ff4444':'#8a9ab0';
    const curRrColor=cur&&cur.rr!==null?(cur.rr>=2?'#2dcc8a':cur.rr<1?'#ff4444':'#8a9ab0'):'#5a6a8a';
    setRecFull('rec-rr','rec-rr-date',
      bestRr!==null?bestRr.toFixed(2):'—',
      bestRrKey?fmtKey(bestRrKey):'',
      rrColor, curRrSub, curRrColor);
  }
}

const DEFAULT_CARDS = [
  {id:'s-pnl',       label:'累計損益',     show:true},
  {id:'s-total-win', label:'総利益',       show:true},
  {id:'s-total-loss',label:'総損失',       show:true},
  {id:'s-cnt',       label:'トレード数',   show:true},
  {id:'s-win-cnt',   label:'勝ちトレード', show:true},
  {id:'s-loss-cnt',  label:'負けトレード', show:true},
  {id:'s-wr',        label:'勝率',         show:true},
  {id:'s-pf',        label:'PF',           show:true},
  {id:'s-rr',        label:'平均RR',       show:true},
  {id:'s-avg-win',   label:'平均利益',     show:true},
  {id:'s-avg-loss',  label:'平均損失',     show:true},
  {id:'s-best-win',  label:'最高利益',     show:true},
  {id:'s-best-loss', label:'最高損失',     show:true},
];
let _cardSettings = null;

function loadCardSettings(){
  if(_cardSettings) return;
  try{
    const s=localStorage.getItem('card_settings_v1');
    if(s) _cardSettings=JSON.parse(s);
    else _cardSettings=DEFAULT_CARDS.map(c=>({...c}));
  }catch(e){ _cardSettings=DEFAULT_CARDS.map(c=>({...c})); }
}

function saveCardSettings(){
  const list=document.getElementById('card-settings-list');
  const rows=list.querySelectorAll('[data-card-id]');
  _cardSettings=Array.from(rows).map(row=>{
    const id=row.dataset.cardId;
    const show=row.querySelector('input[type=checkbox]').checked;
    const label=DEFAULT_CARDS.find(c=>c.id===id)?.label||id;
    return {id,label,show};
  });
  localStorage.setItem('card_settings_v1',JSON.stringify(_cardSettings));
  applyCardSettings();
  showToast('✅ 設定を保存しました');
}

function applyCardSettings(){
  loadCardSettings();
  const statsBar=document.querySelector('.stats-bar');
  if(!statsBar) return;
  const allCards=[...statsBar.querySelectorAll('.stat-card')];
  allCards.forEach(c=>c.style.display='none');
  _cardSettings.forEach(setting=>{
    const card=allCards.find(c=>c.querySelector('#'+setting.id));
    if(card){
      card.style.display=setting.show?'':'none';
      if(setting.show) statsBar.appendChild(card);
    }
  });
}

function renderCardSettings(){
  loadCardSettings();
  const list=document.getElementById('card-settings-list');
  list.innerHTML=_cardSettings.map(c=>`
    <div data-card-id="${c.id}" style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">
      <span style="color:#9b6dff;font-size:16px;cursor:grab;">&#10783;</span>
      <input type="checkbox" ${c.show?'checked':''} style="width:16px;height:16px;accent-color:#2dcc8a;cursor:pointer;">
      <span style="font-size:13px;color:var(--text);flex:1;">${c.label}</span>
    </div>
  `).join('');
  initCardDragDrop(list);
}

function initCardDragDrop(list){
  let dragSrc=null;
  const getRows=()=>list.querySelectorAll('[data-card-id]');
  getRows().forEach(row=>{
    row.setAttribute('draggable','true');
    row.addEventListener('dragstart',e=>{dragSrc=row;row.style.opacity='.4';});
    row.addEventListener('dragend',e=>{row.style.opacity='';getRows().forEach(r=>r.style.borderTop='');});
    row.addEventListener('dragover',e=>{e.preventDefault();getRows().forEach(r=>r.style.borderTop='');row.style.borderTop='2px solid #e8b84b';});
    row.addEventListener('drop',e=>{
      e.preventDefault();
      if(dragSrc===row)return;
      const allRows=[...getRows()];
      const si=allRows.indexOf(dragSrc),ti=allRows.indexOf(row);
      if(si<ti) row.after(dragSrc);
      else row.before(dragSrc);
      getRows().forEach(r=>r.style.borderTop='');
    });
  });
}
