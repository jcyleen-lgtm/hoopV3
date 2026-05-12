import React, { useState, useEffect } from 'react';
import Scanner from './Scanner';
import LoginPage from './components/LoginPage';
import { makeColors } from './theme';
import { callScript } from './api';

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lscan_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [theme, setTheme] = useState(
    () => localStorage.getItem('lscan_theme') || 'dark'
  );

  const [authLoading, setAuthLoading] = useState(false);

  const colors = makeColors(theme);

  useEffect(() => {
    localStorage.setItem('lscan_theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Single login handler — lives here, not duplicated in Scanner
  const handleLogin = async (username, password) => {
    if (!username || !password) return alert('Isi Username dan Password!');
    setAuthLoading(true);
    try {
      const res = await callScript({ action:'login', user:username, pass:password });
      if (res?.status === 'success') {
        const userData = { name: res.username, role: res.role };
        localStorage.setItem('lscan_user', JSON.stringify(userData));
        setUser(userData);
      } else {
        alert(res?.message || 'Login Gagal!');
      }
    } catch (err) {
      console.error('Login Error:', err);
      // For dev/demo: allow login without backend
      const userData = { name: username, role: 'Admin' };
      localStorage.setItem('lscan_user', JSON.stringify(userData));
      setUser(userData);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lscan_user');
    setUser(null);
  };

  return (
    <div style={{
      backgroundColor: colors.bg,
      color: colors.text,
      minHeight: '100vh',
      transition: 'background-color 0.3s ease',
      margin: 0,
      padding: 0,
    }}>
      {!user ? (
        <LoginPage
          onLogin={handleLogin}
          isLoading={authLoading}
          theme={theme}
        />
      ) : (
        <Scanner
          user={user}
          onLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}
    </div>
  );
}

export default App;
