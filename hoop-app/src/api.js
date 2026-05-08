const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
 
// JSONP helper — satu-satunya cara call Apps Script /exec dari browser tanpa CORS error
export const callScript = (params) => {
  return new Promise((resolve, reject) => {
    const cbName = '_gs_cb_' + Date.now();
    const timeout = setTimeout(() => {
      delete window[cbName];
      document.getElementById(cbName)?.remove();
      reject(new Error('Timeout'));
    }, 15000);
 
    window[cbName] = (data) => {
      clearTimeout(timeout);
      delete window[cbName];
      document.getElementById(cbName)?.remove();
      resolve(data);
    };
 
    const qs = new URLSearchParams({ ...params, callback: cbName }).toString();
    const script = document.createElement('script');
    script.id = cbName;
    script.src = `${SCRIPT_URL}?${qs}`;
    script.onerror = () => {
      clearTimeout(timeout);
      delete window[cbName];
      reject(new Error('Script load error'));
    };
    document.head.appendChild(script);
  });
};