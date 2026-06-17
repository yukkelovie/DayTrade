function renderAnalytics(){
  const st=calcStats();
  updateStatCards();
  if(st){
    renderSummary();
    if(_statTab!=='all'){
      const prevLabel=getPrevLabel(_statTab);
      const prevTabKey = _statTab==='day'?'prevDay':_statTab==='week'?'prevWeek':_statTab==='month'?'prevMonth':_statTab==='year'?'prevYear':null;
      const prevTrades=prevTabKey?getTradesForPrev(prevTabKey):[];
      const ps=calcStatsFor(prevTrades);
      function setSub(id, val){
        const el=document.getElementById(id+'-sub');
        if(el) el.textContent=prevLabel+': '+val;
      }
      if(ps){
        setSub('s-pnl',(ps.totalPnl>=0?'+':'')+Math.round(ps.totalPnl).toLocaleString()+'円');
        setSub('s-cnt',ps.count+'回');
        setSub('s-wr',ps.winRate.toFixed(1)+'%');
        setSub('s-pf',ps.pf>=99?'∞':ps.pf.toFixed(2));
        setSub('s-rr',ps.rr.toFixed(2));
        setSub('s-avg-win','+'+Math.round(ps.avgWin).toLocaleString()+'円');
        setSub('s-avg-loss','-'+Math.round(ps.avgLoss).toLocaleString()+'円');
      } else {
        ['s-pnl','s-cnt','s-wr','s-pf','s-rr','s-avg-win','s-avg-loss'].forEach(id=>{
          const el=document.getElementById(id+'-sub');
          if(el) el.textContent=prevLabel+': データなし';
        });
      }
    } else {
      ['s-pnl','s-cnt','s-wr','s-pf','s-rr','s-avg-win','s-avg-loss'].forEach(id=>{
        const sub=document.getElementById(id+'-sub');
        if(sub) sub.textContent='';
      });
    }
  }
  const show=!!st;
  ['wrap-records','wrap-equity','wrap-monthly','wrap-rank','wrap-log'].forEach(id=>{
    document.getElementById(id).style.display=show?'':'none';
  });
  if(!show){
    const pel=document.getElementById('s-pnl');
    pel.childNodes[0].textContent='¥0';
    pel.style.color='var(--dim)';pel.style.webkitTextFillColor='#3a4a6a';
    document.getElementById('s-wr').textContent='0%';
    document.getElementById('s-pf').textContent='0.0';
    document.getElementById('s-rr').textContent='0.0';
    renderSummary();renderStreak();
    return;
  }
  document.getElementById('s-total').textContent=st.total+'回';
  document.getElementById('s-wl').textContent=st.wins.length+' / '+st.losses.length;

  const avgwEl=document.getElementById('s-avgw');
  avgwEl.textContent='+'+Math.round(st.avgWin).toLocaleString()+'円';
  avgwEl.style.color='#2dcc8a';avgwEl.style.webkitTextFillColor='#2dcc8a';

  const avglEl=document.getElementById('s-avgl');
  avglEl.textContent='-'+Math.round(st.avgLoss).toLocaleString()+'円';
  avglEl.style.color='#ff4444';avglEl.style.webkitTextFillColor='#ff4444';

  const wrColor=st.winRate>=50?'#2dcc8a':'#ff4444';
  ['s-wr','s-wr2'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.style.color=wrColor;el.style.webkitTextFillColor=wrColor;}
  });

  const pfColor=st.pf>=1.5?'#2dcc8a':st.pf<1?'#ff4444':'#8a9ab0';
  ['s-pf','s-pf2'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.style.color=pfColor;el.style.webkitTextFillColor=pfColor;}
  });

  const rrColor=st.rr>=2?'#2dcc8a':st.rr<1?'#ff4444':'#8a9ab0';
  ['s-rr','s-rr2'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.style.color=rrColor;el.style.webkitTextFillColor=rrColor;}
  });

  ['s-avg-win','s-avgw'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.style.color='#2dcc8a';el.style.webkitTextFillColor='#2dcc8a';}
  });
  ['s-avg-loss','s-avgl'].forEach(id=>{
    const el=document.getElementById(id);
    if(el){el.style.color='#ff4444';el.style.webkitTextFillColor='#ff4444';}
  });
  drawEquity();drawMonthly();drawRank();renderStreak();renderAdvice();
  if(trades.length){
    const lastDate=trades[trades.length-1].date;
    if(!getDateSel('log-from')){ setDateSel('log-from',lastDate); setDateSel('log-to',lastDate); }
  }
  drawLog();
}

