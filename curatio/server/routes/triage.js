const express = require('express');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({
      status: 'error',
      detail: 'ML service unavailable. Run: npm run dev (from curatio/server)',
      message: err.message,
    });
  }
});

router.post('/predict', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ detail: 'text is required' });
    }

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({
      detail: 'ML service unavailable',
      message: err.message,
    });
  }
});

module.exports = router;
