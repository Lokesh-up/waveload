/**
 * VideoPreview — Shows thumbnail, title, duration, channel info
 */
import React, { useState } from 'react';
import styles from './VideoPreview.module.css';

// Format seconds to MM:SS or H:MM:SS
function formatDuration(seconds) {
  if (!seconds) return '--:--';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Format large numbers
function formatViews(n) {
  if (!n) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
}

export default function VideoPreview({ info }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.card + ' glass'}>
      <div className={styles.inner}>
        {/* Thumbnail */}
        <div className={styles.thumbWrap}>
          {!imgError ? (
            <img
              src={info.thumbnail}
              alt={info.title}
              className={styles.thumb}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.thumbFallback}>▶</div>
          )}
          <div className={styles.duration}>{formatDuration(info.duration)}</div>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <h2 className={styles.title} title={info.title}>
            {info.title}
          </h2>
          <div className={styles.meta}>
            <span className={styles.channel}>
              <span className={styles.channelIcon}>📺</span>
              {info.channel}
            </span>
            {info.viewCount && (
              <span className={styles.views}>
                <span>👁</span>
                {formatViews(info.viewCount)}
              </span>
            )}
          </div>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Ready to download
          </div>
        </div>
      </div>
    </div>
  );
}