let _periodTab='all';
const _periodCycle=['all','year','month','day'];

function cyclePeriod(){
  cycleStatTab();
}

function renderSummary(){
  const btnLabels={all:'全トレード',year:'今年',month:'今月',day:'今日'};
  const btn=document.getElementById('period-btn');
  if(btn) btn.textContent=btnLabels[_statTab]||'全トレード';

  const cur=calcStatsFor(getTradesFor(_statTab));
  const prevLabel=_statTab!=='all'?getPrevLabel(_statTab):null;
  const prevTabKey2=_statTab==='day'?'prevDay':_statTab==='week'?'prevWeek':_statTab==='month'?'prevMonth':_statTab==='year'?'prevYear':null;
  const par=prevLabel?calcStatsFor(getTradesForPrev(prevTabKey2)):null;
  const parLabel=prevLabel||'';

  function subTxt(val,parVal,fmt){
    if(!par||parVal===undefined||parVal===null)return '';
    return parLabel+':'+fmt(parVal);
  }

  if(!cur){
    ['s-total','s-wl','s-wr2','s-avgw','s-avgl','s-pf2','s-rr2'].forEach(id=>{
      const el=document.getElementById(id);
      if(el){el.textContent='—';el.style.webkitTextFillColor='#3a4a6a';}
    });
    ['s-total-sub','s-wl-sub','s-wr2-sub','s-avgw-sub','s-avgl-sub','s-pf2-sub','s-rr2-sub'].forEach(id=>{
      const el=document.getElementById(id);if(el)el.textContent='';
    });
    return;
  }

  function setCard(id,val,color,subId,subVal){
    const el=document.getElementById(id);
    if(el){el.textContent=val;el.style.webkitTextFillColor=color||'#e8d8b0';}
    const sub=document.getElementById(subId);
    if(sub)sub.textContent=subVal||'';
  }

  const jade='#2dcc8a',red='#ff4444',neu='#e8d8b0';
  const pnlEl=document.getElementById('s-pnl');
  if(pnlEl){
    const pnlColor=cur.totalPnl>0?jade:cur.totalPnl<0?red:neu;
    pnlEl.style.color=pnlColor;
    pnlEl.style.webkitTextFillColor=pnlColor;
  }
  setCard('s-total',cur.count+'回',neu,'s-total-sub',par?'('+parLabel+':'+par.count+'回)':'');
  setCard('s-wl',cur.wins+'/'+cur.losses,neu,'s-wl-sub',par?'('+parLabel+':'+par.wins+'/'+par.losses+')':'');
  const grey='#8a9ab0';
  setCard('s-wr2',cur.winRate.toFixed(1)+'%',cur.winRate>=50?jade:red,'s-wr2-sub',par?'('+parLabel+':'+par.winRate.toFixed(1)+'%)':'');
  setCard('s-avgw','+'+(Math.round(cur.avgWin)).toLocaleString()+'円',jade,'s-avgw-sub',par?'('+parLabel+':+'+(Math.round(par.avgWin)).toLocaleString()+'円)':'');
  setCard('s-avgl','-'+(Math.round(cur.avgLoss)).toLocaleString()+'円',red,'s-avgl-sub',par?'('+parLabel+':-'+(Math.round(par.avgLoss)).toLocaleString()+'円)':'');
  setCard('s-pf2',cur.pf>=99?'∞':cur.pf.toFixed(2),cur.pf>=1.5?jade:cur.pf<1?red:grey,'s-pf2-sub',par?'('+parLabel+':'+(par.pf>=99?'∞':par.pf.toFixed(2))+')':'');
  setCard('s-rr2',cur.rr.toFixed(2),cur.rr>=2?jade:cur.rr<1?red:grey,'s-rr2-sub',par?'('+parLabel+':'+par.rr.toFixed(2)+')':'');
}

