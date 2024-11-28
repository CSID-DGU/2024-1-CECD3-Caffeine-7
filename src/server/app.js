// src/server/app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import resultRoutes from './routes/results.js';
import fs from 'fs';
import { GridFSBucket } from 'mongodb';
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const BASE_URL = process.env.BASE_URL || 'http://caffeine.us-east-1.elasticbeanstalk.com';
const PORT = process.env.PORT || 8081;

console.log(`Server running on uri ${MONGODB_URI}`);

const app = express();

// CORS configuration
app.use(cors({
  origin: BASE_URL,
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Middleware to inject environment variables
app.use((req, res, next) => {
  res.locals.env = {
    BASE_URL: process.env.BASE_URL,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    PAGE_LIMIT: process.env.PAGE_LIMIT
  };
  next();
});

app.use('/api', resultRoutes);

// Route handlers
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.get('/analysis', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/analysis.html'));
});

app.get('/realtime', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/realtime.html'));
});

// Catch-all route
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// MongoDB connection
try {
  console.log('Attempting to connect to MongoDB Atlas...');
  
  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'images'
  });

  console.log('GridFS bucket initialized');
  console.log('MongoDB connection successful');
  console.log('Database name:', mongoose.connection.name);
  console.log('Connection state:', mongoose.connection.readyState);
  
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection lost');
  });
} catch (err) {
  console.error('MongoDB connection failed:', err);
  console.error('Error details:', {
    name: err.name,
    message: err.message,
    code: err.code
  });
  process.exit(1);
}