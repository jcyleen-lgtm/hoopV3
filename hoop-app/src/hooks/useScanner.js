import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { callScript } from '../api';   // ← pakai yang sudah benar di api.js

const MAX_HISTORY = 8;

export const useScanner = ({ user, cam, active, mode = 'camera' }) => {
  const [status, setStatus]           = useState('READY');
  const [lastScan, setLastScan]       = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const isProcessing = useRef(false);
  const scannerRef   = useRef(null);
  const resetTimer   = useRef(null);
  const isStarted    = useRef(false);  // track apakah scanner benar-benar sudah running

  const sendScanData = useCallback(async (labelId) => {
    if (!user || isProcessing.current) return;
    const trimmed = labelId.trim();
    if (!trimmed) return;

    isProcessing.current = true;
    setLastScan(trimmed);
    setStatus('SAVING...');
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      const res = await callScript({ action:'saveScan', labelId:trimmed, username:user.name, cam:cam||'' });
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

  // Helper: safely stop scanner hanya kalau benar-benar sudah running
  const safeStop = useCallback(async () => {
    const sc = scannerRef.current;
    if (sc && isStarted.current) {
      try {
        await sc.stop();
      } catch (_) {
        // ignore: mungkin sudah stop atau belum start
      }
    }
    isStarted.current = false;
    scannerRef.current = null;
  }, []);

  // Camera mode
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
        if (!cancelled) {
          isStarted.current = true;
          setCameraError(null);
        } else {
          // Komponen sudah unmount sebelum start selesai — stop langsung
          html5QrCode.stop().catch(() => {});
          isStarted.current = false;
          scannerRef.current = null;
        }
      } catch(e) {
        isStarted.current = false;
        scannerRef.current = null;
        if (!cancelled) setCameraError('Kamera tidak tersedia. Cek izin browser.');
      }
    };

    const t = setTimeout(start, 300);

    return () => {
      cancelled = true;
      clearTimeout(t);
      safeStop();
    };
  }, [active, mode, sendScanData, safeStop]);

  // Switch ke manual mode — stop kamera kalau lagi running
  useEffect(() => {
    if (mode === 'manual') {
      safeStop();
    }
  }, [mode, safeStop]);

  return { status, lastScan, scanHistory, cameraError, sendScanData };
};
