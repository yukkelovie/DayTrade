function calcStats(arr){
  const t=arr||trades;
  if(!t.length)return null;
  const wins=t.filter(t=>t.pnl>0), losses=t.filter(t=>t.pnl<0);
  const totalPnl=t.reduce((s,t)=>s+t.pnl,0);
  const winRate=wins.length/t.length*100;
  const totalWin=wins.reduce((s,t)=>s+t.pnl,0);
  const totalLoss=Math.abs(losses.reduce((s,t)=>s+t.pnl,0));
  const pf=totalLoss>0?totalWin/totalLoss:totalWin>0?99:0;
  const avgWin=wins.length?totalWin/wins.length:0;
  const avgLoss=losses.length?totalLoss/losses.length:0;
  const rr=avgLoss>0?avgWin/avgLoss:0;
  return{totalPnl,winRate,pf,rr,wins,losses,avgWin,avgLoss,total:t.length};
}

function getTradeDate(d){
  const dt = d || new Date();
  let result = new Date(dt);
  if(result.getHours() < 7){
    result.setDate(result.getDate()-1);
  }
  while(result.getDay()===0 || result.getDay()===6){
    result.setDate(result.getDate()-1);
  }
  return result;
}
function getTodayStr(){
  const d=getTradeDate();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function getMonthStr(){
  const d=getTradeDate();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
}
function getYearStr(){return String(getTradeDate().getFullYear());}

let _statTab='all';
let _statOffset=0;
let _statDayDate=null;
const _statTabCycle=['all','year','month','week','day'];

function skipWeekend(d, dir){
  while(d.getDay()===0 || d.getDay()===6){
    d.setDate(d.getDate() - dir);
  }
  return d;
}

function getWeekMonday(d){
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diff);
  return mon;
}

function navigateStatTab(dir){
  if(_statTab==='all') return;
  if(_statTab==='day'){
    const now=getTradeDate();
    let current = _statDayDate ? new Date(_statDayDate) : new Date(now);
    do {
      current.setDate(current.getDate() + dir);
    } while(current.getDay()===0 || current.getDay()===6);
    const nowMidnight=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    const curMidnight=new Date(current.getFullYear(),current.getMonth(),current.getDate());
    if(curMidnight >= nowMidnight){
      _statDayDate=null;
      _statOffset=0;
    } else {
      _statDayDate=new Date(current);
      _statOffset=-1;
    }
  } else {
    _statOffset += dir;
    if(_statOffset>0) _statOffset=0;
  }
  clearStatSubTexts();
  updateStatCards();
}

function getOffsetDate(){
  const now=getTradeDate();
  if(_statTab==='day'){
    return _statDayDate ? new Date(_statDayDate) : new Date(now);
  } else if(_statTab==='week'){
    const mon=getWeekMonday(now);
    mon.setDate(mon.getDate()+_statOffset*7);
    return mon;
  } else if(_statTab==='month'){
    const d=new Date(now); d.setMonth(d.getMonth()+_statOffset);
    return d;
  } else if(_statTab==='year'){
    const d=new Date(now); d.setFullYear(d.getFullYear()+_statOffset);
    return d;
  }
  return now;
}

function getOffsetLabel(){
  if(_statTab==='all') return '全トレード';
  if(_statOffset===0){
    const labels={year:'今年',month:'今月',week:'今週',day:'今日'};
    return labels[_statTab];
  }
  const d=getOffsetDate();
  if(_statTab==='day') return (d.getMonth()+1)+'/'+d.getDate();
  if(_statTab==='week'){
    const mon=d;
    const fri=new Date(mon); fri.setDate(mon.getDate()+4);
    return (mon.getMonth()+1)+'/'+mon.getDate()+'〜'+(fri.getMonth()+1)+'/'+fri.getDate();
  }
  if(_statTab==='month') return d.getFullYear()+'/'+(d.getMonth()+1)+'月';
  if(_statTab==='year') return d.getFullYear()+'年';
  return '';
}

