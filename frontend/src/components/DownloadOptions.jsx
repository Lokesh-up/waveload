/**
 * DownloadOptions — Select audio/video type, quality, and trigger download
 */
import React from 'react';
import styles from './DownloadOptions.module.css';

const AUDIO_QUALITIES = [
  { value: '128', label: '128 kbps', desc: 'Standard' },
  { value: '192', label: '192 kbps', desc: 'High' },
  { value: '320', label: '320 kbps', desc: 'Best' },
];

export default function DownloadOptions({ type, quality, onTypeChange, onQualityChange, onDownload, downloading }) {
  return (
    <div className={styles.card + ' glass'}>
      {/* Type selector */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>Format</label>
        <div className={styles.typeToggle}>
          <button
            className={`${styles.typeBtn} ${type === 'audio' ? styles.active : ''}`}
            onClick={() => onTypeChange('audio')}
            type="button"
          >
            <span>🎵</span>
            <span>Audio</span>
            <small>MP3</small>
          </button>
          <button
            className={`${styles.typeBtn} ${type === 'video' ? styles.active : ''}`}
            onClick={() => onTypeChange('video')}
            type="button"
          >
            <span>🎬</span>
            <span>Video</span>
            <small>MP4</small>
          </button>
        </div>
      </div>

      {/* Quality selector — only for audio */}
      {type === 'audio' && (
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Audio Quality</label>
          <div className={styles.qualities}>
            {AUDIO_QUALITIES.map(q => (
              <button
                key={q.value}
                className={`${styles.qualityBtn} ${quality === q.value ? styles.activeQ : ''}`}
                onClick={() => onQualityChange(q.value)}
                type="button"
              >
                <span className={styles.qualityLabel}>{q.label}</span>
                <span className={styles.qualityDesc}>{q.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Download button */}
      <button
        className={styles.downloadBtn}
        onClick={onDownload}
        disabled={downloading}
        type="button"
      >
        {downloading ? (
          <>
            <span className={styles.spinner} />
            <span>Downloading...</span>
          </>
        ) : (
          <>
            <DownloadIcon />
            <span>Download {type === 'audio' ? 'MP3' : 'MP4'}</span>
          </>
        )}
      </button>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M9 2v10M5 8l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}