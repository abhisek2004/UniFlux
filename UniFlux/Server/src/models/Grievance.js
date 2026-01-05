import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  resolvedAt: {
    type: Date
  },
  response: {
    type: String
  }
}, {
  timestamps: true
});

const Grievance = mongoose.model('Grievance', grievanceSchema);

export default Grievance;