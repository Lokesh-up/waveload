const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/', (req, res) => {
  const { url, type = 'audio', quality = '192' } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const jobId = uuidv4();
  const tmpDir = path.join(os.tmpdir(), 'yt-dl-' + jobId);
  fs.mkdirSync(tmpDir, { recursive: true });

  let args;
  if (type === 'audio') {
    args = [url, '-x', '--audio-format', 'mp3', '--audio-quality', quality + 'K',
      '-o', path.join(tmpDir, '%(title)s.%(ext)s'),
      '--no-playlist', '--newline',
      '--cookies', path.join(__dirname, '../cookies.txt'),
      '--remote-components', 'ejs:github'];
  } else {
    args = [url, '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      '-o', path.join(tmpDir, '%(title)s.%(ext)s'),
      '--no-playlist', '--newline', '--merge-output-format', 'mp4',
      '--cookies', path.join(__dirname, '../cookies.txt'),
      '--remote-components', 'ejs:github'];
  }

  const ytdlp = spawn(
    'C:\\Users\\vorug\\AppData\\Local\\Programs\\Python\\Python311\\python.exe',
    ['-m', 'yt_dlp', ...args],
    { env: { ...process.env } }
  );

  let outputFile = null;

  ytdlp.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    lines.forEach(line => {
      const destMatch = line.match(/\[(?:download|ExtractAudio)\] Destination: (.+)/);
      if (destMatch) {
        const f = destMatch[1].trim();
        if ((f.endsWith('.mp4') || f.endsWith('.mp3') || f.endsWith('.webm')) && !f.match(/\.f\d+\./)) {
           if (!outputFile || f.endsWith('.mp3') || f.endsWith('.mp4')) {
               outputFile = f;
            }
        }
      }
    });
  });

  ytdlp.stderr.on('data', (data) => console.error('stderr:', data.toString()));

  ytdlp.on('close', (code) => {
    if (code !== 0) return res.status(500).json({ error: 'Download failed' });
    const files = fs.readdirSync(tmpDir);
    if (files.length === 0) return res.status(500).json({ error: 'Output file not found' });
    outputFile = path.join(tmpDir, files[0]);
    res.json({ jobId, filename: path.basename(outputFile) });
  });
});

router.get('/file/:jobId/:filename', (req, res) => {
  const { jobId, filename } = req.params;

  const safeJobId = jobId.replace(/[^a-zA-Z0-9-]/g, '');
  const safeFilename = path.basename(filename);
  const filePath = path.join(os.tmpdir(), 'yt-dl-' + safeJobId, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found or expired' });
  }

  const asciiFilename = safeFilename.replace(/[^\x00-\x7F]/g, '_');
  res.setHeader('Content-Disposition', `attachment; filename="${asciiFilename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

  stream.on('end', () => {
    setTimeout(() => {
      fs.rmSync(path.dirname(filePath), { recursive: true, force: true });
    }, 5000);
  });
});

module.exports = router;