function showChartTip(el, clientX, clientY, html){
  const tip=document.getElementById('chart-tooltip');
  tip.innerHTML=html;tip.style.display='block';
  const tw=tip.offsetWidth, th=tip.offsetHeight;
  let x=clientX+12, y=clientY-th-8;
  if(x+tw>window.innerWidth) x=clientX-tw-12;
  if(y<0) y=clientY+12;
  tip.style.left=x+'px';tip.style.top=y+'px';
}
function hideChartTip(){ document.getElementById('chart-tooltip').style.display='none'; }

let _eqPts=[], _eqPad=36, _eqXS=1, _eqW=300, _eqH=140;
let _equityPeriod = 'all';

function setEquityPeriod(period, btn){
  _equityPeriod = period;
  document.querySelectorAll('.eq-period-btn').forEach(b=>{
    b.style.background='none';
    b.style.borderColor='var(--dim)';
    b.style.color='var(--dim)';
    b.style.webkitTextFillColor='var(--dim)';
  });
  btn.style.background='linear-gradient(135deg,#1a1400,#2a2000)';
  btn.style.borderColor='var(--gold)';
  btn.style.color='var(--gold)';
  btn.style.webkitTextFillColor='var(--gold)';
  drawEquity();
}

function drawEquity(){
  const c=document.getElementById('chart-equity');
  const ctx=c.getContext('2d');
  const W=c.offsetWidth||300,H=c.offsetHeight||140;
  c.width=W*2;c.height=H*2;ctx.scale(2,2);ctx.clearRect(0,0,W,H);

  const filteredTrades = getFilteredByOffset();
  const isDay = _statTab==='day';

  let pts;
  if(isDay){
    if(!filteredTrades.length) return;
    let cum=0;
    pts=[{d:'',v:0,day:0},...filteredTrades.map((t,i)=>{cum+=t.pnl;return{d:t.date,v:cum,day:t.pnl,idx:i+1};})];
  } else {
    const daily={};
    filteredTrades.forEach(t=>{daily[t.date]=(daily[t.date]||0)+t.pnl;});
    const dates=Object.keys(daily).sort();
    if(!dates.length)return;
    let cum=0;
    pts=[{d:'',v:0},...dates.map(d=>{cum+=daily[d];return{d,v:cum,day:daily[d]};})];
  }
  const vals=pts.map(p=>p.v);
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const pad=36,toY=v=>pad+(H-pad*1.5)*(mx-v)/rng;
  const xS=(W-pad*1.5)/(pts.length-1||1);

  _eqPts=pts;_eqPad=pad;_eqXS=xS;_eqW=W;_eqH=H;

  ctx.strokeStyle='#1a2238';ctx.lineWidth=.5;
  for(let i=0;i<=4;i++){
    const y=toY(mx-rng*i/4);
    ctx.beginPath();ctx.moveTo(pad,y);ctx.lineTo(W-8,y);ctx.stroke();
    const val=mx-rng*i/4;
    ctx.fillStyle='#3a4a6a';ctx.font='10px sans-serif';ctx.textAlign='right';
    ctx.fillText((val>=0?'+':'')+Math.round(val/1000)+'k',pad-2,y+4);
  }

  let lastMonth='';
  pts.forEach((p,i)=>{
    if(!p.d)return;
    const m=p.d.slice(5,7);
    if(m!==lastMonth){
      lastMonth=m;
      const x=pad+i*xS;
      ctx.strokeStyle='#1a2238';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(x,pad);ctx.lineTo(x,H-12);ctx.stroke();
      ctx.fillStyle='#3a4a6a';ctx.font='9px sans-serif';ctx.textAlign='center';
      ctx.fillText(p.d.slice(5,7)+'月',x,H-2);
    }
  });

  const lastVal=vals[vals.length-1];
  const grad=ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0,lastVal>=0?'#2dcc8a33':'#ff444433');
  grad.addColorStop(1,'transparent');
  ctx.beginPath();ctx.moveTo(pad,toY(pts[0].v));
  pts.forEach((p,i)=>ctx.lineTo(pad+i*xS,toY(p.v)));
  ctx.lineTo(pad+(pts.length-1)*xS,H);ctx.lineTo(pad,H);ctx.closePath();
  ctx.fillStyle=grad;ctx.fill();
  ctx.beginPath();ctx.moveTo(pad,toY(pts[0].v));
  pts.forEach((p,i)=>ctx.lineTo(pad+i*xS,toY(p.v)));
  ctx.strokeStyle=lastVal>=0?'#2dcc8a':'#ff4444';ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();

  c.onmousemove=c.ontouchmove=function(e){
    e.preventDefault();
    const rect=c.getBoundingClientRect();
    const clientX=e.touches?e.touches[0].clientX:e.clientX;
    const clientY=e.touches?e.touches[0].clientY:e.clientY;
    const cx=(clientX-rect.left)*(W/rect.width);
    const idx=Math.round((cx-_eqPad)/_eqXS);
    if(idx<1||idx>=_eqPts.length)return;
    const p=_eqPts[idx];
    const dayPnl=p.day||0;
    const cum=p.v;
    const col=dayPnl>=0?'#2dcc8a':'#ff4444';
    const cumCol=cum>=0?'#2dcc8a':'#ff4444';
    const label=_statTab==='day'?(p.idx+'件目'):p.d.slice(5).replace('-','/');
    showChartTip(c,clientX,clientY,
      '<span style="color:#c8d4f0">'+label+'</span><br>'
      +(_statTab==='day'?'損益: ':'当日: ')+'<span style="color:'+col+'">'+(dayPnl>=0?'+':'')+dayPnl.toLocaleString()+'円</span><br>'
      +'累計: <span style="color:'+cumCol+'">'+(cum>=0?'+':'')+Math.round(cum).toLocaleString()+'円</span>'
    );
  };
  c.onmouseleave=c.ontouchend=hideChartTip;
}

