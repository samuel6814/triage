require('dotenv').config();

const express = require('express');
const cors = require('cors');
const triageRoutes = require('./routes/triage');

const app = express();
const PORT = process.env.PORT || 5000;

// Comma-separated list of allowed client origins (set CLIENT_URL in production).
const DEFAULT_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'curatio-server' });
});

app.use('/api/triage', triageRoutes);

app.listen(PORT, () => {
  console.log(`Curatio API listening on http://localhost:${PORT}`);
});
