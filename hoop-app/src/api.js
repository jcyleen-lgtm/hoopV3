const PROXY_URL = import.meta.env.VITE_SCRIPT_URL;

// Fetch dengan retry otomatis (3x, exponential backoff)
const fetchWithRetry = async (url, retries = 3, delay = 800) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { method: 'GET', signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
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
