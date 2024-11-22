import express from 'express';
import multer from 'multer';
import path from 'path';
import Result from '../models/Result.js';

const router = express.Router();
let clients = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const client = { id: Date.now(), res };
  clients.push(client);

  req.on('close', () => {
    clients = clients.filter(c => c.id !== client.id);
  });
});

const sendEventsToAll = (newResult) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(newResult)}\n\n`);
  });
};

router.post('/results', upload.single('image'), async (req, res) => {
  try {
    const { classification } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = new Result({
      classification,
      imagePath
    });

    await result.save();
    sendEventsToAll(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/results', async (req, res) => {
  try {
    const results = await Result.find()
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;