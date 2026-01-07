import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Department code cannot exceed 10 characters']
  },
  hodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  establishedYear: {
    type: Number,
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
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
departmentSchema.index({ code: 1 });
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });

// Virtual for HOD details
departmentSchema.virtual('hod', {
  ref: 'User',
  localField: 'hodId',
  foreignField: '_id',
  justOne: true
});

// Instance method to get active courses
departmentSchema.methods.getActiveCourses = async function() {
  const Course = mongoose.model('Course');
  return await Course.find({ department: this._id, isActive: true });
};

// Static method to find by code
departmentSchema.statics.findByCode = function(code) {
  return this.findOne({ code: code.toUpperCase() });
};

const Department = mongoose.model('Department', departmentSchema);

export default Department;
