// src/server/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import resultRoutes from './routes/results.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('uploads 디렉토리 생성됨');
}

console.log('Starting server...');

try {
 console.log('Connecting to MongoDB...');
 await mongoose.connect('mongodb://127.0.0.1:27017/sorting_system');
 console.log('MongoDB Connected');
} catch (err) {
 console.error('MongoDB connection error:', err);
 process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
app.use(express.static(path.join(__dirname, '../client')));
app.use('/api', resultRoutes);

// SPA를 위한 catch-all 라우트
app.get('*', (req, res) => {
 res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});