import mongoose from "mongoose";

const marksSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  subjectId: {
    type: String,
    required: true
  },
  internalMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  externalMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  grade: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique marks per student and subject
marksSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });

const Marks = mongoose.model('Marks', marksSchema);

export default Marks;