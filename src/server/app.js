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
// 수정 후
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
   });
   
app.get('/analysis', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/analysis.html'));
   });
   
   // 그 외 경로에 대한 처리
app.get('*', (req, res) => {
    res.redirect('/');
   });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});

// app.js의 MongoDB 연결 부분 수정
try {
    console.log('MongoDB 연결 시도 중...');
    console.log('연결 URL:', 'mongodb://127.0.0.1:27017/sorting_system');
    
    await mongoose.connect('mongodb://127.0.0.1:27017/sorting_system', {
      serverSelectionTimeoutMS: 5000
    });
    
    console.log('MongoDB 연결 성공');
    console.log('데이터베이스 이름:', mongoose.connection.name);
    console.log('연결 상태:', mongoose.connection.readyState);
    
    mongoose.connection.on('error', err => {
      console.error('MongoDB 연결 에러:', err);
    });
  
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB 연결이 끊어짐');
    });
  } catch (err) {
    console.error('MongoDB 연결 실패:', err);
    console.error('에러 세부 정보:', {
      name: err.name,
      message: err.message,
      code: err.code
    });
    process.exit(1);
  }