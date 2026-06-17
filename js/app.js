(async()=>{
  if(window.location.hash && window.location.hash.includes('access_token')){
    const params = new URLSearchParams(window.location.hash.substring(1));
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if(access_token && refresh_token){
      await _sb.auth.setSession({ access_token, refresh_token });
      window.location.hash = '';
    }
  }

  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('main-content').style.display = 'none';
  document.getElementById('user-bar').style.display = 'none';

  ['imp-date','in-date','log-from','log-to','edit-date'].forEach(p=>initDateSel(p));

  _sb.auth.onAuthStateChange(async (event, session) => {
    if(session && session.user){
      _currentSession = session;
      showMainScreen(session.user);
      showToast('📡 データ読み込み中...');
      await loadStorage();
      applyCardSettings();
      renderAnalytics();
      renderAch();
      const today=getTradeDate();
      const y=today.getFullYear(),m=String(today.getMonth()+1).padStart(2,'0'),d=String(today.getDate()).padStart(2,'0');
      setDateSel('in-date',y+'-'+m+'-'+d);
      setDateSel('imp-date',y+'-'+m+'-'+d);
    } else {
      showLoginScreen();
    }
  });
})();
