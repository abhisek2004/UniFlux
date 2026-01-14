import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [150, 'Course name cannot exceed 150 characters']
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'Course code cannot exceed 20 characters']
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: [true, 'Department reference is required']
  },
  duration: {
    type: Number,
    required: [true, 'Course duration is required'],
    min: [1, 'Duration must be at least 1 year'],
    max: [10, 'Duration cannot exceed 10 years']
  },
  totalSemesters: {
    type: Number,
    required: [true, 'Total semesters is required'],
    min: [1, 'Must have at least 1 semester'],
    max: [20, 'Cannot exceed 20 semesters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ code: 1 });
courseSchema.index({ department: 1 });
courseSchema.index({ isActive: 1 });
courseSchema.index({ department: 1, isActive: 1 });

// Virtual for subjects
courseSchema.virtual('subjects', {
  ref: 'Subject',
  localField: '_id',
  foreignField: 'course'
});

// Instance method to get subjects by semester
courseSchema.methods.getSubjectsBySemester = async function(semester) {
  const Subject = mongoose.model('Subject');
  return await Subject.find({ 
    course: this._id, 
    semester: semester,
    isActive: true 
  });
};

// Static method to find by code
courseSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() }).populate('department');
};

const Course = mongoose.model('Course', courseSchema);

export default Course;
