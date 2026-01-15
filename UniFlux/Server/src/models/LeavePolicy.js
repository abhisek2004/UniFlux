import mongoose from 'mongoose';

const leavePolicySchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ['student', 'teacher', 'staff'],
    required: [true, 'User type is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  academicYear: {
    type: String,
    required: [true, 'Academic year is required'],
    default: function() {
      const year = new Date().getFullYear();
      return `${year}-${year + 1}`;
    }
  },
  policies: {
    casualLeave: {
      quota: {
        type: Number,
        default: 10,
        min: 0
      },
      maxConsecutive: {
        type: Number,
        default: 3,
        min: 1
      },
      requiresDocument: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        default: 'Leave for personal work or unforeseen circumstances'
      }
    },
    sickLeave: {
      quota: {
        type: Number,
        default: 10,
        min: 0
      },
      maxConsecutive: {
        type: Number,
        default: 7,
        min: 1
      },
      requiresDocument: {
        type: Boolean,
        default: true
      },
      documentRequiredAfterDays: {
        type: Number,
        default: 3
      },
      description: {
        type: String,
        default: 'Leave for illness or medical treatment'
      }
    },
    earnedLeave: {
      quota: {
        type: Number,
        default: 15,
        min: 0
      },
      maxConsecutive: {
        type: Number,
        default: 10,
        min: 1
      },
      requiresDocument: {
        type: Boolean,
        default: false
      },
      advanceNoticeDays: {
        type: Number,
        default: 7
      },
      description: {
        type: String,
        default: 'Earned leave for planned vacation'
      }
    },
    emergencyLeave: {
      quota: {
        type: Number,
        default: 5,
        min: 0
      },
      maxConsecutive: {
        type: Number,
        default: 5,
        min: 1
      },
      requiresDocument: {
        type: Boolean,
        default: true
      },
      description: {
        type: String,
        default: 'Leave for emergency situations'
      }
    },
    medicalLeave: {
      quota: {
        type: Number,
        default: 12,
        min: 0
      },
      maxConsecutive: {
        type: Number,
        default: 15,
        min: 1
      },
      requiresDocument: {
        type: Boolean,
        default: true
      },
      description: {
        type: String,
        default: 'Medical leave with doctor certificate'
      }
    },
    dutyLeave: {
      requiresDocument: {
        type: Boolean,
        default: true
      },
      description: {
        type: String,
        default: 'Leave for official duty or academic activities'
      }
    },
    maternityLeave: {
      quota: {
        type: Number,
        default: 180,
        min: 0
      },
      requiresDocument: {
        type: Boolean,
        default: true
      },
      description: {
        type: String,
        default: 'Maternity leave for female faculty/staff'
      }
    },
    paternityLeave: {
      quota: {
        type: Number,
        default: 15,
        min: 0
      },
      requiresDocument: {
        type: Boolean,
        default: true
      },
      description: {
        type: String,
        default: 'Paternity leave for male faculty/staff'
      }
    }
  },
  generalRules: {
    minimumAttendanceRequired: {
      type: Number,
      default: 75,
      min: 0,
      max: 100
    },
    maxLeavesPerMonth: {
      type: Number,
      default: 5
    },
    canApplyForPastDates: {
      type: Boolean,
      default: false
    },
    approvalWorkflow: {
      type: String,
      enum: ['hod-only', 'hod-then-admin', 'admin-only'],
      default: 'hod-only'
    },
    autoApprovalForDays: {
      type: Number,
      default: 0, // 0 means no auto-approval
      min: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
leavePolicySchema.index({ userType: 1, department: 1, academicYear: 1 });
leavePolicySchema.index({ isActive: 1 });

// Ensure only one active policy per userType-department-year combination
leavePolicySchema.index(
  { userType: 1, department: 1, academicYear: 1, isActive: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

// Static method to get active policy
leavePolicySchema.statics.getActivePolicy = function(userType, department, academicYear) {
  const year = academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;
  return this.findOne({
    userType,
    department,
    academicYear: year,
    isActive: true
  });
};

// Static method to create default policy
leavePolicySchema.statics.createDefaultPolicy = function(userType, department, createdBy) {
  const year = new Date().getFullYear();
  const academicYear = `${year}-${year + 1}`;

  const defaultPolicies = {
    student: {
      policies: {
        casualLeave: { quota: 5, maxConsecutive: 2, requiresDocument: false },
        sickLeave: { quota: 10, maxConsecutive: 5, requiresDocument: true, documentRequiredAfterDays: 3 },
        emergencyLeave: { quota: 3, maxConsecutive: 3, requiresDocument: true },
        medicalLeave: { quota: 10, maxConsecutive: 7, requiresDocument: true }
      },
      generalRules: {
        minimumAttendanceRequired: 75,
        maxLeavesPerMonth: 5,
        canApplyForPastDates: false,
        approvalWorkflow: 'hod-only'
      }
    },
    teacher: {
      policies: {
        casualLeave: { quota: 10, maxConsecutive: 3, requiresDocument: false },
        sickLeave: { quota: 12, maxConsecutive: 7, requiresDocument: true, documentRequiredAfterDays: 3 },
        earnedLeave: { quota: 15, maxConsecutive: 10, requiresDocument: false, advanceNoticeDays: 7 },
        emergencyLeave: { quota: 5, maxConsecutive: 5, requiresDocument: true },
        medicalLeave: { quota: 15, maxConsecutive: 15, requiresDocument: true },
        maternityLeave: { quota: 180, requiresDocument: true },
        paternityLeave: { quota: 15, requiresDocument: true }
      },
      generalRules: {
        maxLeavesPerMonth: 10,
        canApplyForPastDates: false,
        approvalWorkflow: 'hod-then-admin'
      }
    }
  };

  const policyData = defaultPolicies[userType] || defaultPolicies.student;

  return this.create({
    userType,
    department,
    academicYear,
    ...policyData,
    createdBy,
    isActive: true
  });
};

// Method to check if leave request complies with policy
leavePolicySchema.methods.validateLeaveRequest = function(leaveType, numberOfDays, documents) {
  const leaveTypeMap = {
    'casual': 'casualLeave',
    'sick': 'sickLeave',
    'earned': 'earnedLeave',
    'emergency': 'emergencyLeave',
    'medical': 'medicalLeave',
    'maternity': 'maternityLeave',
    'paternity': 'paternityLeave',
    'duty': 'dutyLeave'
  };

  const policyField = leaveTypeMap[leaveType];
  if (!policyField || !this.policies[policyField]) {
    return { valid: true }; // No policy defined, allow it
  }

  const policy = this.policies[policyField];
  const errors = [];

  // Check max consecutive days
  if (policy.maxConsecutive && numberOfDays > policy.maxConsecutive) {
    errors.push(`Maximum consecutive ${leaveType} leave is ${policy.maxConsecutive} days`);
  }

  // Check document requirement
  if (policy.requiresDocument && (!documents || documents.length === 0)) {
    if (policy.documentRequiredAfterDays) {
      if (numberOfDays > policy.documentRequiredAfterDays) {
        errors.push(`Document required for ${leaveType} leave exceeding ${policy.documentRequiredAfterDays} days`);
      }
    } else {
      errors.push(`Document is required for ${leaveType} leave`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Virtual to get total leave quota across all types
leavePolicySchema.virtual('totalQuota').get(function() {
  let total = 0;
  if (this.policies.casualLeave?.quota) total += this.policies.casualLeave.quota;
  if (this.policies.sickLeave?.quota) total += this.policies.sickLeave.quota;
  if (this.policies.earnedLeave?.quota) total += this.policies.earnedLeave.quota;
  if (this.policies.emergencyLeave?.quota) total += this.policies.emergencyLeave.quota;
  if (this.policies.medicalLeave?.quota) total += this.policies.medicalLeave.quota;
  return total;
});

const LeavePolicy = mongoose.model('LeavePolicy', leavePolicySchema);

export default LeavePolicy;
