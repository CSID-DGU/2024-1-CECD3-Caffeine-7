// routes/results.js
import express from 'express';
import multer from 'multer';
import { GridFSBucket } from 'mongodb';
import mongoose from 'mongoose';
import Result from '../models/Result.js';

const router = express.Router();
let clients = [];
let bucket;

// GridFS 버킷 초기화
mongoose.connection.once('open', () => {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'images'
  });
});


// SSE 엔드포인트
router.get('/events', (req, res) => {
  console.log('새로운 SSE 클라이언트 연결됨');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const client = { id: Date.now(), res };
  clients.push(client);
  console.log(`현재 연결된 클라이언트 수: ${clients.length}`);

  req.on('close', () => {
    console.log('클라이언트 연결 종료');
    clients = clients.filter(c => c.id !== client.id);
    console.log(`남은 클라이언트 수: ${clients.length}`);
  });
});

const sendEventsToAll = (newResult) => {
  console.log('새 결과 브로드캐스팅:', newResult);
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(newResult)}\n\n`);
  });
};


router.get('/images/:id', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    // GridFS에서 파일 존재 여부 먼저 확인
    const files = await mongoose.connection.db.collection('fs.files').findOne({ _id: fileId });
    
    if (!files) {
      return res.status(404).json({ error: '이미지 파일을 찾을 수 없습니다.' });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'fs'
    });
    
    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.on('error', (error) => {
      console.error('이미지 스트리밍 오류:', error);
      res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
    });

    res.set('Content-Type', files.contentType || 'image/jpeg');
    downloadStream.pipe(res);
  } catch (error) {
    console.error('이미지 조회 오류:', error);
    res.status(500).json({ error: error.message });
  }
});

// 결과 조회 엔드포인트
router.get('/results', async (req, res) => {
  try {
    console.log('결과 데이터 조회 요청 수신');
    const results = await Result.find()
      .sort({ timestamp: -1 })
      .limit(50);
    
    console.log(`${results.length}개의 결과 데이터 조회됨`);
    res.json(results);
  } catch (error) {
    console.error('결과 조회 중 오류 발생:', error);
    res.status(500).json({ error: error.message });
  }
});

// 특정 결과 조회 엔드포인트
router.get('/results/:id', async (req, res) => {
  try {
    console.log('특정 결과 조회 요청:', req.params.id);
    const result = await Result.findById(req.params.id);
    
    if (!result) {
      console.log('결과를 찾을 수 없음');
      return res.status(404).json({ message: '결과를 찾을 수 없습니다.' });
    }

    console.log('조회된 결과:', result);
    res.json(result);
  } catch (error) {
    console.error('특정 결과 조회 중 오류 발생:', error);
    res.status(500).json({ error: error.message });
  }
});

// 데이터베이스 상태 확인 엔드포인트
router.get('/health', async (req, res) => {
  try {
    console.log('데이터베이스 상태 확인 요청');
    const count = await Result.countDocuments();
    console.log(`총 ${count}개의 결과 데이터 존재`);
    res.json({ status: 'healthy', count });
  } catch (error) {
    console.error('데이터베이스 상태 확인 중 오류:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;