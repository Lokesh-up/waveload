/**
 * ProgressBar — Shows download progress and final download link
 */
import React from 'react';
import styles from './ProgressBar.module.css';

export default function ProgressBar({ state }) {
  const { percent, speed, message, complete, downloadUrl, filename, error } = state;

  return (
    <div className={`${styles.card} glass ${complete ? styles.done : ''} ${error ? styles.errored : ''}`}>
      <div className={styles.topRow}>
        <span className={styles.status}>
          {complete ? '✅' : error ? '❌' : '⬇'}
          <span>{message || 'Processing...'}</span>
        </span>
        {speed && !complete && (
          <span className={styles.speed}>{speed}</span>
        )}
        {!complete && !error && (
          <span className={styles.pct}>{percent.toFixed(1)}%</span>
        )}
      </div>

      {/* Progress track */}
      {!error && (
        <div className={styles.track}>
          <div
            className={`${styles.fill} ${complete ? styles.fillComplete : ''}`}
            style={{ width: `${Math.min(100, percent)}%` }}
          />
          {/* Shimmer while downloading */}
          {!complete && percent > 0 && percent < 100 && (
            <div className={styles.shimmer} style={{ width: `${Math.min(100, percent)}%` }} />
          )}
        </div>
      )}

      {/* Download file button after completion */}
      {complete && downloadUrl && (
        <a
          href={downloadUrl}
          download={filename}
          className={styles.saveBtn}
        >
          <SaveIcon />
          <span>Save File</span>
          <span className={styles.saveName}>{filename}</span>
        </a>
      )}
    </div>
  );
}

function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M15 12v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M9 2v8M6 7l3 3 3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}