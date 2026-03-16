/**
 * App.jsx — Root component
 * Manages theme, global state, and layout
 */

import React, { useState, useCallback } from 'react';
import Background from './components/Background';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import VideoPreview from './components/VideoPreview';
import DownloadOptions from './components/DownloadOptions';
import ProgressBar from './components/ProgressBar';
import styles from './App.module.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadType, setDownloadType] = useState('audio');
  const [quality, setQuality] = useState('192');
  const [downloadState, setDownloadState] = useState({
    active: false,
    percent: 0,
    speed: '',
    message: '',
    complete: false,
    downloadUrl: null,
    filename: null,
  });

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Fetch video metadata from backend
  const handleFetchInfo = useCallback(async (url) => {
    setLoading(true);
    setError(null);
    setVideoInfo(null);
    setDownloadState({ active: false, percent: 0, speed: '', message: '', complete: false, downloadUrl: null, filename: null });

    try {
      const res = await fetch('/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch video info');
      setVideoInfo({ ...data, url });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Start download with SSE progress streaming
const handleDownload = useCallback(async () => {
  if (!videoInfo) return;
  setDownloadState({ active: true, percent: 0, speed: '', message: 'Downloading...', complete: false, downloadUrl: null, filename: null });

  // Animate progress bar while waiting
  let fakePercent = 0;
  const interval = setInterval(() => {
    fakePercent = Math.min(fakePercent + Math.random() * 3, 90);
    setDownloadState(prev => ({ ...prev, percent: fakePercent }));
  }, 500);

  try {
    const res = await fetch('http://localhost:3001/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: videoInfo.url, type: downloadType, quality }),
    });

    const data = await res.json();
    clearInterval(interval);

    if (!res.ok) throw new Error(data.error || 'Download failed');

    const downloadUrl = `http://localhost:3001/api/download/file/${data.jobId}/${encodeURIComponent(data.filename)}`;
    setDownloadState({
      active: true,
      percent: 100,
      speed: '',
      message: 'Download complete!',
      complete: true,
      downloadUrl,
      filename: data.filename,
    });

  } catch (err) {
    clearInterval(interval);
    setDownloadState(prev => ({ ...prev, active: false, message: '' }));
    setError(err.message);
  }
}, [videoInfo, downloadType, quality]);

  return (
    <div data-theme={theme} className={styles.app}>
      <Background />
      <div className={styles.container}>
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className={styles.main}>
          <UrlInput onSubmit={handleFetchInfo} loading={loading} />
          {error && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>⚠</span>
              <span>{error}</span>
            </div>
          )}
          {loading && <LoadingSpinner />}
          {videoInfo && !loading && (
            <div className={styles.resultsArea}>
              <VideoPreview info={videoInfo} />
              <DownloadOptions
                type={downloadType}
                quality={quality}
                onTypeChange={setDownloadType}
                onQualityChange={setQuality}
                onDownload={handleDownload}
                downloading={downloadState.active && !downloadState.complete}
              />
              {(downloadState.active || downloadState.complete) && (
                <ProgressBar state={downloadState} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem', gap: '6px', alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} style={{
          width: '4px', height: '24px',
          background: 'var(--accent)',
          borderRadius: '2px',
          animation: `wave 1s ease-in-out ${i * 0.1}s infinite`,
        }} />
      ))}
    </div>
  );
}