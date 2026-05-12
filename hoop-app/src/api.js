const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

// JSONP — only way to call Apps Script /exec from browser
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
  el.onerror = () => { cleanup(); reject(new Error('Network error')); };
  document.head.appendChild(el);
});
