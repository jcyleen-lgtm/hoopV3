const PROXY_URL = import.meta.env.VITE_SCRIPT_URL;

// Fetch biasa via Cloudflare Worker proxy — tidak perlu JSONP, tidak diblock antivirus
export const callScript = (params) => {
  const qs  = new URLSearchParams(params).toString();
  const url = `${PROXY_URL}?${qs}`;
  return fetch(url, { method: 'GET' })
    .then(res => res.json());
};
