// URL priority: Cloudflare env variable → fallback hardcoded
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL 
  || 'https://script.google.com/macros/s/AKfycbxH61RwntWOKccbZ2Y24OpD3pN4ya5Rh_Law1955LvMvq_Mns3lT8LINGFXs3mCB06h/exec';

// JSONP — only way to call Apps Script /exec from browser without CORS error
export const callScript = (params) => new Promise((resolve, reject) => {
  const cb  = '_gs_' + Date.now() + '_' + Math.random().toString(36).slice(2);
  const tid = setTimeout(() => { cleanup(); reject(new Error('Timeout')); }, 15000);

  const cleanup = () => {
    clearTimeout(tid);
    delete window[cb];
    document.getElementById(cb)?.remove();
  };

  window[cb] = (data) => { cleanup(); resolve(data); };

  const qs  = new URLSearchParams({ ...params, callback: cb }).toString();
  const el  = document.createElement('script');
  el.id     = cb;
  el.src    = `${SCRIPT_URL}?${qs}`;
  el.onerror = () => { cleanup(); reject(new Error('Network error - check Apps Script URL')); };
  document.head.appendChild(el);
});
