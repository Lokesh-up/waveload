# WaveLoad — YouTube Audio/Video Downloader

A full-stack YouTube downloader with a glassmorphism UI, built with React (Vite) + Node.js/Express + yt-dlp.

## Prerequisites

- Node.js v18+
- Python 3.11+
- yt-dlp (installed via pip)
- ffmpeg
- Deno (for YouTube JS challenge solving)

## Install Dependencies

### yt-dlp
```bash
pip install yt-dlp
```

### ffmpeg
```bash
# Windows
winget install ffmpeg

# macOS
brew install ffmpeg

# Linux
sudo apt install ffmpeg
```

### Deno
```bash
# Windows
winget install DenoLand.Deno

# macOS/Linux
curl -fsSL https://deno.land/install.sh | sh
```

## YouTube Authentication (Required)

yt-dlp requires your YouTube cookies to bypass bot detection.

1. Install the **"Get cookies.txt LOCALLY"** Chrome extension
2. Go to [youtube.com](https://youtube.com) while logged in
3. Click the extension and export cookies as `cookies.txt`
4. Place `cookies.txt` in the `backend/` folder

> ⚠️ Never commit `cookies.txt` to git — it contains your session data.

## Setup & Run

### Backend
```bash
cd backend
npm install
npm run dev        # starts on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure
```
yt-downloader/
├── backend/
│   ├── server.js
│   ├── cookies.txt          # ← add this (not committed to git)
│   ├── package.json
│   └── routes/
│       ├── info.js          # POST /api/info
│       └── download.js      # POST /api/download
│
└── frontend/
    ├── vite.config.js
    └── src/
        ├── App.jsx
        └── components/
            ├── Background.jsx
            ├── Header.jsx
            ├── UrlInput.jsx
            ├── VideoPreview.jsx
            ├── DownloadOptions.jsx
            └── ProgressBar.jsx
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/info` | Fetch video metadata. Body: `{ url }` |
| `POST` | `/api/download` | Start download. Body: `{ url, type, quality }` |
| `GET`  | `/api/download/file/:jobId/:filename` | Serve completed file |
| `GET`  | `/api/health` | Health check |

## Features

- 🎨 Glassmorphism UI with animated gradient background
- 🌙 Light / Dark mode toggle
- 📋 Clipboard paste button
- 🖼 Video thumbnail, title, channel, view count, duration
- 🎵 Audio: MP3 at 128 / 192 / 320 kbps
- 🎬 Video: Best quality MP4
- 📊 Animated download progress bar
- 📱 Fully responsive (mobile + desktop)
- 🔒 Path traversal protection on file serving
- 🧹 Automatic temp file cleanup after download

## Notes

- cookies.txt expires periodically — re-export if downloads start failing
- First download may be slow as yt-dlp downloads the JS challenge solver