# WaveLoad — YouTube Audio/Video Downloader

A full-stack YouTube downloader with a glassmorphism UI, built with React (Vite) + Node.js/Express + yt-dlp.

---

## Prerequisites

- **Node.js** v18+
- **yt-dlp** installed and in your PATH
- **ffmpeg** (required by yt-dlp for audio extraction and video merging)

### Install yt-dlp

```bash
# macOS
brew install yt-dlp

# Linux
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp

# Windows (with pip)
pip install yt-dlp
```

### Install ffmpeg

```bash
# macOS
brew install ffmpeg

# Linux (Ubuntu/Debian)
sudo apt install ffmpeg

# Windows
winget install ffmpeg
```

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Project Structure

```
yt-downloader/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── package.json
│   └── routes/
│       ├── info.js            # POST /api/info — fetch video metadata
│       └── download.js        # POST /api/download — SSE progress stream
│                              # GET  /api/download/file/:jobId/:filename
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx             # Root component, state management
        ├── App.module.css
        ├── index.css           # Global styles, CSS variables, animations
        └── components/
            ├── Background.jsx  # Animated gradient orb background
            ├── Header.jsx      # Logo + light/dark mode toggle
            ├── UrlInput.jsx    # URL paste + fetch trigger
            ├── VideoPreview.jsx # Thumbnail, title, channel, duration
            ├── DownloadOptions.jsx # Format + quality selector + download button
            └── ProgressBar.jsx # SSE progress bar + save file link
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/info` | Fetch video metadata. Body: `{ url }` |
| `POST` | `/api/download` | Start download (SSE stream). Body: `{ url, type, quality }` |
| `GET` | `/api/download/file/:jobId/:filename` | Serve completed file for browser download |
| `GET` | `/api/health` | Health check |

### SSE Event Types (from `/api/download`)

```json
{ "type": "start",    "message": "Starting download..." }
{ "type": "progress", "percent": 42.5, "speed": "1.2MiB/s" }
{ "type": "complete", "filename": "video.mp3", "jobId": "uuid" }
{ "type": "error",    "message": "Video unavailable" }
```

---

## Features

- 🎨 Glassmorphism UI with animated gradient background
- 🌙 Light / Dark mode toggle
- 📋 Clipboard paste button
- 🖼 Video thumbnail, title, channel, view count, duration
- 🎵 Audio: MP3 at 128 / 192 / 320 kbps
- 🎬 Video: Best quality MP4
- 📊 Real-time download progress bar via Server-Sent Events
- 📱 Fully responsive (mobile + desktop)
- 🔒 Path traversal protection on file serving
- 🧹 Automatic temp file cleanup after download