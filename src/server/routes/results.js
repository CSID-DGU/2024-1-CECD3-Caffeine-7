import express from 'express';
import multer from 'multer';
import path from 'path';
import Result from '../models/Result.js';

const router = express.Router();
let clients = [];

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('파일 업로드 요청:', file.originalname);
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}${path.extname(file.originalname)}`;
    console.log('생성된 파일명:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage });

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

// 결과 생성 엔드포인트
router.post('/results', upload.single('image'), async (req, res) => {
  try {
    console.log('새 결과 데이터 수신:', req.body);
    const { classification } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (req.file) {
      console.log('업로드된 이미지 경로:', imagePath);
    }

    const result = new Result({
      classification,
      imagePath,
      timestamp: new Date(),
      weight: req.body.weight || 0
    });

    console.log('저장할 결과 데이터:', result);
    await result.save();
    console.log('결과 저장 완료');

    sendEventsToAll(result);
    res.json(result);
  } catch (error) {
    console.error('결과 저장 중 오류 발생:', error);
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