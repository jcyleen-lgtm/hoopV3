// ── Offline Queue — persist scan ke localStorage saat offline ──
const QUEUE_KEY = 'hoop_offline_queue';

export const getQueue = () => {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); }
  catch { return []; }
};

export const addToQueue = (item) => {
  const q = getQueue();
  q.push({ ...item, queuedAt: Date.now(), retries: 0 });
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
};

export const removeFromQueue = (idx) => {
  const q = getQueue();
  q.splice(idx, 1);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
};

export const clearQueue = () => localStorage.removeItem(QUEUE_KEY);

export const queueSize = () => getQueue().length;
