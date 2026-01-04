import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true
  },
  teacherId: {
    type: String,
    required: true
  },
  teacherName: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  credits: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;