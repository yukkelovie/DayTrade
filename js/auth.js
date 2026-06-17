function useLocally(){
  _currentUser = null;
  _currentSession = null;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('user-bar').style.display = 'flex';
  document.getElementById('main-content').style.display = 'block';
  document.getElementById('user-name').textContent = 'ローカルモード（未ログイン）';
  try{const s=localStorage.getItem('trade_data_v2');if(s)trades=JSON.parse(s);}catch(e){}
  try{const s=localStorage.getItem('trade_ach_v3_local');if(s)achState=JSON.parse(s);}catch(e){}
  applyCardSettings();
  renderAnalytics();
  renderAch();
  const today=getTradeDate();
  const y=today.getFullYear(),m=String(today.getMonth()+1).padStart(2,'0'),d=String(today.getDate()).padStart(2,'0');
  setDateSel('in-date',y+'-'+m+'-'+d);
  setDateSel('imp-date',y+'-'+m+'-'+d);
}

async function loginWithGoogle(){
  const btn = document.getElementById('google-login-btn');
  btn.style.opacity = '.6';
  btn.textContent = 'リダイレクト中...';
  const { error } = await _sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: 'https://daytrade-reward.yukke-lovie.workers.dev/' }
  });
  if(error){
    const errEl = document.getElementById('login-error');
    errEl.textContent = 'ログインに失敗しました: ' + error.message;
    errEl.style.display = 'block';
    btn.style.opacity = '1';
    btn.textContent = 'Googleでログイン';
  }
}

async function logout(){
  await _sb.auth.signOut();
  _currentUser = null;
  trades = [];
  achState = {};
  window.location.href = window.location.origin + '/';
}

function showLoginScreen(){
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('user-bar').style.display = 'none';
  document.getElementById('main-content').style.display = 'none';
}

function showMainScreen(user){
  _currentUser = user;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('user-bar').style.display = 'flex';
  document.getElementById('main-content').style.display = 'block';

  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || user.email || '';
  const avatar = meta.avatar_url || meta.picture || '';
  document.getElementById('user-name').textContent = name;
  if(avatar){
    const img = document.getElementById('user-avatar');
    img.src = avatar; img.style.display = 'block';
  }
}
