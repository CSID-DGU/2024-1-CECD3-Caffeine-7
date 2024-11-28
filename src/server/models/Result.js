import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  classification: {
    type: String,
    enum: ['trash', 'can', 'glass', 'plastic', 'test data'],
    required: true
  },
  weight: Number,
  image_id: mongoose.Schema.Types.ObjectId
});

export default mongoose.model('Result', ResultSchema);