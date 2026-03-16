const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const router = express.Router();

function isValidYouTubeUrl(url) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+/.test(url);
}

router.post('/', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const cmd = `yt-dlp --dump-json --no-playlist --cookies "${path.join(__dirname, '../cookies.txt')}" --remote-components ejs:github "${url}"`;

  exec(cmd, { timeout: 60000 }, (error, stdout, stderr) => {
    if (error) {
      console.error('yt-dlp error:', stderr);
      if (stderr.includes('Video unavailable') || stderr.includes('not available')) {
        return res.status(404).json({ error: 'Video is unavailable or private' });
      }
      if (stderr.includes('Invalid URL')) {
        return res.status(400).json({ error: 'Invalid URL provided' });
      }
      return res.status(500).json({ error: 'Failed to fetch video info', details: stderr });
    }

    try {
      const info = JSON.parse(stdout);
      res.json({
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        durationStr: info.duration_string,
        channel: info.uploader || info.channel,
        viewCount: info.view_count,
        uploadDate: info.upload_date,
        videoId: info.id,
      });
    } catch (parseErr) {
      res.status(500).json({ error: 'Failed to parse video info' });
    }
  });
});

module.exports = router;