let _moBars=[];

function drawMonthly(){
  const monthly={};
  trades.forEach(t=>{const m=t.date.slice(0,7);monthly[m]=(monthly[m]||0)+t.pnl;});
  const months=Object.keys(monthly).sort(),vals=months.map(m=>monthly[m]);
  const c=document.getElementById('chart-monthly');
  const ctx=c.getContext('2d');
  const W=c.offsetWidth||300,H=c.offsetHeight||140;
  c.width=W*2;c.height=H*2;ctx.scale(2,2);ctx.clearRect(0,0,W,H);
  if(!months.length)return;
  const mx=Math.max(...vals.map(Math.abs),1);
  const cY=H/2,bW=(W-32)/months.length*0.55,bG=(W-32)/months.length;

  ctx.strokeStyle='#2a3a58';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(16,cY);ctx.lineTo(W-8,cY);ctx.stroke();

  _moBars=[];
  months.forEach((m,i)=>{
    const v=vals[i],x=16+i*bG+bG/2-bW/2;
    const bH=Math.abs(v)/mx*(H/2-16),y=v>=0?cY-bH:cY;
    ctx.fillStyle=v>=0?'#2dcc8a77':'#ff444477';ctx.fillRect(x,y,bW,bH);
    ctx.fillStyle='#3a4a6a';ctx.font='9px sans-serif';ctx.textAlign='center';
    ctx.fillText(parseInt(m.slice(5))+'月',x+bW/2,H-4);
    ctx.fillStyle=v>=0?'#2dcc8a':'#ff4444';
    ctx.fillText((v>=0?'+':'')+Math.round(v/1000)+'k',x+bW/2,v>=0?y-4:y+bH+12);
    _moBars.push({m, v, x, bW, y, bH});
  });

  c.onmousemove=c.ontouchmove=function(e){
    e.preventDefault();
    const rect=c.getBoundingClientRect();
    const clientX=e.touches?e.touches[0].clientX:e.clientX;
    const clientY=e.touches?e.touches[0].clientY:e.clientY;
    const cx=(clientX-rect.left)*(W/rect.width);
    const bar=_moBars.find(b=>cx>=b.x&&cx<=b.x+b.bW);
    if(!bar)return;
    const col=bar.v>=0?'#2dcc8a':'#ff4444';
    showChartTip(c,clientX,clientY,
      '<span style="color:#c8d4f0">'+parseInt(bar.m.slice(5))+'月 ('+bar.m+')</span><br>'
      +'<span style="color:'+col+'">'+(bar.v>=0?'+':'')+Math.round(bar.v).toLocaleString()+'円</span>'
    );
  };
  c.onmouseleave=c.ontouchend=hideChartTip;
}

