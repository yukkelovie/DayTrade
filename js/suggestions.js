function renderAdvice(){
  const el = document.getElementById('wrap-advice');
  const txt = document.getElementById('advice-text');
  if(!el||!txt) return;

  const all = calcStats(trades);
  if(!all){ el.style.display='none'; return; }

  const now = new Date();
  const ym = now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0');
  const thisMonth = trades.filter(t=>t.date.startsWith(ym));
  const month = calcStats(thisMonth);
  const m = (month && month.total >= 5) ? month : null;

  function pfStatus(v){ return v>=1.5?'green':v>=1.0?'gray':'red'; }
  function rrStatus(v){ return v>=2.0?'green':v>=1.0?'gray':'red'; }
  function wrStatus(v){ return v>=50?'green':'red'; }

  let advice = null;
  let isGood = false;

  if(m){
    if(m.pf < all.pf - 0.3 || (pfStatus(m.pf) === 'red' && pfStatus(all.pf) !== 'red')){
      advice = '⚠️ 今月のPF（' + m.pf.toFixed(2) + '）が全体（' + all.pf.toFixed(2) + '）より悪化しています。利益の伸ばし方か損切りの徹底を見直しましょう。';
    }
    else if(m.losses.length > 0 && (m.rr < all.rr - 0.3 || (rrStatus(m.rr) === 'red' && rrStatus(all.rr) !== 'red'))){
      advice = '⚠️ 今月のRR（' + m.rr.toFixed(2) + '）が全体（' + all.rr.toFixed(2) + '）より悪化しています。利確を早めすぎていないか確認しましょう。';
    }
    else if(m.winRate < all.winRate - 10 || (wrStatus(m.winRate) === 'red' && wrStatus(all.winRate) !== 'red')){
      advice = '⚠️ 今月の勝率（' + m.winRate.toFixed(1) + '%）が全体（' + all.winRate.toFixed(1) + '%）より悪化しています。エントリー条件を絞りましょう。';
    }
  }

  if(!advice){
    if(pfStatus(all.pf) === 'red'){
      advice = '🔴 PF（' + all.pf.toFixed(2) + '）が1.0未満です。まず損切りを徹底してPF1.0超えを目指しましょう。';
    } else if(pfStatus(all.pf) === 'gray'){
      advice = '🟡 PF（' + all.pf.toFixed(2) + '）がグレーゾーンです。PF1.5（緑）を目指して利益をもう少し伸ばしましょう。';
    } else if(all.losses.length > 0 && rrStatus(all.rr) === 'red'){
      advice = '🔴 RR（' + all.rr.toFixed(2) + '）が1.0未満です。平均利益が平均損失を下回っています。利確を伸ばすか損切りを早めましょう。';
    } else if(all.losses.length > 0 && rrStatus(all.rr) === 'gray'){
      advice = '🟡 RR（' + all.rr.toFixed(2) + '）がグレーゾーンです。RR2.0（緑）を目指して利確をもう少し伸ばしましょう。';
    } else if(wrStatus(all.winRate) === 'red'){
      advice = '🔴 勝率（' + all.winRate.toFixed(1) + '%）が50%未満です。エントリー精度を上げましょう。';
    } else {
      const rrTxt = all.losses.length > 0 ? '・RR（'+all.rr.toFixed(2)+'）' : '';
      advice = '✅ PF（' + (all.pf>=99?'∞':all.pf.toFixed(2)) + '）'+rrTxt+'・勝率（' + all.winRate.toFixed(1) + '%）が全て緑です。このペースを維持しましょう！';
      isGood = true;
    }
  }

  txt.textContent = advice;
  txt.style.color = isGood ? '#2dcc8a' : advice.startsWith('⚠️') ? '#c8d4f0' : '#c8d4f0';
  txt.style.webkitTextFillColor = isGood ? '#2dcc8a' : '#c8d4f0';
  el.style.display = 'block';
}

function calcStreaks(){
  if(!trades.length) return null;
  const sorted=[...trades].sort((a,b)=>a.date.localeCompare(b.date));

  let consec=0;
  for(let i=sorted.length-1;i>=0;i--){
    if(sorted[i].pnl>0) consec++;
    else break;
  }

  const daily={};
  sorted.forEach(t=>{daily[t.date]=(daily[t.date]||0)+t.pnl;});
  const days=Object.keys(daily).sort();

  let consecDays=0;
  for(let i=days.length-1;i>=0;i--){
    if(daily[days[i]]>0) consecDays++;
    else break;
  }

  const monthly={};
  sorted.forEach(t=>{const m=t.date.slice(0,7);monthly[m]=(monthly[m]||0)+t.pnl;});
  const months=Object.keys(monthly).sort();

  let consecMonths=0;
  for(let i=months.length-1;i>=0;i--){
    if(monthly[months[i]]>0) consecMonths++;
    else break;
  }

  const yearly={};
  sorted.forEach(t=>{const y=t.date.slice(0,4);yearly[y]=(yearly[y]||0)+t.pnl;});
  const years=Object.keys(yearly).sort();

  let consecYears=0;
  for(let i=years.length-1;i>=0;i--){
    if(yearly[years[i]]>0) consecYears++;
    else break;
  }

  return {consec, consecDays, consecMonths, consecYears};
}

function renderStreak(){
  const el=document.getElementById('wrap-streak');
  const items=document.getElementById('streak-items');
  if(!el||!items) return;
  const s=calcStreaks();
  if(!s){el.style.display='none';return;}

  const list=[];
  if(s.consecYears>=2) list.push({label:s.consecYears+'年連続プラス',icon:'📅'});
  if(s.consecMonths>=2) list.push({label:s.consecMonths+'ヶ月連続プラス',icon:'🗓️'});
  if(s.consecDays>=2) list.push({label:s.consecDays+'日連続プラス',icon:'📆'});
  if(s.consec>=2) list.push({label:s.consec+'回連続プラス',icon:'✅'});

  if(!list.length){el.style.display='none';return;}

  el.style.display='block';
  items.innerHTML=list.map(item=>`
    <div style="
      display:inline-flex;align-items:center;gap:5px;
      background:#0d2010;border:1px solid #2dcc8a66;
      border-radius:20px;padding:4px 12px;
      font-size:12px;font-weight:700;
      color:#2dcc8a;-webkit-text-fill-color:#2dcc8a !important;
      box-shadow:0 0 8px #2dcc8a22;
    ">${item.icon} ${item.label}</div>
  `).join('');
}
