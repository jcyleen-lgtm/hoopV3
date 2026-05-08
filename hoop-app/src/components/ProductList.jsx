import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { NAVY, RADIUS, TYPE, FONT } from '../theme';

const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
const BORDER_STOPS = [NAVY[700], NAVY[600], NAVY[500], NAVY[400], NAVY[300]];

const SearchIcon  = ({ color }) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PackageIcon = ({ color }) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const AlertIcon   = ({ color }) => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const RefreshIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;

const ProductList = ({ colors, isDesktop }) => {
  const [list, setList]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [search, setSearch]   = useState('');

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(false);
    axios.get(SCRIPT_URL, { params: { action: 'getProduk' }, timeout: 12000 })
      .then(response => {
        const res = response.data;
        // Apps Script returns array directly OR {status, data}
        if (Array.isArray(res)) {
          setList(res);
        } else if (res?.status === 'success' && Array.isArray(res.data)) {
          setList(res.data);
        } else if (Array.isArray(res?.data)) {
          setList(res.data);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = list.filter(p =>
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.nama?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: isDesktop ? '720px' : '100%', fontFamily: FONT }}>
      <div style={{ fontSize: TYPE.xs, fontWeight: '700', letterSpacing: '.08em', textTransform: 'uppercase', color: colors.subText, marginBottom: '12px' }}>
        Product List
      </div>

      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <div style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <SearchIcon color={colors.subText} />
        </div>
        <input
          type="text" placeholder="Cari SKU atau nama…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', height: '42px', paddingLeft: '38px', paddingRight: '14px',
            backgroundColor: colors.card, border: `1px solid ${colors.border}`,
            borderRadius: RADIUS.md, fontSize: TYPE.base, color: colors.text,
            outline: 'none', fontFamily: FONT,
          }}
        />
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ height: '56px', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: RADIUS.md, opacity: 1 - i * 0.15 }} />
          ))}
        </div>
      )}

      {error && !loading && (
        <div style={centeredBox(colors)}>
          <AlertIcon color="#EF4444" />
          <span style={{ fontSize: TYPE.sm, color: colors.subText }}>Gagal memuat produk.</span>
          <button onClick={fetchProducts} style={retryBtn()}>
            <RefreshIcon /> Coba lagi
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={centeredBox(colors)}>
          <PackageIcon color={colors.subText} />
          <span style={{ fontSize: TYPE.sm, color: colors.subText, marginTop: '8px' }}>
            {search ? `Tidak ada hasil untuk "${search}"` : 'Tidak ada produk.'}
          </span>
        </div>
      )}

      {!loading && !error && filtered.map((p, i) => (
        <div key={i} style={{
          backgroundColor: colors.card, border: `1px solid ${colors.border}`,
          borderRadius: RADIUS.md, borderLeft: `3px solid ${BORDER_STOPS[i % BORDER_STOPS.length]}`,
          padding: '12px 16px', marginBottom: '8px',
        }}>
          <div style={{ fontSize: TYPE.base, fontWeight: '600', color: colors.text }}>{p.sku}</div>
          <div style={{ fontSize: TYPE.sm, color: colors.subText, marginTop: '2px' }}>{p.nama}</div>
        </div>
      ))}
    </div>
  );
};

const centeredBox = (colors) => ({
  backgroundColor: colors.card, border: `1px solid ${colors.border}`,
  borderRadius: RADIUS.lg, padding: '40px 24px',
  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px',
});
const retryBtn = () => ({
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '8px 18px', backgroundColor: NAVY[700], color: '#fff',
  border: 'none', borderRadius: RADIUS.sm,
  fontSize: TYPE.sm, fontWeight: '600', cursor: 'pointer', fontFamily: FONT,
  marginTop: '8px',
});

export default ProductList;