function drawRR(st){
  const aL=st.avgLoss||1;
  const ranges=[
    {label:'RR < 1.0',color:'var(--dim)',  check:t=>t.pnl>0&&t.pnl/aL<1},
    {label:'RR 1〜2', color:'var(--gold)', check:t=>t.pnl>0&&t.pnl/aL>=1&&t.pnl/aL<2},
    {label:'RR 2〜3', color:'#48b0f0',     check:t=>t.pnl>0&&t.pnl/aL>=2&&t.pnl/aL<3},
    {label:'RR 3+',   color:'var(--jade)', check:t=>t.pnl>0&&t.pnl/aL>=3},
    {label:'負け',    color:'var(--red)',  check:t=>t.pnl<0},
  ];
  const tot=trades.length||1;
  document.getElementById('rr-dist').innerHTML=ranges.map(r=>{
    const n=trades.filter(r.check).length,pct=(n/tot*100).toFixed(0);
    return '<div class="rr-bar-wrap">'
      +'<div class="rr-bar-label"><span>'+r.label+'</span><span style="color:var(--text)">'+n+'回 ('+pct+'%)</span></div>'
      +'<div class="rr-bar-bg"><div class="rr-bar-fill" style="width:'+pct+'%;background:'+r.color+'"></div></div>'
      +'</div>';
  }).join('');
}

function drawRank(){
  const defs=[
    {key:'bronze',label:'🥉 BRONZE',sub:'〜1万'},
    {key:'silver',label:'🥈 SILVER',sub:'1〜3万'},
    {key:'gold',  label:'🥇 GOLD',  sub:'3万〜'},
  ];
  document.getElementById('rank-grid').innerHTML=defs.map(d=>{
    const rt=trades.filter(t=>getRank(t.pnl)===d.key);
    const rw=rt.filter(t=>t.pnl>0);
    const rpnl=rt.reduce((s,t)=>s+t.pnl,0);
    const rwr=rt.length?(rw.length/rt.length*100).toFixed(0):0;
    return '<div class="rank-card">'
      +'<div class="rank-badge rb-'+d.key+'">'+d.label+'</div>'
      +'<div style="font-size:8px;color:var(--dim);margin-bottom:4px">'+d.sub+'</div>'
      +'<div class="rank-stats">'+rt.length+'回<br>勝率<span> '+rwr+'%</span><br>'
      +'<span style="color:'+(rpnl>=0?'var(--jade)':'var(--red)')+';">'+(rpnl>=0?'+':'')+Math.round(rpnl).toLocaleString()+'円</span>'
      +'</div></div>';
  }).join('');
}

let _logReversed=true;
let _sortFiltered=null;
let _sortMode=false;
let _selectedIds=new Set();
let _tradesBackup = null;

