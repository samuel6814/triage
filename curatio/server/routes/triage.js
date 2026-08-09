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

    const url = new URL(`${ML_SERVICE_URL}/predict`);
    // OpenMed enrichment is on by default; pass openmed=false to disable.
    const openmedOff =
      req.query.openmed === 'false' ||
      req.query.openmed === '0' ||
      req.query.enrich === 'false';
    const openmedOn =
      req.query.openmed === 'true' ||
      req.query.openmed === '1' ||
      req.query.enrich === 'true';
    if (openmedOff) {
      url.searchParams.set('openmed', 'false');
    } else if (openmedOn || req.query.openmed == null) {
      // Default on when query omitted (matches ML default).
      url.searchParams.set('openmed', 'true');
    }

    // Medical gate is on by default; pass gate=false to disable for demos.
    const gateOff =
      req.query.gate === 'false' || req.query.gate === '0';
    url.searchParams.set('gate', gateOff ? 'false' : 'true');

    const useGate = url.searchParams.get('gate') === 'true';
    const useOpenMed = url.searchParams.get('openmed') === 'true';
    console.log(
      `[api] predict proxy text_len=${text.trim().length} gate=${useGate} openmed=${useOpenMed}`,
    );

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    });

    const data = await response.json();
    if (response.ok && data.predicted_acuity_level != null) {
      console.log(
        `[api] predict result level=${data.predicted_acuity_level} confidence=${data.confidence}`,
      );
    }
    res.status(response.status).json(data);
  } catch (err) {
    console.error(`[api] predict proxy error: ${err.message}`);
    res.status(503).json({
      detail: 'ML service unavailable',
      message: err.message,
    });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ detail: 'text is required' });
    }

    const response = await fetch(`${ML_SERVICE_URL}/analyze`, {
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

router.post('/deidentify', async (req, res) => {
  try {
    const { text, method = 'mask' } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ detail: 'text is required' });
    }

    const response = await fetch(`${ML_SERVICE_URL}/deidentify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), method }),
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
