import mongoose from 'mongoose';

const leaveBalanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  userType: {
    type: String,
    enum: ['student', 'teacher', 'staff'],
    required: true
  },
  academicYear: {
    type: String,
    required: true,
    default: function() {
      const year = new Date().getFullYear();
      return `${year}-${year + 1}`;
    }
  },
  casualLeave: {
    total: {
      type: Number,
      default: 0
    },
    used: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 0
    }
  },
  sickLeave: {
    total: {
      type: Number,
      default: 0
    },
    used: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 0
    }
  },
  earnedLeave: {
    total: {
      type: Number,
      default: 0
    },
    used: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 0
    }
  },
  emergencyLeave: {
    total: {
      type: Number,
      default: 0
    },
    used: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 0
    }
  },
  medicalLeave: {
    total: {
      type: Number,
      default: 0
    },
    used: {
      type: Number,
      default: 0
    },
    remaining: {
      type: Number,
      default: 0
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
// Note: userId already has unique index from schema definition
leaveBalanceSchema.index({ academicYear: 1 });

// Calculate remaining leaves before save
leaveBalanceSchema.pre('save', async function() {
  this.casualLeave.remaining = Math.max(0, this.casualLeave.total - this.casualLeave.used);
  this.sickLeave.remaining = Math.max(0, this.sickLeave.total - this.sickLeave.used);
  this.earnedLeave.remaining = Math.max(0, this.earnedLeave.total - this.earnedLeave.used);
  this.emergencyLeave.remaining = Math.max(0, this.emergencyLeave.total - this.emergencyLeave.used);
  this.medicalLeave.remaining = Math.max(0, this.medicalLeave.total - this.medicalLeave.used);
  this.lastUpdated = Date.now();
});

// Virtual for total leaves
leaveBalanceSchema.virtual('totalAllLeaves').get(function() {
  return {
    total: this.casualLeave.total + this.sickLeave.total + this.earnedLeave.total + 
           this.emergencyLeave.total + this.medicalLeave.total,
    used: this.casualLeave.used + this.sickLeave.used + this.earnedLeave.used + 
          this.emergencyLeave.used + this.medicalLeave.used,
    remaining: this.casualLeave.remaining + this.sickLeave.remaining + this.earnedLeave.remaining + 
               this.emergencyLeave.remaining + this.medicalLeave.remaining
  };
});

// Method to deduct leave
leaveBalanceSchema.methods.deductLeave = function(leaveType, days) {
  const leaveTypeMap = {
    'casual': 'casualLeave',
    'sick': 'sickLeave',
    'earned': 'earnedLeave',
    'emergency': 'emergencyLeave',
    'medical': 'medicalLeave'
  };

  const field = leaveTypeMap[leaveType];
  if (!field) {
    throw new Error(`Invalid leave type: ${leaveType}`);
  }

  if (this[field].remaining < days) {
    throw new Error(`Insufficient ${leaveType} leave balance. Available: ${this[field].remaining}, Required: ${days}`);
  }

  this[field].used += days;
  return this.save();
};

// Method to restore leave (when leave is cancelled)
leaveBalanceSchema.methods.restoreLeave = function(leaveType, days) {
  const leaveTypeMap = {
    'casual': 'casualLeave',
    'sick': 'sickLeave',
    'earned': 'earnedLeave',
    'emergency': 'emergencyLeave',
    'medical': 'medicalLeave'
  };

  const field = leaveTypeMap[leaveType];
  if (!field) {
    throw new Error(`Invalid leave type: ${leaveType}`);
  }

  this[field].used = Math.max(0, this[field].used - days);
  return this.save();
};

// Method to reset leave balance for new academic year
leaveBalanceSchema.methods.resetForNewYear = function(policy) {
  this.academicYear = policy.academicYear;
  
  if (policy.policies.casualLeave) {
    this.casualLeave.total = policy.policies.casualLeave.quota;
    this.casualLeave.used = 0;
  }
  
  if (policy.policies.sickLeave) {
    this.sickLeave.total = policy.policies.sickLeave.quota;
    this.sickLeave.used = 0;
  }
  
  if (policy.policies.earnedLeave) {
    this.earnedLeave.total = policy.policies.earnedLeave.quota;
    this.earnedLeave.used = 0;
  }
  
  if (policy.policies.emergencyLeave) {
    this.emergencyLeave.total = policy.policies.emergencyLeave.quota;
    this.emergencyLeave.used = 0;
  }
  
  if (policy.policies.medicalLeave) {
    this.medicalLeave.total = policy.policies.medicalLeave.quota;
    this.medicalLeave.used = 0;
  }
  
  return this.save();
};

// Static method to initialize balance for a user
leaveBalanceSchema.statics.initializeBalance = async function(userId, userType, policy) {
  const academicYear = policy?.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  
  const balance = new this({
    userId,
    userType,
    academicYear,
    casualLeave: {
      total: policy?.policies?.casualLeave?.quota || 0,
      used: 0,
      remaining: policy?.policies?.casualLeave?.quota || 0
    },
    sickLeave: {
      total: policy?.policies?.sickLeave?.quota || 0,
      used: 0,
      remaining: policy?.policies?.sickLeave?.quota || 0
    },
    earnedLeave: {
      total: policy?.policies?.earnedLeave?.quota || 0,
      used: 0,
      remaining: policy?.policies?.earnedLeave?.quota || 0
    },
    emergencyLeave: {
      total: policy?.policies?.emergencyLeave?.quota || 0,
      used: 0,
      remaining: policy?.policies?.emergencyLeave?.quota || 0
    },
    medicalLeave: {
      total: policy?.policies?.medicalLeave?.quota || 0,
      used: 0,
      remaining: policy?.policies?.medicalLeave?.quota || 0
    }
  });

  return balance.save();
};

// Static method to check if user has sufficient balance
leaveBalanceSchema.statics.checkBalance = async function(userId, leaveType, days) {
  const balance = await this.findOne({ userId });
  if (!balance) {
    throw new Error('Leave balance not found for user');
  }

  const leaveTypeMap = {
    'casual': 'casualLeave',
    'sick': 'sickLeave',
    'earned': 'earnedLeave',
    'emergency': 'emergencyLeave',
    'medical': 'medicalLeave'
  };

  const field = leaveTypeMap[leaveType];
  if (!field) {
    return true; // For leave types not tracked (like duty leave)
  }

  return balance[field].remaining >= days;
};

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

export default LeaveBalance;
