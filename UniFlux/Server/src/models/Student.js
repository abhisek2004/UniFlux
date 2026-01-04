import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  registrationNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

export default Student;