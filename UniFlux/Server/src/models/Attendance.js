import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  subjectId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    required: true
  },
  teacherId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique attendance records per student, subject, and date
attendanceSchema.index({ studentId: 1, subjectId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;