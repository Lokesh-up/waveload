/**
 * YouTube Downloader Backend - Express Server
 */

const express = require('express');
const cors = require('cors');
const infoRouter = require('./routes/info');
const downloadRouter = require('./routes/download');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/info', infoRouter);
app.use('/api/download', downloadRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'YT Downloader API is running' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:' + PORT);
});