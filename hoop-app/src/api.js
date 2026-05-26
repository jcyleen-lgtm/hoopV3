const PROXY_URL = import.meta.env.VITE_SCRIPT_URL;

// Fetch dengan retry otomatis (2x, linear backoff — lebih cepat dari exponential)
const fetchWithRetry = async (url, retries = 2, delay = 500) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
};

export const callScript = (params) => {
  const p = { ...params };
  // saveScan harus selalu fresh — tambah timestamp untuk bypass cache
  if (p.action === 'saveScan') p._t = Date.now();
  const qs  = new URLSearchParams(p).toString();
  const url = `${PROXY_URL}?${qs}`;
  return fetchWithRetry(url);
};

// Check apakah online
export const isOnline = () => navigator.onLine;
