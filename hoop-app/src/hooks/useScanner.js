import { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxH61RwntWOKccbZ2Y24OpD3pN4ya5Rh_Law1955LvMvq_Mns3lT8LINGFXs3mCB06h/exec';
const MAX_HISTORY = 10;

export const useScanner = ({ user, cam, active, mode = 'camera' }) => {
  const [status, setStatus]           = useState('READY');
  const [lastScan, setLastScan]       = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const [cameraError, setCameraError] = useState(null);

  const isProcessing = useRef(false);
  const scannerRef   = useRef(null);

  const sendScanData = useCallback(async (labelId) => {
    if (!user || isProcessing.current) return;
    const trimmed = labelId.trim();
    if (!trimmed) return;

    isProcessing.current = true;
    setLastScan(trimmed);
    setStatus('SAVING...');

    try {
      const response = await axios.get(SCRIPT_URL, {
        params: {
          action:   'saveScan',
          labelId:  trimmed,
          username: user.name,
          cam:      cam || '',
        }
      });

      const res = response.data;
      let nextStatus = 'GAGAL!';

      if (res?.status === 'success') {
        nextStatus = 'SUCCESS!';
        if (navigator.vibrate) navigator.vibrate([80]);
        setScanHistory((prev) => [
          { id: trimmed, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), ok: true },
          ...prev.slice(0, MAX_HISTORY - 1),
        ]);
      } else if (res?.status === 'duplicate') {
        nextStatus = 'DOUBLE SCAN!';
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }

      setStatus(nextStatus);
    } catch (err) {
      console.error('Scan Error:', err);
      setStatus('ERROR!');
    } finally {
      setTimeout(() => {
        setStatus('READY');
        setLastScan('');
        isProcessing.current = false;
      }, 2500);
    }
  }, [user, cam]);

  // Camera mode
  useEffect(() => {
    if (!active || mode !== 'camera') return;

    const startCamera = async () => {
      try {
        const html5QrCode = new Html5Qrcode('reader');
        scannerRef.current = html5QrCode;
        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 12, qrbox: { width: 300, height: 100 } },
          (text) => { if (text.trim()) sendScanData(text.trim()); }
        );
        setCameraError(null);
      } catch (e) {
        console.error('Camera error:', e);
        setCameraError('Kamera tidak tersedia. Cek izin browser.');
      }
    };

    const timer = setTimeout(startCamera, 500);
    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [active, mode, sendScanData]);

  useEffect(() => {
    if (mode === 'manual' && scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
  }, [mode]);

  return { status, lastScan, scanHistory, cameraError, sendScanData };
};
