import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course reference is required']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [20, 'Semester cannot exceed 20']
  },
  dayOfWeek: {
    type: String,
    required: [true, 'Day of week is required'],
    enum: {
      values: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      message: '{VALUE} is not a valid day'
    },
    lowercase: true
  },
  timeSlot: {
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Start time must be in HH:MM format']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'End time must be in HH:MM format']
    }
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject reference is required']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Teacher reference is required']
  },
  classroom: {
    type: String,
    required: [true, 'Classroom is required'],
    trim: true,
    maxlength: [50, 'Classroom name cannot exceed 50 characters']
  },
  type: {
    type: String,
    enum: {
      values: ['lecture', 'lab', 'tutorial'],
      message: '{VALUE} is not a valid class type'
    },
    default: 'lecture'
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

// Compound index for conflict detection
timetableSchema.index({ 
  course: 1, 
  semester: 1, 
  dayOfWeek: 1, 
  'timeSlot.startTime': 1 
}, { unique: true });

// Additional indexes for queries
timetableSchema.index({ teacher: 1, dayOfWeek: 1, 'timeSlot.startTime': 1 });
timetableSchema.index({ classroom: 1, dayOfWeek: 1, 'timeSlot.startTime': 1 });
timetableSchema.index({ subject: 1 });
timetableSchema.index({ isActive: 1 });

// Virtual for duration in minutes
timetableSchema.virtual('durationMinutes').get(function() {
  const start = this.timeSlot.startTime.split(':');
  const end = this.timeSlot.endTime.split(':');
  const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
  const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
  return endMinutes - startMinutes;
});

// Pre-validate hook to check time slot validity
timetableSchema.pre('validate', function(next) {
  if (this.timeSlot && this.timeSlot.startTime && this.timeSlot.endTime) {
    const start = this.timeSlot.startTime.split(':');
    const end = this.timeSlot.endTime.split(':');
    const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
    const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
    
    if (startMinutes >= endMinutes) {
      next(new Error('End time must be after start time'));
      return;
    }
  }
  next();
});

// Static method to check for teacher conflicts
timetableSchema.statics.checkTeacherConflict = async function(teacherId, dayOfWeek, startTime, endTime, excludeId = null) {
  const query = {
    teacher: teacherId,
    dayOfWeek: dayOfWeek,
    isActive: true,
    $or: [
      {
        'timeSlot.startTime': { $lt: endTime },
        'timeSlot.endTime': { $gt: startTime }
      }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflict = await this.findOne(query);
  return conflict !== null;
};

// Static method to check for classroom conflicts
timetableSchema.statics.checkClassroomConflict = async function(classroom, dayOfWeek, startTime, endTime, excludeId = null) {
  const query = {
    classroom: classroom,
    dayOfWeek: dayOfWeek,
    isActive: true,
    $or: [
      {
        'timeSlot.startTime': { $lt: endTime },
        'timeSlot.endTime': { $gt: startTime }
      }
    ]
  };
  
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  const conflict = await this.findOne(query);
  return conflict !== null;
};

// Static method to get timetable for a course and semester
timetableSchema.statics.getCourseTimetable = function(courseId, semester) {
  return this.find({ course: courseId, semester: semester, isActive: true })
    .populate('subject', 'name code credits')
    .populate('teacher', 'name email')
    .sort({ dayOfWeek: 1, 'timeSlot.startTime': 1 });
};

// Static method to get teacher's schedule
timetableSchema.statics.getTeacherSchedule = function(teacherId) {
  return this.find({ teacher: teacherId, isActive: true })
    .populate('course', 'name code')
    .populate('subject', 'name code')
    .sort({ dayOfWeek: 1, 'timeSlot.startTime': 1 });
};

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;
