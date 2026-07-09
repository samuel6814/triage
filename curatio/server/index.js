require('dotenv').config();

const express = require('express');
const cors = require('cors');
const triageRoutes = require('./routes/triage');
const voiceRoutes = require('./routes/voice');

const app = express();
const PORT = process.env.PORT || 5000;

// Comma-separated list of allowed client origins (set CLIENT_URL in production).
const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];
const allowedOrigins = [
  ...DEFAULT_ORIGINS,
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean),
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow same-origin / non-browser requests (no Origin header) and whitelisted origins.
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[api] ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'curatio-server' });
});

app.use('/api/triage', triageRoutes);
app.use('/api/voice', voiceRoutes);

app.listen(PORT, () => {
  console.log(`Curatio API listening on http://localhost:${PORT}`);
});
