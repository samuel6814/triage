require('dotenv').config();

const express = require('express');
const cors = require('cors');
const triageRoutes = require('./routes/triage');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
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