function toggleSortMode(){
  _sortMode=!_sortMode;
  const btn=document.getElementById('sort-btn');
  if(_sortMode){
    _selectedIds=new Set();
    _tradesBackup=[...trades];
    btn.textContent='適用';
    btn.style.borderColor='#2dcc8a';
    btn.style.color='#2dcc8a';
    btn.style.background='linear-gradient(135deg,#001a0e,#002a18)';
    document.getElementById('reverse-btn').style.display='';
    document.getElementById('log-select-bar').style.display='flex';
    document.getElementById('delete-selected-btn').style.display='';
    document.getElementById('cancel-sort-btn').style.display='';
    document.getElementById('clear-all-btn').style.display='none';
    showToast('編集モード: チェックして複数選択、ドラッグで移動');
  } else {
    saveTrades();
    showToast('✅ 保存しました');
    btn.textContent='編集';
    btn.style.borderColor='#9b6dff';
    btn.style.color='#9b6dff';
    btn.style.background='linear-gradient(135deg,#0a0018,#14002a)';
    document.getElementById('reverse-btn').style.display='none';
    document.getElementById('log-select-bar').style.display='none';
    document.getElementById('delete-selected-btn').style.display='none';
    document.getElementById('cancel-sort-btn').style.display='none';
    document.getElementById('clear-all-btn').style.display='';
    _tradesBackup=null;
  }
  drawLog();
}
function cancelSortMode(){
  if(_tradesBackup){
    trades=[..._tradesBackup];
    _tradesBackup=null;
  }
  _sortMode=false;
  _selectedIds=new Set();
  const btn=document.getElementById('sort-btn');
  btn.textContent='編集';
  btn.style.borderColor='#9b6dff';
  btn.style.color='#9b6dff';
  btn.style.background='linear-gradient(135deg,#0a0018,#14002a)';
  document.getElementById('reverse-btn').style.display='none';
  document.getElementById('log-select-bar').style.display='none';
  document.getElementById('delete-selected-btn').style.display='none';
  document.getElementById('cancel-sort-btn').style.display='none';
  document.getElementById('clear-all-btn').style.display='';
  renderAnalytics();
  showToast('↩️ 変更を元に戻しました');
}

function toggleLogOrder(){
  _logReversed=!_logReversed;
  const btn=document.getElementById('log-order-btn');
  if(btn) btn.textContent=_logReversed?'new↓':'old↓';
  drawLog();
}

function resetLogFilter(){
  if(!trades.length)return;
  const lastDate=trades[trades.length-1].date;
  setDateSel('log-from',lastDate);
  setDateSel('log-to',lastDate);
  drawLog();
}

function drawLog(){
  const from=getDateSel('log-from');
  const to=getDateSel('log-to');
  let filtered=[...trades];
  if(from) filtered=filtered.filter(t=>t.date>=from);
  if(to)   filtered=filtered.filter(t=>t.date<=to);
  if(_logReversed) filtered.reverse();
  const total=filtered.reduce((s,t)=>s+t.pnl,0);
  const label=from&&to&&from===to
    ? from.slice(5).replace('-','/')+'の取引'
    : filtered.length+'件';
  document.getElementById('log-count').textContent=
    '('+label+(from||to?' / '+(total>=0?'+':'')+Math.round(total).toLocaleString()+'円':'')+')';
  const wrap=document.getElementById('log-wrap');
  if(!filtered.length){
    wrap.innerHTML='<div style="text-align:center;color:var(--dim);padding:20px;font-size:11px;">この期間の取引はありません</div>';
    return;
  }
  _sortFiltered=filtered;
  const countEl=document.getElementById('log-select-count');
  if(countEl) countEl.textContent=_selectedIds.size>0?_selectedIds.size+'件選択中':'';
  wrap.innerHTML=filtered.map(t=>{
    const id=t.id;
    const isSelected=_selectedIds.has(String(id));
    const rowStyle=isSelected?'background:#1a1040;border-left:3px solid #9b6dff;':'';
    return `<div class="log-row${_sortMode?' sort-active':''}" ${_sortMode?'draggable="true"':''} data-id="${id}" style="${rowStyle}">`
      +(_sortMode?`<input type="checkbox" ${isSelected?'checked':''} onclick="toggleSelectRow('${id}',event)" style="width:16px;height:16px;cursor:pointer;accent-color:#9b6dff;flex-shrink:0;">`:`<div></div>`)
      +`<div class="log-date">${t.date.slice(5)}</div>`
      +`<div class="log-pnl ${t.pnl>=0?'pos':'neg'}">${t.pnl>=0?'+':''}${t.pnl.toLocaleString()}円</div>`
      +`<div class="log-actions">`
      +(!_sortMode?`<button class="icon-btn" onclick="openEdit('${id}')">✏️</button>`:'')
      +`</div></div>`;
  }).join('');
  if(_sortMode) initDragDrop(wrap, filtered);
}

