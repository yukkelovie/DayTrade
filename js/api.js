async function sbFetch(path, method='GET', body=null){
  let token = SUPABASE_KEY;
  if(_currentSession){
    const now = Math.floor(Date.now()/1000);
    if(_currentSession.expires_at && _currentSession.expires_at < now + 60){
      const refreshed = await _sb.auth.refreshSession();
      if(refreshed.data.session){
        _currentSession = refreshed.data.session;
      }
    }
    token = _currentSession.access_token;
  }
  const opts={
    method,
    mode:'cors',
    headers:{
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json',
      'Prefer': method==='POST'?'resolution=merge-duplicates':''
    }
  };
  if(body) opts.body=JSON.stringify(body);
  const res=await fetch(SUPABASE_URL+'/rest/v1/'+path, opts);
  if(!res.ok){ console.error('Supabase error:', await res.text()); return null; }
  if(method==='DELETE') return true;
  const text = await res.text();
  if(!text) return true;
  try{ return JSON.parse(text); }catch(e){ return true; }
}

async function loadStorage(){
  const uid = _currentUser?.id || 'local';
  try{const s=localStorage.getItem(KEY_ACH+'_'+uid);if(s)achState=JSON.parse(s);}catch(e){}
  try{
    let all=[], offset=0, chunk;
    do{
      chunk=await sbFetch('trades?select=*&order=sort_order.asc&limit=1000&offset='+offset);
      if(!chunk)break;
      all=all.concat(chunk);
      offset+=1000;
    }while(chunk.length===1000);
    if(all.length>0){ trades=all.map(r=>({id:r.id,date:r.date,pnl:r.pnl})); return; }
  }catch(e){}
  try{const s=localStorage.getItem('trade_data_v2');if(s)trades=JSON.parse(s);}catch(e){}
}

async function saveTrades(){
  const uid = _currentUser?.id;
  localStorage.setItem('trade_data_v2', JSON.stringify(trades));
  if(!uid) return;
  try{
    if(trades.length===0){
      await sbFetch('trades?user_id=eq.'+uid,'DELETE');
    } else {
      await sbFetch('trades','POST', trades.map((t,i)=>({
        id:String(t.id), date:t.date, pnl:t.pnl,
        sort_order:i, user_id: uid
      })));
      let remoteAll=[], offset=0, chunk;
      do{
        chunk=await sbFetch('trades?select=id&limit=1000&offset='+offset);
        if(!chunk)break;
        remoteAll=remoteAll.concat(chunk);
        offset+=1000;
      }while(chunk.length===1000);
      const localIds=new Set(trades.map(t=>String(t.id)));
      const toDelete=remoteAll.filter(r=>!localIds.has(r.id));
      for(const r of toDelete){
        await sbFetch('trades?id=eq.'+encodeURIComponent(r.id),'DELETE');
      }
    }
  }catch(e){ console.error('Supabase save error:',e); }
}

function saveAch(){
  const uid = _currentUser?.id || 'local';
  try{localStorage.setItem(KEY_ACH+'_'+uid,JSON.stringify(achState));}catch(e){}
}
