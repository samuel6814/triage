const express = require('express');
const multer = require('multer');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8001';
const VOICE_MAX_BYTES = Number(process.env.VOICE_MAX_BYTES || 10 * 1024 * 1024);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: VOICE_MAX_BYTES },
});

const router = express.Router();

router.post('/intake', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'audio file is required' });
    }

    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/webm' });
    form.append('audio', blob, req.file.originalname || 'recording.webm');
    form.append('language', req.body.language || 'tw');

    const response = await fetch(`${ML_SERVICE_URL}/voice/intake`, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    res.status(503).json({
      detail: 'Voice service unavailable',
      message: err.message,
    });
  }
});

module.exports = router;
