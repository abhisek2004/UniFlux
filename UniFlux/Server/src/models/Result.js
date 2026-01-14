import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student reference is required']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [20, 'Semester cannot exceed 20']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required']
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marks'
  }],
  sgpa: {
    type: Number,
    min: [0, 'SGPA cannot be negative'],
    max: [10, 'SGPA cannot exceed 10'],
    default: 0
  },
  cgpa: {
    type: Number,
    min: [0, 'CGPA cannot be negative'],
    max: [10, 'CGPA cannot exceed 10'],
    default: 0
  },
  percentage: {
    type: Number,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100'],
    default: 0
  },
  status: {
    type: String,
    enum: ['pass', 'fail', 'pending'],
    default: 'pending'
  },
  publishedDate: {
    type: Date,
    default: null
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for uniqueness
resultSchema.index({ student: 1, semester: 1 }, { unique: true });
resultSchema.index({ course: 1, semester: 1 });
resultSchema.index({ isPublished: 1 });
resultSchema.index({ status: 1 });

// Virtual for grade classification
resultSchema.virtual('gradeClass').get(function() {
  if (this.cgpa >= 9.0) return 'Outstanding';
  if (this.cgpa >= 8.0) return 'Excellent';
  if (this.cgpa >= 7.0) return 'Very Good';
  if (this.cgpa >= 6.0) return 'Good';
  if (this.cgpa >= 5.0) return 'Average';
  return 'Poor';
});

// Method to calculate SGPA
resultSchema.methods.calculateSGPA = async function() {
  const Marks = mongoose.model('Marks');
  const marks = await Marks.find({ 
    _id: { $in: this.subjects },
    isApproved: true 
  }).populate('subject');

  if (marks.length === 0) {
    this.sgpa = 0;
    return 0;
  }

  let totalCredits = 0;
  let totalGradePoints = 0;

  for (const mark of marks) {
    if (mark.subject && mark.subject.credits) {
      const gradePoint = this.getGradePoint(mark.grade);
      totalGradePoints += gradePoint * mark.subject.credits;
      totalCredits += mark.subject.credits;
    }
  }

  this.sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
  return this.sgpa;
};

// Helper method to convert grade to grade point
resultSchema.methods.getGradePoint = function(grade) {
  const gradePoints = {
    'A+': 10, 'A': 9, 'B+': 8, 'B': 7,
    'C+': 6, 'C': 5, 'D': 4, 'F': 0
  };
  return gradePoints[grade] || 0;
};

// Method to calculate CGPA (average of all semesters)
resultSchema.statics.calculateCGPA = async function(studentId) {
  const results = await this.find({ 
    student: studentId, 
    isPublished: true 
  });

  if (results.length === 0) return 0;

  const totalSGPA = results.reduce((sum, result) => sum + result.sgpa, 0);
  return (totalSGPA / results.length).toFixed(2);
};

// Pre-save hook to set status based on SGPA
resultSchema.pre('save', function(next) {
  if (this.sgpa >= 5.0) {
    this.status = 'pass';
  } else if (this.sgpa > 0) {
    this.status = 'fail';
  }
  
  // Calculate percentage (assuming 10-point scale)
  this.percentage = (this.sgpa * 10).toFixed(2);
  
  next();
});

const Result = mongoose.model('Result', resultSchema);

export default Result;
