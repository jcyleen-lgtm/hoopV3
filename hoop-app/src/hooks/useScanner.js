import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
const MAX_HISTORY = 8;

// JSONP call — only way to hit Apps Script /exec from browser without CORS error
const jsonpCall = (params) => new Promise((resolve, reject) => {
  const cb  = '_gs_' + Date.now();
  const tid = setTimeout(() => { cleanup(); reject(new Error('Timeout')); }, 12000);

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

export const useScanner = ({ user, cam, active, mode = 'camera' }) => {
  const [status, setStatus]           = useState('READY');
  const [lastScan, setLastScan]       = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const isProcessing = useRef(false);
  const scannerRef   = useRef(null);
  const resetTimer   = useRef(null);

  const sendScanData = useCallback(async (labelId) => {
    if (!user || isProcessing.current) return;
    const trimmed = labelId.trim();
    if (!trimmed) return;

    isProcessing.current = true;
    setLastScan(trimmed);
    setStatus('SAVING...');
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      const res = await jsonpCall({ action:'saveScan', labelId:trimmed, username:user.name, cam:cam||'' });
      let nextStatus = 'ERROR!';

      if (res?.status === 'success') {
        nextStatus = 'SUCCESS!';
        if (navigator.vibrate) navigator.vibrate([80]);
        setScanHistory(prev => [
          { id:trimmed, time:new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'}), ok:true },
          ...prev.slice(0, MAX_HISTORY - 1),
        ]);
      } else if (res?.status === 'duplicate') {
        nextStatus = 'DUPLICATE!';
        if (navigator.vibrate) navigator.vibrate([100,50,100]);
      }
      setStatus(nextStatus);
    } catch(err) {
      console.error('Scan error:', err);
      setStatus('ERROR!');
    } finally {
      resetTimer.current = setTimeout(() => {
        setStatus('READY'); setLastScan(''); isProcessing.current = false;
      }, 1800);
    }
  }, [user, cam]);

  // Camera mode
  useEffect(() => {
    if (!active || mode !== 'camera') return;
    let html5QrCode;
    const start = async () => {
      try {
        html5QrCode = new Html5Qrcode('reader');
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode:'environment' },
          { fps:20, qrbox:{ width:320, height:160 } },
          (text) => { if (text.trim()) sendScanData(text.trim()); }
        );
        setCameraError(null);
      } catch(e) {
        setCameraError('Kamera tidak tersedia. Cek izin browser.');
      }
    };
    const t = setTimeout(start, 300);
    return () => {
      clearTimeout(t);
      if (scannerRef.current) { scannerRef.current.stop().catch(()=>{}); scannerRef.current = null; }
    };
  }, [active, mode, sendScanData]);

  useEffect(() => {
    if (mode === 'manual' && scannerRef.current) {
      scannerRef.current.stop().catch(()=>{});
      scannerRef.current = null;
    }
  }, [mode]);

  return { status, lastScan, scanHistory, cameraError, sendScanData };
};