function getFilteredByOffset(){
  if(_statTab==='all') return trades;
  const d=getOffsetDate();
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,'0');
  const day=String(d.getDate()).padStart(2,'0');
  if(_statTab==='day') return trades.filter(t=>t.date===y+'-'+m+'-'+day);
  if(_statTab==='week'){
    const mon=getWeekMonday(d);
    const fri=new Date(mon); fri.setDate(mon.getDate()+4);
    const monStr=toDateStr(mon);
    const friStr=toDateStr(fri);
    return trades.filter(t=>t.date>=monStr && t.date<=friStr);
  }
  if(_statTab==='month') return trades.filter(t=>t.date.startsWith(y+'-'+m));
  if(_statTab==='year') return trades.filter(t=>t.date.startsWith(String(y)));
  return trades;
}
function cycleStatTab(){
  const idx=_statTabCycle.indexOf(_statTab);
  _statTab=_statTabCycle[(idx+1)%_statTabCycle.length];
  _statOffset=0;
  _statDayDate=null;
  clearStatSubTexts();
  updateArrowButtons();
  updateStatCards();
}
function switchStatTab(tab, el){
  _statTab=tab;
  _statOffset=0;
  _statDayDate=null;
  document.querySelectorAll('.stat-tab').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  clearStatSubTexts();
  updateArrowButtons();
  updateStatCards();
}

function updateArrowButtons(){
  const prevBtn=document.getElementById('stat-prev-btn');
  const nextBtn=document.getElementById('stat-next-btn');
  if(!prevBtn||!nextBtn) return;

  function showBtn(btn){ btn.style.visibility='visible'; btn.style.opacity='1'; btn.style.pointerEvents='auto'; }
  function hideBtn(btn){ btn.style.visibility='hidden'; btn.style.opacity='0'; btn.style.pointerEvents='none'; }

  const isAtPresent = _statTab==='day' ? !_statDayDate : _statOffset===0;

  if(_statTab==='all'){
    hideBtn(prevBtn); hideBtn(nextBtn);
  } else if(isAtPresent){
    showBtn(prevBtn); hideBtn(nextBtn);
  } else {
    showBtn(prevBtn); showBtn(nextBtn);
  }
}

function clearStatSubTexts(){
  ['s-pnl','s-cnt','s-wr','s-pf','s-rr','s-avg-win','s-avg-loss'].forEach(id=>{
    const sub=document.getElementById(id+'-sub');
    if(sub) sub.textContent='';
  });
}

function getFilteredByTab(tab){
  if(tab==='all') return trades;
  if(tab==='year') return trades.filter(t=>t.date.startsWith(getYearStr()));
  if(tab==='month') return trades.filter(t=>t.date.startsWith(getMonthStr()));
  if(tab==='day') return trades.filter(t=>t.date===getTodayStr());
  return trades;
}

function getPrevSt(tab){
  const base=getOffsetDate();
  if(tab==='day'){
    const d=new Date(base);
    d.setDate(d.getDate()-1);
    skipWeekend(d, 1);
    const ds=toDateStr(d);
    const label=_statOffset===0?'前営業日':(d.getMonth()+1)+'/'+d.getDate();
    return {label, st:calcStats(trades.filter(t=>t.date===ds))};
  }
  if(tab==='week'){
    const mon=getWeekMonday(base);
    mon.setDate(mon.getDate()-7);
    const fri=new Date(mon); fri.setDate(mon.getDate()+4);
    const monStr=toDateStr(mon);
    const friStr=toDateStr(fri);
    const label=_statOffset===0?'先週':(mon.getMonth()+1)+'/'+mon.getDate()+'〜';
    return {label, st:calcStats(trades.filter(t=>t.date>=monStr&&t.date<=friStr))};
  }
  if(tab==='month'){
    const d=new Date(base); d.setMonth(d.getMonth()-1);
    const ym=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    const label=_statOffset===0?'先月':d.getFullYear()+'/'+(d.getMonth()+1)+'月';
    return {label, st:calcStats(trades.filter(t=>t.date.startsWith(ym)))};
  }
  if(tab==='year'){
    const y=String(base.getFullYear()-1);
    const label=_statOffset===0?'昨年':y+'年';
    return {label, st:calcStats(trades.filter(t=>t.date.startsWith(y)))};
  }
  return {label:'', st:null};
}

function fmtSub(arr, tab){
  return '';
}

