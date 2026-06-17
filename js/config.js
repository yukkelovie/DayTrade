const SUPABASE_URL = 'https://ivefywqisvjjormqpnfm.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2ZWZ5d3Fpc3Zqam9ybXFwbmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxOTg4MjEsImV4cCI6MjA5NDc3NDgyMX0.DKwUJ3IY05MIqHZG8kPqDYDvK2jLGjSYeiF0C2wc3Rg';

const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storageKey: 'sb-auth-token',
    storage: window.localStorage,
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    lock: (name, acquireTimeout, fn) => fn()
  }
});

const KEY_ACH='trade_ach_v3';
let achState={}, trades=[], editIdx=-1;
let _currentUser = null;
let _currentSession = null;
