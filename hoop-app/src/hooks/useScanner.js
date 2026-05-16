import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { callScript, isOnline } from '../api';
import { addToQueue, getQueue, removeFromQueue, queueSize } from '../offlineQueue';

const MAX_HISTORY = 8;

export const useScanner = ({ user, cam, active, mode = 'camera' }) => {
  const [status, setStatus]         = useState('READY');
  const [lastScan, setLastScan]     = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [online, setOnline]         = useState(navigator.onLine);
  const [pendingCount, setPending]  = useState(() => queueSize());

  const isProcessing = useRef(false);
  const scannerRef   = useRef(null);
  const resetTimer   = useRef(null);
  const isStarted    = useRef(false);
  const syncingRef   = useRef(false);

  // ── Network status listener ───────────────────────────────────
  useEffect(() => {
    const onOnline  = () => { setOnline(true);  syncQueue(); };
    const onOffline = () => setOnline(false);
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // ── Sync antrian ke server ────────────────────────────────────
  const syncQueue = useCallback(async () => {
    if (syncingRef.current) return;
    const q = getQueue();
    if (q.length === 0) return;
    syncingRef.current = true;

    for (let i = q.length - 1; i >= 0; i--) {
      const item = q[i];
      try {
        const res = await callScript({
          action: 'saveScan',
          labelId: item.labelId,
          username: item.username,
          cam: item.cam || '',
        });
        if (res?.status === 'success' || res?.status === 'duplicate') {
          removeFromQueue(i);
          setPending(queueSize());
        }
      } catch (_) {
        // Gagal sync — coba lagi nanti
      }
    }
    syncingRef.current = false;
    setPending(queueSize());
  }, []);

  // ── Periodic sync setiap 30 detik kalau ada antrian ──────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOnline() && queueSize() > 0) syncQueue();
    }, 30000);
    return () => clearInterval(interval);
  }, [syncQueue]);

  // ── Send scan data ────────────────────────────────────────────
  const sendScanData = useCallback(async (labelId) => {
    if (!user || isProcessing.current) return;
    const trimmed = labelId.trim();
    if (!trimmed) return;

    isProcessing.current = true;
    setLastScan(trimmed);
    if (resetTimer.current) clearTimeout(resetTimer.current);

    const timeStr = new Date().toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit', second:'2-digit' });

    // ── OFFLINE: simpan ke antrian ────────────────────────────
    if (!isOnline()) {
      addToQueue({ labelId: trimmed, username: user.name, cam: cam || '' });
      setPending(queueSize());
      setStatus('QUEUED');
      if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
      setScanHistory(prev => [
        { id: trimmed, time: timeStr, ok: true, dup: false, queued: true },
        ...prev.slice(0, MAX_HISTORY - 1),
      ]);
      resetTimer.current = setTimeout(() => {
        setStatus('READY'); setLastScan(''); isProcessing.current = false;
      }, 700);
      return;
    }

    // ── ONLINE: kirim langsung ────────────────────────────────
    setStatus('SAVING...');
    try {
      const res = await callScript({ action:'saveScan', labelId:trimmed, username:user.name, cam:cam||'' });
      let nextStatus = 'ERROR!';

      if (res?.status === 'success') {
        nextStatus = 'SUCCESS!';
        if (navigator.vibrate) navigator.vibrate([80]);
        setScanHistory(prev => [
          { id:trimmed, time:timeStr, ok:true, dup:false, queued:false },
          ...prev.slice(0, MAX_HISTORY - 1),
        ]);
      } else if (res?.status === 'duplicate') {
        nextStatus = 'DUPLICATE!';
        if (navigator.vibrate) navigator.vibrate([100,50,100]);
        setScanHistory(prev => [
          { id:trimmed, time:timeStr, ok:false, dup:true, queued:false },
          ...prev.slice(0, MAX_HISTORY - 1),
        ]);
      }
      setStatus(nextStatus);
    } catch(err) {
      // Gagal kirim → masuk antrian offline
      console.warn('Send failed, queuing:', err);
      addToQueue({ labelId: trimmed, username: user.name, cam: cam || '' });
      setPending(queueSize());
      setStatus('QUEUED');
      if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
      setScanHistory(prev => [
        { id: trimmed, time: timeStr, ok: true, dup: false, queued: true },
        ...prev.slice(0, MAX_HISTORY - 1),
      ]);
    } finally {
      resetTimer.current = setTimeout(() => {
        setStatus('READY'); setLastScan(''); isProcessing.current = false;
      }, 700);
    }
  }, [user, cam, syncQueue]);

  // ── Camera mode ───────────────────────────────────────────────
  const safeStop = useCallback(async () => {
    const sc = scannerRef.current;
    if (sc && isStarted.current) {
      try { await sc.stop(); } catch (_) {}
    }
    isStarted.current = false;
    scannerRef.current = null;
  }, []);

  useEffect(() => {
    if (!active || mode !== 'camera') return;
    let html5QrCode;
    let cancelled = false;
    const start = async () => {
      try {
        html5QrCode = new Html5Qrcode('reader');
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode:'environment' },
          { fps:20, qrbox:{ width:320, height:160 } },
          (text) => { if (text.trim()) sendScanData(text.trim()); }
        );
        if (!cancelled) { isStarted.current = true; setCameraError(null); }
        else { html5QrCode.stop().catch(() => {}); isStarted.current = false; scannerRef.current = null; }
      } catch(e) {
        isStarted.current = false; scannerRef.current = null;
        if (!cancelled) setCameraError('Kamera tidak tersedia. Cek izin browser.');
      }
    };
    const t = setTimeout(start, 300);
    return () => { cancelled = true; clearTimeout(t); safeStop(); };
  }, [active, mode, sendScanData, safeStop]);

  useEffect(() => {
    if (mode === 'manual') safeStop();
  }, [mode, safeStop]);

  return { status, lastScan, scanHistory, cameraError, sendScanData, online, pendingCount, syncQueue };
};
