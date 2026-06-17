const SECTIONS=[
  {name:'💰 累計純損益',items:[
    {id:'pnl1',rank:'bronze',icon:'💴',name:'初めての1万円',  desc:'累計純損益 +1万円達成'},
    {id:'pnl2',rank:'bronze',icon:'💵',name:'5万突破',        desc:'累計純損益 +5万円達成'},
    {id:'pnl3',rank:'silver',icon:'💰',name:'10万の壁',       desc:'累計純損益 +10万円達成'},
    {id:'pnl4',rank:'silver',icon:'💎',name:'30万クラブ',     desc:'累計純損益 +30万円達成'},
    {id:'pnl5',rank:'gold',  icon:'🏅',name:'50万トレーダー', desc:'累計純損益 +50万円達成'},
    {id:'pnl6',rank:'plat',  icon:'👑',name:'百万の男',       desc:'累計純損益 +100万円達成'},
  ]},
  {name:'📅 月次損益',items:[
    {id:'mon1',rank:'bronze',icon:'🌱',name:'月次プラス',     desc:'月次純損益 +1万円以上'},
    {id:'mon2',rank:'silver',icon:'📈',name:'月次3万超え',    desc:'月次最高純損益 +3万円'},
    {id:'mon3',rank:'gold',  icon:'🗓️',name:'月次10万超え',  desc:'月次最高純損益 +10万円'},
    {id:'mon4',rank:'plat',  icon:'🌙',name:'月次30万超え',   desc:'月次最高純損益 +30万円'},
  ]},
  {name:'📆 日次損益',items:[
    {id:'day1',rank:'bronze',icon:'🌅',name:'一日1万',        desc:'1日の純損益 +1万円達成'},
    {id:'day2',rank:'silver',icon:'⚡',name:'一日3万',        desc:'1日の純損益 +3万円達成'},
    {id:'day3',rank:'gold',  icon:'🔥',name:'一日5万',        desc:'1日の純損益 +5万円達成'},
    {id:'day4',rank:'plat',  icon:'🌊',name:'一日10万',       desc:'1日の純損益 +10万円達成'},
  ]},
  {name:'⚖️ PF・RR',items:[
    {id:'pf1', rank:'bronze',icon:'📊',name:'PF1.5',          desc:'累計PF 1.5以上'},
    {id:'pf2', rank:'silver',icon:'📈',name:'PF2.0',          desc:'累計PF 2.0以上'},
    {id:'pf3', rank:'gold',  icon:'🏆',name:'PF2.5',          desc:'累計PF 2.5以上'},
    {id:'pf4', rank:'plat',  icon:'✨',name:'PF3.0伝説',      desc:'累計PF 3.0以上'},
    {id:'rr1', rank:'bronze',icon:'⚖️',name:'RR2を刻む',     desc:'平均RR 2.0以上'},
    {id:'rr2', rank:'silver',icon:'🗡️',name:'損小利大の体現',desc:'平均RR 2.5以上'},
    {id:'rr3', rank:'gold',  icon:'🔱',name:'RR3の境地',      desc:'平均RR 3.0以上'},
  ]},
  {name:'🎯 勝率',items:[
    {id:'wr1', rank:'bronze',icon:'🎯',name:'五分五分超え',   desc:'勝率 55%以上'},
    {id:'wr2', rank:'silver',icon:'🏹',name:'安定の60%',      desc:'勝率 60%以上'},
    {id:'wr3', rank:'gold',  icon:'💫',name:'エース級',       desc:'勝率 65%以上'},
    {id:'wr4', rank:'plat',  icon:'🌟',name:'勝率70%の壁',    desc:'勝率 70%以上'},
  ]},
  {name:'🔢 回数',items:[
    {id:'tr1', rank:'bronze',icon:'🌱',name:'10回の経験',     desc:'総トレード 10回'},
    {id:'tr2', rank:'bronze',icon:'📝',name:'50回の積み重ね', desc:'総トレード 50回'},
    {id:'tr3', rank:'silver',icon:'💪',name:'100回突破',      desc:'総トレード 100回'},
    {id:'tr4', rank:'gold',  icon:'🗺️',name:'500回の戦士',   desc:'総トレード 500回'},
  ]},
  {name:'🔥 連続プラス',items:[
    {id:'st1', rank:'bronze',icon:'🌱',name:'3日連続プラス',  desc:'3日連続でプラス収支'},
    {id:'st2', rank:'silver',icon:'🔥',name:'5日連続プラス',  desc:'5日連続でプラス収支'},
    {id:'st3', rank:'gold',  icon:'⚡',name:'10日連続プラス', desc:'10日連続でプラス収支'},
    {id:'st4', rank:'plat',  icon:'🌊',name:'20日連続無敗',   desc:'20日連続でプラス収支'},
  ]},
  {name:'🧘 規律・メンタル',items:[
    {id:'rule1',rank:'bronze',icon:'✂️',name:'損切りを守った',desc:'ルール通りに損切り撤退'},
    {id:'rule2',rank:'silver',icon:'🛡️',name:'ナンピンゼロ', desc:'1ヶ月間ナンピンなし'},
    {id:'rule3',rank:'silver',icon:'🌙',name:'持ち越しゼロ',  desc:'1ヶ月間翌日持ち越しなし'},
    {id:'rule4',rank:'gold',  icon:'🧘',name:'完璧な規律',    desc:'1ヶ月間全ルール遵守'},
    {id:'rule5',rank:'plat',  icon:'🔮',name:'鋼のメンタル',  desc:'大損後に即日ルール内復帰'},
  ]},
  {name:'⭐ 特別実績',items:[
    {id:'sp1', rank:'bronze',icon:'🌅',name:'初トレード',     desc:'はじめてのエントリー'},
    {id:'sp2', rank:'silver',icon:'🎰',name:'一発逆転',       desc:'連敗後に月間プラス転換'},
    {id:'sp3', rank:'gold',  icon:'🦅',name:'完璧な一日',     desc:'全エントリーがRR2以上'},
    {id:'sp4', rank:'gold',  icon:'🎯',name:'有言実行',       desc:'週の目標を達成'},
    {id:'sp5', rank:'plat',  icon:'🐲',name:'伝説のトレーダー',desc:'全実績解除'},
  ]},
];
const RC={bronze:'#cd7f32',silver:'#a8b8d0',gold:'#e8b84b',plat:'#70d0ff'};
const RL={bronze:'銅',silver:'銀',gold:'金',plat:'白金'};

