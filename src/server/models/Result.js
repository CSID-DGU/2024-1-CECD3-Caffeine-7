import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  classification: String,
  imagePath: String,
  weight: Number
});

export default mongoose.model('Result', ResultSchema);