let _dragSrcId=null;
let _vibrated=false;

function deleteSelected(){
  if(_selectedIds.size===0){ showToast('⚠️ 削除する取引を選択してください'); return; }
  const count=_selectedIds.size;
  showConfirm(count+'件の取引を削除しますか？', ()=>{
    trades = trades.filter(t=>!_selectedIds.has(String(t.id)));
    if(_sortFiltered) _sortFiltered=_sortFiltered.filter(t=>!_selectedIds.has(String(t.id)));
    _selectedIds.clear();
    saveTrades();
    renderAnalytics();
    showToast('🗑 '+count+'件削除しました');
  });
}

function selectAllLog(){
  if(!_sortFiltered) return;
  _sortFiltered.forEach(t => _selectedIds.add(String(t.id)));
  drawLog();
}

function deselectAllLog(){
  _selectedIds.clear();
  drawLog();
}

function reverseSelected(){
  if(!_sortFiltered) return;
  if(_selectedIds.size < 2){ showToast('⚠️ 2件以上選択してください'); return; }

  const selectedIndices = [];
  const selectedItems = [];
  _sortFiltered.forEach((t, i) => {
    if(_selectedIds.has(String(t.id))){
      selectedIndices.push(i);
      selectedItems.push(t);
    }
  });

  const dates = new Set(selectedItems.map(t=>t.date));
  if(dates.size > 1){ showToast('⚠️ 同じ日の取引のみ並び替えできます'); return; }

  selectedItems.reverse();
  selectedIndices.forEach((idx, i) => {
    _sortFiltered[idx] = selectedItems[i];
  });

  const normalOrdered = _logReversed ? [..._sortFiltered].reverse() : _sortFiltered;
  const filteredSet = new Set(normalOrdered.map(t=>String(t.id)));
  const others = trades.filter(t=>!filteredSet.has(String(t.id)));
  trades = [...others, ...normalOrdered];

  _selectedIds.clear();
  drawLog();
  showToast('✅ 選択した取引を逆順にしました');
}

function toggleSelectRow(id, e){
  e.stopPropagation();
  const sid=String(id);
  if(_selectedIds.has(sid)) _selectedIds.delete(sid);
  else _selectedIds.add(sid);
  drawLog();
}