function updateStatCards(){
  updateArrowButtons();
  const arr=getFilteredByOffset();
  const st=calcStats(arr);
  if(document.getElementById('chart-equity')) drawEquity();

  const statBtn=document.getElementById('stat-tab-btn');
  if(statBtn) statBtn.textContent=getOffsetLabel();

  if(!st){
    const pel=document.getElementById('s-pnl');
    pel.childNodes[0].textContent='¥0';pel.style.color='var(--dim)';pel.style.webkitTextFillColor='#3a4a6a';
    ['s-cnt','s-wr','s-pf','s-rr','s-avg-win','s-avg-loss'].forEach(id=>{
      const el=document.getElementById(id);
      if(el) el.childNodes[0].textContent='0';
    });
    const resetCards=[
      {id:'s-win-cnt', val:'0回', color:'#2dcc8a'},
      {id:'s-loss-cnt',val:'0回', color:'#ff4444'},
      {id:'s-total-win',val:'0円',color:'#2dcc8a'},
      {id:'s-total-loss',val:'0円',color:'#ff4444'},
      {id:'s-best-win', val:'0円', color:'#2dcc8a'},
      {id:'s-best-loss',val:'0円', color:'#ff4444'},
    ];
    resetCards.forEach(({id,val,color})=>{
      const el=document.getElementById(id);
      if(el){el.childNodes[0].textContent=val;el.style.color=color;el.style.webkitTextFillColor=color;}
    });
    return;
  }

  const prev=getPrevSt(_statTab);
  const ps=prev.st;
  const pl=prev.label;
  function sub(val, pval){ return (ps&&_statTab!=='all')?pl+': '+pval:''; }

  const pel=document.getElementById('s-pnl');
  pel.childNodes[0].textContent=(st.totalPnl>=0?'+':'')+Math.round(st.totalPnl).toLocaleString()+'円';
  pel.style.color=st.totalPnl>=0?'var(--jade)':'var(--red)';
  pel.style.webkitTextFillColor=st.totalPnl>=0?'#2dcc8a':'#ff4444';
  const pnlSub=document.getElementById('s-pnl-sub');
  if(pnlSub){
    pnlSub.textContent=ps?pl+': '+(ps.totalPnl>=0?'+':'')+Math.round(ps.totalPnl).toLocaleString()+'円':'';
    const pc=ps?(ps.totalPnl>=0?'#2dcc8a':'#ff4444'):'#5a6a8a';
    pnlSub.style.color=pc; pnlSub.style.webkitTextFillColor=pc;
  }

  setStatCard('s-cnt', st.total+'回', ps?pl+': '+ps.total+'回':'');

  const wrColor=st.winRate>=50?'#2dcc8a':'#ff4444';
  const wrSubColor=ps?(ps.winRate>=50?'#2dcc8a':'#ff4444'):'#5a6a8a';
  setStatCard('s-wr', st.winRate.toFixed(1)+'%', ps?pl+': '+ps.winRate.toFixed(1)+'%':'', wrColor, wrSubColor);

  const pfColor=st.pf>=1.5?'#2dcc8a':st.pf<1?'#ff4444':'#8a9ab0';
  const pfSubColor=ps?(ps.pf>=1.5?'#2dcc8a':ps.pf<1?'#ff4444':'#8a9ab0'):'#5a6a8a';
  setStatCard('s-pf', st.pf>=99?'∞':st.pf.toFixed(2), ps?pl+': '+(ps.pf>=99?'∞':ps.pf.toFixed(2)):'', pfColor, pfSubColor);

  const rrColor=st.rr>=2?'#2dcc8a':st.rr<1?'#ff4444':'#8a9ab0';
  const rrSubColor=ps?(ps.rr>=2?'#2dcc8a':ps.rr<1?'#ff4444':'#8a9ab0'):'#5a6a8a';
  setStatCard('s-rr', st.rr.toFixed(2), ps?pl+': '+ps.rr.toFixed(2):'', rrColor, rrSubColor);

  const awSubColor=ps?(ps.avgWin>0?'#2dcc8a':'#5a6a8a'):'#5a6a8a';
  setStatCard('s-avg-win', '+'+(Math.round(st.avgWin)).toLocaleString()+'円', ps?pl+': +'+(Math.round(ps.avgWin)).toLocaleString()+'円':'', '#2dcc8a', awSubColor);

  const alSubColor=ps?(ps.avgLoss>0?'#ff4444':'#5a6a8a'):'#5a6a8a';
  setStatCard('s-avg-loss', '-'+(Math.round(st.avgLoss)).toLocaleString()+'円', ps?pl+': -'+(Math.round(ps.avgLoss)).toLocaleString()+'円':'', '#ff4444', alSubColor);

  const totalWin=st.wins.reduce((s,t)=>s+t.pnl,0);
  const totalLoss=Math.abs(st.losses.reduce((s,t)=>s+t.pnl,0));
  const twEl=document.getElementById('s-total-win');
  const tlEl=document.getElementById('s-total-loss');
  if(twEl){twEl.childNodes[0].textContent='+'+Math.round(totalWin).toLocaleString()+'円';twEl.style.color='#2dcc8a';twEl.style.webkitTextFillColor='#2dcc8a';}
  if(tlEl){tlEl.childNodes[0].textContent='-'+Math.round(totalLoss).toLocaleString()+'円';tlEl.style.color='#ff4444';tlEl.style.webkitTextFillColor='#ff4444';}

  const wcEl=document.getElementById('s-win-cnt');
  const lcEl=document.getElementById('s-loss-cnt');
  if(wcEl){wcEl.childNodes[0].textContent=st.wins.length+'回';wcEl.style.color='#2dcc8a';wcEl.style.webkitTextFillColor='#2dcc8a';}
  if(lcEl){lcEl.childNodes[0].textContent=st.losses.length+'回';lcEl.style.color='#ff4444';lcEl.style.webkitTextFillColor='#ff4444';}

  const bestWin=st.wins.length?Math.max(...st.wins.map(t=>t.pnl)):0;
  const bestLoss=st.losses.length?Math.max(...st.losses.map(t=>Math.abs(t.pnl))):0;
  const bwEl=document.getElementById('s-best-win');
  const blEl=document.getElementById('s-best-loss');
  if(bwEl){bwEl.childNodes[0].textContent='+'+Math.round(bestWin).toLocaleString()+'円';bwEl.style.color='#2dcc8a';bwEl.style.webkitTextFillColor='#2dcc8a';}
  if(blEl){blEl.childNodes[0].textContent='-'+Math.round(bestLoss).toLocaleString()+'円';blEl.style.color='#ff4444';blEl.style.webkitTextFillColor='#ff4444';}
}

