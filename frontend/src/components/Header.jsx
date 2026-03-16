import React from 'react';
import styles from './Header.module.css';

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <WaveIcon />
        </div>
        <div>
          <h1 className={styles.title}>WaveLoad</h1>
          <p className={styles.subtitle}>YouTube Downloader</p>
        </div>
      </div>
      <button
        className={styles.themeBtn}
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀' : '🌙'}
      </button>
    </header>
  );
}

function WaveIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      {[0,1,2,3,4].map((i) => (
        <rect key={i} x={4 + i * 6} y={i % 2 === 0 ? 8 : 14}
          width="4" height={i % 2 === 0 ? 18 : 8} rx="2" fill="url(#wg)"
          style={{ animation: `wave 1.2s ease-in-out ${i * 0.12}s infinite` }}
        />
      ))}
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-light)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
      </defs>
    </svg>
  );
}