function initDragDrop(wrap, filtered){
  const rows=wrap.querySelectorAll('.log-row');
  rows.forEach(row=>{
    row.addEventListener('dragstart',e=>{
      _dragSrcId=row.dataset.id;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed='move';
    });
    row.addEventListener('dragend',e=>{
      row.classList.remove('dragging');
      wrap.querySelectorAll('.log-row').forEach(r=>r.classList.remove('drag-over'));
    });
    row.addEventListener('dragover',e=>{
      e.preventDefault();
      wrap.querySelectorAll('.log-row').forEach(r=>{r.classList.remove('drag-over');r.classList.remove('drag-over-bottom');});
      const rect=row.getBoundingClientRect();
      const mid=rect.top+rect.height/2;
      if(e.clientY>mid){
        row.classList.add('drag-over-bottom');
        row.dataset.dropPos='after';
      } else {
        row.classList.add('drag-over');
        row.dataset.dropPos='before';
      }
    });
    row.addEventListener('drop',e=>{
      e.preventDefault();
      if(_dragSrcId===row.dataset.id)return;
      reorderTrades(_dragSrcId, row.dataset.id, filtered, row.dataset.dropPos==='after');
    });
  });

  let touchSrc=null, ghost=null, longPressTimer=null, lastTarget=null;

  rows.forEach(row=>{
    row.addEventListener('touchstart',e=>{
      _vibrated=false;
      longPressTimer=setTimeout(()=>{
        touchSrc=row;
        if(navigator.vibrate) navigator.vibrate(30);
        ghost=row.cloneNode(true);
        ghost.style.cssText=`position:fixed;width:${row.offsetWidth}px;opacity:.85;
          box-shadow:0 8px 32px #9b6dff88;border:1px solid #9b6dff;border-radius:8px;
          background:#0d1528;z-index:9999;pointer-events:none;transform:scale(1.04);
          transition:transform .1s;`;
        const rect=row.getBoundingClientRect();
        ghost.style.left=rect.left+'px';
        ghost.style.top=rect.top+'px';
        document.body.appendChild(ghost);
        row.style.opacity='.3';
      },400);
    },{passive:true});

    row.addEventListener('touchmove',e=>{
      if(!touchSrc){
        clearTimeout(longPressTimer);
        return;
      }
      e.preventDefault();
      const touch=e.touches[0];
      if(ghost){
        ghost.style.left=(touch.clientX-ghost.offsetWidth/2)+'px';
        ghost.style.top=(touch.clientY-ghost.offsetHeight/2)+'px';
      }
      ghost.style.display='none';
      const el=document.elementFromPoint(touch.clientX,touch.clientY);
      ghost.style.display='';
      const targetRow=el&&el.closest('.log-row[data-id]');
      if(targetRow&&targetRow!==touchSrc){
        if(lastTarget!==targetRow){
          wrap.querySelectorAll('.log-row').forEach(r=>{r.classList.remove('drag-over');r.classList.remove('drag-over-bottom');});
          const rect=targetRow.getBoundingClientRect();
          const mid=rect.top+rect.height/2;
          if(touch.clientY>mid){
            targetRow.classList.add('drag-over-bottom');
            targetRow.dataset.dropPos='after';
          } else {
            targetRow.classList.add('drag-over');
            targetRow.dataset.dropPos='before';
          }
          if(navigator.vibrate) navigator.vibrate(15);
          lastTarget=targetRow;
        }
      }
    },{passive:false});

    row.addEventListener('touchend',e=>{
      clearTimeout(longPressTimer);
      if(!touchSrc){return;}
      if(ghost){ghost.remove();ghost=null;}
      touchSrc.style.opacity='';
      wrap.querySelectorAll('.log-row').forEach(r=>r.classList.remove('drag-over'));
      if(lastTarget&&lastTarget!==touchSrc){
        reorderTrades(touchSrc.dataset.id, lastTarget.dataset.id, filtered, lastTarget.dataset.dropPos==='after');
      }
      touchSrc=null;lastTarget=null;
    });

    row.addEventListener('touchcancel',e=>{
      clearTimeout(longPressTimer);
      if(ghost){ghost.remove();ghost=null;}
      if(touchSrc) touchSrc.style.opacity='';
      wrap.querySelectorAll('.log-row').forEach(r=>r.classList.remove('drag-over'));
      touchSrc=null;lastTarget=null;
    });
  });
}

function reorderTrades(srcId, targetId, filtered, insertAfter=false){
  const tgtT=filtered.find(t=>String(t.id)===String(targetId));
  if(!tgtT)return;

  const moveIds=_selectedIds.size>0 ? _selectedIds : new Set([String(srcId)]);
  const movingItems=filtered.filter(t=>moveIds.has(String(t.id)));
  if(!movingItems.length)return;

  const allSameDate=movingItems.every(t=>t.date===tgtT.date);
  if(!allSameDate){
    showToast('⚠️ 同じ日の取引のみ並び替えできます');
    return;
  }

  const remaining=filtered.filter(t=>!moveIds.has(String(t.id)));
  let tgtIdx=remaining.findIndex(t=>String(t.id)===String(targetId));
  if(tgtIdx===-1) tgtIdx=remaining.length;
  else if(insertAfter) tgtIdx+=1;
  remaining.splice(tgtIdx,0,...movingItems);
  filtered.length=0;
  remaining.forEach(t=>filtered.push(t));

  const normalOrdered=_logReversed?[...filtered].reverse():filtered;
  const filteredSet=new Set(normalOrdered.map(t=>String(t.id)));
  const others=trades.filter(t=>!filteredSet.has(String(t.id)));
  trades=[...others,...normalOrdered];

  _selectedIds.clear();
  drawLog();
}