function autoCheckAch(){
  const st=calcStats();if(!st)return;
  const monthly={};
  trades.forEach(t=>{const m=t.date.slice(0,7);monthly[m]=(monthly[m]||0)+t.pnl;});
  const mVals=Object.values(monthly),bestMonth=mVals.length?Math.max(...mVals):0;
  const daily={};
  trades.forEach(t=>{daily[t.date]=(daily[t.date]||0)+t.pnl;});
  const dVals=Object.values(daily),bestDay=dVals.length?Math.max(...dVals):0;
  const dDates=Object.keys(daily).sort();
  let maxS=0,s2=0;
  dDates.forEach(d=>{if(daily[d]>0){s2++;maxS=Math.max(maxS,s2);}else s2=0;});
  const now=new Date(),date=now.getFullYear()+'/'+(now.getMonth()+1)+'/'+now.getDate();
  const checks=[
    {id:'pnl1',ok:st.totalPnl>=10000},{id:'pnl2',ok:st.totalPnl>=50000},
    {id:'pnl3',ok:st.totalPnl>=100000},{id:'pnl4',ok:st.totalPnl>=300000},
    {id:'pnl5',ok:st.totalPnl>=500000},{id:'pnl6',ok:st.totalPnl>=1000000},
    {id:'mon1',ok:mVals.some(v=>v>=10000)},{id:'mon2',ok:bestMonth>=30000},
    {id:'mon3',ok:bestMonth>=100000},{id:'mon4',ok:bestMonth>=300000},
    {id:'day1',ok:bestDay>=10000},{id:'day2',ok:bestDay>=30000},
    {id:'day3',ok:bestDay>=50000},{id:'day4',ok:bestDay>=100000},
    {id:'pf1',ok:st.pf>=1.5},{id:'pf2',ok:st.pf>=2.0},{id:'pf3',ok:st.pf>=2.5},{id:'pf4',ok:st.pf>=3.0},
    {id:'rr1',ok:st.rr>=2.0},{id:'rr2',ok:st.rr>=2.5},{id:'rr3',ok:st.rr>=3.0},
    {id:'wr1',ok:st.winRate>=55},{id:'wr2',ok:st.winRate>=60},{id:'wr3',ok:st.winRate>=65},{id:'wr4',ok:st.winRate>=70},
    {id:'tr1',ok:st.total>=10},{id:'tr2',ok:st.total>=50},{id:'tr3',ok:st.total>=100},{id:'tr4',ok:st.total>=500},
    {id:'st1',ok:maxS>=3},{id:'st2',ok:maxS>=5},{id:'st3',ok:maxS>=10},{id:'st4',ok:maxS>=20},
    {id:'sp1',ok:st.total>=1},
  ];
  let n=0;
  checks.forEach(c=>{if(c.ok&&!achState[c.id]?.unlocked){achState[c.id]={unlocked:true,date};n++;}});
  saveAch();renderAch();
  if(n>0)showToast('🏆 '+n+'件の実績を解除！');
}

function renderAch(){
  const c=document.getElementById('ach-container');c.innerHTML='';
  let total=0,unlocked=0,goldC=0,platC=0;
  SECTIONS.forEach(sec=>{
    const h=document.createElement('div');h.className='sec-head';h.textContent=sec.name;c.appendChild(h);
    const g=document.createElement('div');g.className='ach-grid';
    sec.items.forEach(item=>{
      total++;
      const s=achState[item.id]||{},u=!!s.unlocked;
      if(u)unlocked++;if(u&&item.rank==='gold')goldC++;if(u&&item.rank==='plat')platC++;
      const el=document.createElement('div');
      el.className='ach'+(u?' unlocked':'');
      el.style.setProperty('--ac',RC[item.rank]);
      el.id='ach-'+item.id;
      if(u){
        el.style.boxShadow='0 0 16px '+RC[item.rank]+'88, inset 0 0 20px '+RC[item.rank]+'22';
        el.style.border='2px solid '+RC[item.rank];
      }
      el.innerHTML='<div class="ach-check">'+(u?'✓':'')+'</div>'
        +'<div class="ach-rank rank-'+item.rank+'">'+RL[item.rank]+'</div>'
        +'<span class="ach-icon">'+item.icon+'</span>'
        +'<div class="ach-name">'+item.name+'</div>'
        +'<div class="ach-desc">'+item.desc+'</div>'
        +'<div class="ach-date">'+(u?'✦ '+(s.date||'達成済み'):'未達成')+'</div>';
      g.appendChild(el);
    });
    c.appendChild(g);
  });
  document.getElementById('countUnlocked').textContent=unlocked;
  document.getElementById('countTotal').textContent=total;
  document.getElementById('st-unlocked').textContent=unlocked;
  document.getElementById('st-total').textContent=total;
  document.getElementById('st-gold').textContent=goldC;
  document.getElementById('st-plat').textContent=platC;
}
