import mongoose from "mongoose";

const academicCalendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: {
      values: ['holiday', 'exam', 'deadline', 'event', 'semester-start', 'semester-end'],
      message: '{VALUE} is not a valid event type'
    }
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value >= this.startDate;
      },
      message: 'End date must be after or equal to start date'
    }
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null  // null means university-wide event
  },
  semester: {
    type: Number,
    min: [1, 'Semester must be at least 1'],
    max: [20, 'Semester cannot exceed 20'],
    default: null
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      default: null
    },
    interval: {
      type: Number,
      min: 1,
      default: 1
    },
    endDate: {
      type: Date,
      default: null
    }
  },
  notifyUsers: {
    type: Boolean,
    default: true
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: '#3B82F6',  // Default blue color
    match: [/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
academicCalendarSchema.index({ startDate: 1, endDate: 1 });
academicCalendarSchema.index({ eventType: 1 });
academicCalendarSchema.index({ department: 1 });
academicCalendarSchema.index({ isActive: 1 });
academicCalendarSchema.index({ startDate: 1, isActive: 1 });

// Virtual for event duration in days
academicCalendarSchema.virtual('durationDays').get(function() {
  if (!this.endDate) return 1;
  const diff = this.endDate - this.startDate;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
});

// Virtual to check if event is ongoing
academicCalendarSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  const endDate = this.endDate || this.startDate;
  return this.startDate <= now && now <= endDate;
});

// Virtual to check if event is upcoming
academicCalendarSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

// Virtual to check if event is past
academicCalendarSchema.virtual('isPast').get(function() {
  const endDate = this.endDate || this.startDate;
  return endDate < new Date();
});

// Instance method to check if event affects a specific department
academicCalendarSchema.methods.affectsDepartment = function(departmentId) {
  // University-wide events (department is null) affect all departments
  if (!this.department) return true;
  return this.department.toString() === departmentId.toString();
};

// Static method to get events for a date range
academicCalendarSchema.statics.getEventsInRange = function(startDate, endDate, filters = {}) {
  const query = {
    isActive: true,
    $or: [
      // Events that start in range
      {
        startDate: { $gte: startDate, $lte: endDate }
      },
      // Events that end in range
      {
        endDate: { $gte: startDate, $lte: endDate }
      },
      // Events that span the entire range
      {
        startDate: { $lte: startDate },
        endDate: { $gte: endDate }
      }
    ]
  };

  if (filters.eventType) {
    query.eventType = filters.eventType;
  }

  if (filters.department) {
    query.$or = [
      { department: filters.department },
      { department: null }  // Include university-wide events
    ];
  }

  if (filters.semester) {
    query.$or = [
      { semester: filters.semester },
      { semester: null }  // Include non-semester-specific events
    ];
  }

  return this.find(query)
    .populate('department', 'name code')
    .populate('createdBy', 'name email')
    .sort({ startDate: 1 });
};

// Static method to get upcoming events
academicCalendarSchema.statics.getUpcomingEvents = function(limit = 10, departmentId = null) {
  const query = {
    startDate: { $gte: new Date() },
    isActive: true
  };

  if (departmentId) {
    query.$or = [
      { department: departmentId },
      { department: null }
    ];
  }

  return this.find(query)
    .populate('department', 'name code')
    .sort({ startDate: 1 })
    .limit(limit);
};

// Static method to get events by type
academicCalendarSchema.statics.getEventsByType = function(eventType, departmentId = null) {
  const query = {
    eventType: eventType,
    isActive: true
  };

  if (departmentId) {
    query.$or = [
      { department: departmentId },
      { department: null }
    ];
  }

  return this.find(query)
    .populate('department', 'name code')
    .sort({ startDate: 1 });
};

// Pre-save hook to set default end date if not provided
academicCalendarSchema.pre('save', function(next) {
  if (!this.endDate) {
    this.endDate = this.startDate;
  }
  next();
});

const AcademicCalendar = mongoose.model('AcademicCalendar', academicCalendarSchema);

export default AcademicCalendar;