function setStatCard(id, val, sub, color, subColor){
  const el=document.getElementById(id);
  if(!el)return;
  el.childNodes[0].textContent=val;
  if(color){el.style.color=color;el.style.webkitTextFillColor=color;}
  const subEl=document.getElementById(id+'-sub');
  if(subEl){
    subEl.textContent=sub||'';
    const sc=subColor||'#5a6a8a';
    subEl.style.color=sc;
    subEl.style.webkitTextFillColor=sc;
  }
}

function getRank(pnl){
  const a=Math.abs(pnl);return a<10000?'bronze':a<30000?'silver':'gold';
}

function calcStatsFor(tradeList){
  if(!tradeList.length)return null;
  const wins=tradeList.filter(t=>t.pnl>0);
  const losses=tradeList.filter(t=>t.pnl<0);
  const totalPnl=tradeList.reduce((s,t)=>s+t.pnl,0);
  const winRate=wins.length/tradeList.length*100;
  const avgWin=wins.length?wins.reduce((s,t)=>s+t.pnl,0)/wins.length:0;
  const avgLoss=losses.length?Math.abs(losses.reduce((s,t)=>s+t.pnl,0)/losses.length):0;
  const grossWin=wins.reduce((s,t)=>s+t.pnl,0);
  const grossLoss=Math.abs(losses.reduce((s,t)=>s+t.pnl,0));
  const pf=grossLoss>0?grossWin/grossLoss:grossWin>0?99:0;
  const rr=avgLoss>0?avgWin/avgLoss:0;
  return {count:tradeList.length,wins:wins.length,losses:losses.length,
    totalPnl,winRate,avgWin,avgLoss,pf,rr};
}

function getTradesFor(tab){
  const now=new Date();
  const y=now.getFullYear();
  const m=String(now.getMonth()+1).padStart(2,'0');
  const d=String(now.getDate()).padStart(2,'0');
  const today=y+'-'+m+'-'+d;
  const thisMonth=y+'-'+m;
  const thisYear=String(y);
  if(tab==='all') return trades;
  if(tab==='year') return trades.filter(t=>t.date.startsWith(thisYear));
  if(tab==='month') return trades.filter(t=>t.date.startsWith(thisMonth));
  if(tab==='day') return trades.filter(t=>t.date===today);
  return trades;
}

function getPrevTab(tab){
  if(tab==='day') return 'prevDay';
  if(tab==='month') return 'prevMonth';
  if(tab==='year') return 'prevYear';
  return null;
}

