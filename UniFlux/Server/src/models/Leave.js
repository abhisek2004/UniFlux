import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userType: {
    type: String,
    enum: ['student', 'teacher', 'staff'],
    required: [true, 'User type is required']
  },
  leaveType: {
    type: String,
    enum: ['casual', 'sick', 'emergency', 'medical', 'earned', 'duty', 'maternity', 'paternity', 'personal'],
    required: [true, 'Leave type is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    trim: true,
    minlength: [10, 'Reason must be at least 10 characters'],
    maxlength: [500, 'Reason cannot exceed 500 characters']
  },
  documents: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedDate: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  remarks: {
    type: String,
    trim: true,
    maxlength: [500, 'Remarks cannot exceed 500 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  semester: {
    type: Number,
    min: 1,
    max: 10
  },
  hodApprovalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  hodApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hodApprovedDate: {
    type: Date
  },
  hodRemarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
leaveSchema.index({ userId: 1, status: 1 });
leaveSchema.index({ department: 1, status: 1 });
leaveSchema.index({ startDate: 1, endDate: 1 });
leaveSchema.index({ appliedDate: -1 });

// Virtual for calculating number of days
leaveSchema.pre('save', async function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    this.numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end date
  }
});

// Virtual to check if leave is active
leaveSchema.virtual('isActive').get(function() {
  const today = new Date();
  return this.status === 'approved' && this.startDate <= today && this.endDate >= today;
});

// Virtual to check if leave is upcoming
leaveSchema.virtual('isUpcoming').get(function() {
  const today = new Date();
  return this.status === 'approved' && this.startDate > today;
});

// Validation: End date must be after or equal to start date
leaveSchema.pre('validate', function(next) {
  if (this.endDate < this.startDate) {
    return next(new Error('End date must be after or equal to start date'));
  }
  next();
});

// Method to approve leave
leaveSchema.methods.approve = function(approverId, remarks) {
  this.status = 'approved';
  this.approvedBy = approverId;
  this.approvedDate = new Date();
  this.remarks = remarks || '';
  return this.save();
};

// Method to reject leave
leaveSchema.methods.reject = function(approverId, reason) {
  this.status = 'rejected';
  this.approvedBy = approverId;
  this.approvedDate = new Date();
  this.rejectionReason = reason;
  return this.save();
};

// Method to cancel leave
leaveSchema.methods.cancel = function() {
  if (this.status !== 'pending') {
    throw new Error('Only pending leaves can be cancelled');
  }
  this.status = 'cancelled';
  return this.save();
};

// Static method to get leaves by status
leaveSchema.statics.getByStatus = function(status, filters = {}) {
  return this.find({ status, ...filters })
    .populate('userId', 'name email')
    .populate('approvedBy', 'name email')
    .sort({ appliedDate: -1 });
};

// Static method to get pending leaves for HOD
leaveSchema.statics.getPendingForDepartment = function(department) {
  return this.find({ 
    department, 
    status: 'pending' 
  })
    .populate('userId', 'name email rollNumber employeeId')
    .sort({ appliedDate: 1 });
};

// Static method to get leave statistics
leaveSchema.statics.getStatistics = async function(filters = {}) {
  const stats = await this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalDays: { $sum: '$numberOfDays' }
      }
    }
  ]);
  
  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      count: stat.count,
      totalDays: stat.totalDays
    };
    return acc;
  }, {});
};

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
