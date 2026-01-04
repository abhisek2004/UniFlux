import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['normal', 'important', 'urgent'],
    default: 'normal'
  }
}, {
  timestamps: true
});

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;