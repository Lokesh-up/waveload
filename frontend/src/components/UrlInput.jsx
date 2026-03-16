/**
 * UrlInput — Paste YouTube URL and trigger info fetch
 */
import React, { useState } from 'react';
import styles from './UrlInput.module.css';

export default function UrlInput({ onSubmit, loading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (trimmed) onSubmit(trimmed);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text);
    } catch {
      // Permission denied — user can type manually
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card + ' glass'}>
        <p className={styles.label}>Paste a YouTube URL to get started</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrap}>
            <span className={styles.ytIcon}>▶</span>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className={styles.input}
              disabled={loading}
              aria-label="YouTube URL"
            />
            <button
              type="button"
              className={styles.pasteBtn}
              onClick={handlePaste}
              title="Paste from clipboard"
              aria-label="Paste from clipboard"
            >
              📋
            </button>
          </div>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              <>
                <span>Fetch Info</span>
                <ArrowIcon />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}