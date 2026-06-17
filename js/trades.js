function loadCSV(input){
  const rawDate=getDateSel('imp-date');
  if(!rawDate){showToast('⚠️ 先に日付を選択してください');input.value='';return;}
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const lines=e.target.result.split('\n').map(l=>l.trimEnd());
    if(!lines.length){showToast('⚠️ データがありません');input.value='';return;}

    const grid=lines.map(l=>l.split(','));
    const nCols=Math.max(...grid.map(r=>r.length));
    const nRows=grid.length;

    const colData=[];
    for(let c=0;c<nCols;c++){
      const vals=[];
      for(let r=0;r<nRows;r++){
        const cell=(grid[r][c]||'').trim().replace(/[^0-9.\-+]/g,'');
        const v=parseFloat(cell);
        if(!isNaN(v)&&cell!=='') vals.push(v);
      }
      colData.push(vals);
    }

    let curDate=rawDate;
    let added=0;

    for(let c=0;c<nCols;c++){
      const vals=colData[c];
      if(vals.length===0){
        curDate=addDays(curDate,1);
        continue;
      }
      vals.forEach((pnl,i)=>{
        trades.push({date:curDate, pnl, id:Date.now()+'_'+c+'_'+i+'_'+Math.random()});
        added++;
      });
      curDate=addDays(curDate,1);
    }

    if(!added){showToast('⚠️ 有効なデータがありませんでした');input.value='';return;}
    trades.sort((a,b)=>a.date.localeCompare(b.date));
    saveTrades();renderAnalytics();autoCheckAch();
    showToast('📂 '+rawDate+'〜 '+added+'件追加しました');
    input.value='';
  };
  reader.readAsText(file,'UTF-8');
}

function addTrade(){
  const date=getDateSel('in-date');
  const pnl=parseFloat(document.getElementById('in-pnl').value);
  if(!date||isNaN(pnl)){showToast('⚠️ 日付と損益を入力してください');return;}
  trades.push({date,pnl,id:Date.now()+'_'+Math.random()});
  trades.sort((a,b)=>a.date.localeCompare(b.date));
  saveTrades();renderAnalytics();autoCheckAch();
  document.getElementById('in-pnl').value='';
  showToast('✅ 追加しました');
}

function deleteTrade(id){
  trades=trades.filter(t=>String(t.id)!==String(id));
  saveTrades();renderAnalytics();
  showToast('🗑 削除しました');
}

function clearAll(){
  showConfirm('全取引データを削除しますか？', ()=>{
    trades=[];saveTrades();renderAnalytics();
    showToast('🗑 全削除しました');
  });
}

function clearPeriod(){
  const from=getDateSel('log-from');
  const to=getDateSel('log-to');
  if(!from&&!to){showToast('⚠️ 期間を指定してください');return;}
  const label=(from||'〜')+' 〜 '+(to||'〜');
  showConfirm(label+'\nの取引を削除しますか？', ()=>{
    trades=trades.filter(t=>{
      if(from&&t.date<from)return true;
      if(to&&t.date>to)return true;
      return false;
    });
    saveTrades();renderAnalytics();
    showToast('🗑 期間削除しました');
  });
}

function openEdit(id){
  const t=trades.find(t=>String(t.id)===String(id));if(!t)return;
  editIdx=id;
  setDateSel('edit-date',t.date);
  document.getElementById('edit-pnl').value=t.pnl;
  document.getElementById('editModal').classList.add('open');
}
function closeEdit(){
  document.getElementById('editModal').classList.remove('open');
  editIdx=-1;
}
function saveEdit(){
  const t=trades.find(t=>String(t.id)===String(editIdx));if(!t)return;
  const date=getDateSel('edit-date');
  const pnl=parseFloat(document.getElementById('edit-pnl').value);
  if(!date||isNaN(pnl)){showToast('⚠️ 入力を確認してください');return;}
  t.date=date;t.pnl=pnl;
  trades.sort((a,b)=>a.date.localeCompare(b.date));
  saveTrades();renderAnalytics();closeEdit();
  showToast('✅ 更新しました');
}

function exportCSV(){
  const from=getDateSel('log-from');
  const to=getDateSel('log-to');
  if(!from||!to){showToast('⚠️ 期間を指定してください');return;}

  let filtered=[...trades].filter(t=>t.date>=from&&t.date<=to);
  if(!filtered.length){showToast('⚠️ 出力するデータがありません');return;}

  const daily={};
  trades.filter(t=>t.date>=from&&t.date<=to).forEach(t=>{
    if(!daily[t.date]) daily[t.date]=[];
    daily[t.date].push(t.pnl);
  });

  const cols=[];
  let cur=from;
  while(cur<=to){
    cols.push(cur);
    cur=addDays(cur,1);
  }

  const maxRows=Math.max(...cols.map(d=>daily[d]?daily[d].length:0),1);

  const rows=[];
  for(let i=0;i<maxRows;i++){
    rows.push(cols.map(d=>daily[d]&&daily[d][i]!==undefined?daily[d][i]:'').join(','));
  }
  const csv=rows.join(String.fromCharCode(10));

  const encoded=encodeURIComponent('﻿'+csv);
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,'+encoded;
  const label=(from&&to)?from+'_'+to:from||to||'all';
  a.download='trades_'+label+'.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast('📥 CSV出力しました');
}