function getTradesForPrev(tab){
  const now=getTradeDate();
  if(tab==='prevDay'){
    const d=new Date(now); d.setDate(d.getDate()-1);
    skipWeekend(d, 1);
    return trades.filter(t=>t.date===toDateStr(d));
  }
  if(tab==='prevWeek'){
    const mon=getWeekMonday(now);
    mon.setDate(mon.getDate()-7);
    const fri=new Date(mon); fri.setDate(mon.getDate()+4);
    return trades.filter(t=>t.date>=toDateStr(mon)&&t.date<=toDateStr(fri));
  }
  if(tab==='prevMonth'){
    const d=new Date(now); d.setMonth(d.getMonth()-1);
    const ym=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    return trades.filter(t=>t.date.startsWith(ym));
  }
  if(tab==='prevYear'){
    const y=String(now.getFullYear()-1);
    return trades.filter(t=>t.date.startsWith(y));
  }
  return [];
}

function getPrevLabel(tab){
  if(tab==='day') return '前営業日';
  if(tab==='week') return '先週';
  if(tab==='month') return '先月';
  if(tab==='year') return '昨年';
  return null;
}

function getParentTab(tab){
  if(tab==='day') return 'month';
  if(tab==='month') return 'year';
  if(tab==='year') return 'all';
  return null;
}

function getTabLabel(tab){
  const now=getTradeDate();
  if(tab==='all') return '全';
  if(tab==='year') return now.getFullYear()+'年';
  if(tab==='month') return (now.getMonth()+1)+'月';
  if(tab==='day') return (now.getMonth()+1)+'/'+(now.getDate());
  return '';
}

function copyStats(){
  const label = getOffsetLabel();
  const arr = getFilteredByOffset();
  const st = calcStats(arr);

  let text = '';
  if(!st){
    text = '【'+label+'の成績】\nデータなし';
  } else {
    const now = getTradeDate();
    let dateRange = '';
    if(_statTab==='week'){
      const mon=getWeekMonday(getOffsetDate());
      const fri=new Date(mon); fri.setDate(mon.getDate()+4);
      dateRange = (mon.getMonth()+1)+'/'+mon.getDate()+'〜'+(fri.getMonth()+1)+'/'+fri.getDate();
    } else if(_statTab==='day'){
      const d=getOffsetDate();
      dateRange = d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate();
    } else if(_statTab==='month'){
      const d=getOffsetDate();
      dateRange = d.getFullYear()+'/'+(d.getMonth()+1);
    } else if(_statTab==='year'){
      dateRange = getOffsetDate().getFullYear()+'年';
    } else {
      dateRange = '全期間';
    }

    const totalWin = st.wins.reduce((s,t)=>s+t.pnl,0);
    const totalLoss = Math.abs(st.losses.reduce((s,t)=>s+t.pnl,0));
    const bestWin = st.wins.length ? Math.max(...st.wins.map(t=>t.pnl)) : 0;
    const bestLoss = st.losses.length ? Math.max(...st.losses.map(t=>Math.abs(t.pnl))) : 0;
    const adviceEl = document.getElementById('advice-text');
    const advice = adviceEl ? adviceEl.textContent : '';

    text = `【${label}の成績】${dateRange}
━━━━━━━━━━━━━━
📊 基本成績
トレード数: ${st.total}回（勝ち${st.wins.length}回 / 負け${st.losses.length}回）
勝率: ${st.winRate.toFixed(1)}%
累計損益: ${st.totalPnl>=0?'+':''}${Math.round(st.totalPnl).toLocaleString()}円
━━━━━━━━━━━━━━
💰 損益詳細
総利益: +${Math.round(totalWin).toLocaleString()}円
総損失: -${Math.round(totalLoss).toLocaleString()}円
平均利益: +${Math.round(st.avgWin).toLocaleString()}円
平均損失: -${Math.round(st.avgLoss).toLocaleString()}円
最高利益: +${Math.round(bestWin).toLocaleString()}円
最高損失: -${Math.round(bestLoss).toLocaleString()}円
━━━━━━━━━━━━━━
📈 指標
PF: ${st.pf>=99?'∞':st.pf.toFixed(2)}
平均RR: ${st.rr.toFixed(2)}`;
  }

  navigator.clipboard.writeText(text).then(()=>{
    showToast('📋 成績をコピーしました！');
  }).catch(()=>{
    const el=document.createElement('textarea');
    el.value=text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('📋 成績をコピーしました！');
  });
}
