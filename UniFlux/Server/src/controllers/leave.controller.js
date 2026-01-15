import Leave from '../models/Leave.js';
import LeaveBalance from '../models/LeaveBalance.js';
import LeavePolicy from '../models/LeavePolicy.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';

// @desc    Apply for new leave
// @route   POST /api/leaves
// @access  Private (Student, Teacher, Staff)
export const applyLeave = asyncHandler(async (req, res) => {
  const {
    leaveType,
    startDate,
    endDate,
    reason,
    documents
  } = req.body;

  const userId = req.user._id;
  const userType = req.user.role;
  const department = req.user.department;
  const semester = req.user.semester;

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (end < start) {
    throw new ApiError(400, 'End date must be after or equal to start date');
  }

  // Calculate number of days
  const diffTime = Math.abs(end - start);
  const numberOfDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Get leave policy for validation
  const policy = await LeavePolicy.getActivePolicy(userType, department);
  
  if (policy) {
    // Check if can apply for past dates
    if (!policy.generalRules.canApplyForPastDates && start < today) {
      throw new ApiError(400, 'Cannot apply leave for past dates as per policy');
    }

    // Validate leave request against policy
    const validation = policy.validateLeaveRequest(leaveType, numberOfDays, documents);
    if (!validation.valid) {
      throw new ApiError(400, validation.errors.join(', '));
    }
  }

  // Check leave balance (if applicable)
  const balanceTypes = ['casual', 'sick', 'earned', 'emergency', 'medical'];
  if (balanceTypes.includes(leaveType)) {
    const hasBalance = await LeaveBalance.checkBalance(userId, leaveType, numberOfDays);
    if (!hasBalance) {
      throw new ApiError(400, `Insufficient ${leaveType} leave balance`);
    }
  }

  // Create leave application
  const leave = await Leave.create({
    userId,
    userType,
    leaveType,
    startDate: start,
    endDate: end,
    numberOfDays,
    reason,
    documents,
    department,
    semester,
    status: 'pending'
  });

  const populatedLeave = await Leave.findById(leave._id)
    .populate('userId', 'name email rollNumber employeeId');

  res.status(201).json(
    new ApiResponse(201, populatedLeave, 'Leave application submitted successfully')
  );
});

// @desc    Get all leaves with filters
// @route   GET /api/leaves
// @access  Private (Based on role)
export const getAllLeaves = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const { status, leaveType, department, startDate, endDate, search } = req.query;

  // Build query based on user role
  let query = {};

  // If student/teacher, show only their leaves
  if (req.user.role === 'student' || req.user.role === 'teacher') {
    query.userId = req.user._id;
  }
  // If HOD, show department leaves
  else if (req.user.role === 'hod') {
    query.department = req.user.department;
  }
  // Admin/superadmin can see all

  // Apply filters
  if (status) query.status = status;
  if (leaveType) query.leaveType = leaveType;
  if (department && req.user.role === 'superadmin') query.department = department;
  
  if (startDate || endDate) {
    query.$or = [];
    if (startDate) {
      query.$or.push({ startDate: { $gte: new Date(startDate) } });
    }
    if (endDate) {
      query.$or.push({ endDate: { $lte: new Date(endDate) } });
    }
  }

  // Search by user name/email
  if (search) {
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }).select('_id');
    
    const userIds = users.map(u => u._id);
    query.userId = { $in: userIds };
  }

  // Execute query with pagination
  const [leaves, total] = await Promise.all([
    Leave.find(query)
      .populate('userId', 'name email rollNumber employeeId')
      .populate('approvedBy', 'name email')
      .populate('hodApprovedBy', 'name email')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limit),
    Leave.countDocuments(query)
  ]);

  res.json(
    new ApiResponse(200, {
      leaves,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    }, 'Leaves fetched successfully')
  );
});

// @desc    Get single leave details
// @route   GET /api/leaves/:id
// @access  Private
export const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id)
    .populate('userId', 'name email rollNumber employeeId department')
    .populate('approvedBy', 'name email role')
    .populate('hodApprovedBy', 'name email role');

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  // Check access permissions
  const canAccess = 
    req.user.role === 'superadmin' ||
    (req.user.role === 'hod' && leave.department === req.user.department) ||
    leave.userId._id.toString() === req.user._id.toString();

  if (!canAccess) {
    throw new ApiError(403, 'Not authorized to view this leave');
  }

  res.json(new ApiResponse(200, leave, 'Leave details fetched successfully'));
});

// @desc    Update pending leave
// @route   PUT /api/leaves/:id
// @access  Private (Owner only)
export const updateLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  // Only owner can update
  if (leave.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this leave');
  }

  // Only pending leaves can be updated
  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Only pending leaves can be updated');
  }

  const { leaveType, startDate, endDate, reason, documents } = req.body;

  if (startDate) leave.startDate = new Date(startDate);
  if (endDate) leave.endDate = new Date(endDate);
  if (leaveType) leave.leaveType = leaveType;
  if (reason) leave.reason = reason;
  if (documents) leave.documents = documents;

  await leave.save();

  const updatedLeave = await Leave.findById(leave._id)
    .populate('userId', 'name email rollNumber employeeId');

  res.json(new ApiResponse(200, updatedLeave, 'Leave updated successfully'));
});

// @desc    Cancel leave
// @route   DELETE /api/leaves/:id
// @access  Private (Owner only)
export const cancelLeave = asyncHandler(async (req, res) => {
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  // Only owner can cancel
  if (leave.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this leave');
  }

  // Only pending leaves can be cancelled
  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Only pending leaves can be cancelled');
  }

  await leave.cancel();

  res.json(new ApiResponse(200, leave, 'Leave cancelled successfully'));
});

// @desc    Get current user's leaves
// @route   GET /api/leaves/my-leaves
// @access  Private
export const getMyLeaves = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const { status, leaveType } = req.query;

  const query = { userId: req.user._id };
  if (status) query.status = status;
  if (leaveType) query.leaveType = leaveType;

  const [leaves, total] = await Promise.all([
    Leave.find(query)
      .populate('approvedBy', 'name email')
      .populate('hodApprovedBy', 'name email')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limit),
    Leave.countDocuments(query)
  ]);

  res.json(
    new ApiResponse(200, {
      leaves,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    }, 'Your leaves fetched successfully')
  );
});

// @desc    Get leave balance
// @route   GET /api/leaves/balance
// @access  Private
export const getLeaveBalance = asyncHandler(async (req, res) => {
  let balance = await LeaveBalance.findOne({ userId: req.user._id });

  if (!balance) {
    // Initialize balance if not exists
    const policy = await LeavePolicy.getActivePolicy(req.user.role, req.user.department);
    if (policy) {
      balance = await LeaveBalance.initializeBalance(req.user._id, req.user.role, policy);
    } else {
      throw new ApiError(404, 'Leave balance not found and no policy available to initialize');
    }
  }

  res.json(new ApiResponse(200, balance, 'Leave balance fetched successfully'));
});

// @desc    Get pending leaves for approval
// @route   GET /api/leaves/pending
// @access  Private (HOD, Admin)
export const getPendingLeaves = asyncHandler(async (req, res) => {
  let query = { status: 'pending' };

  // HOD can only see their department
  if (req.user.role === 'hod') {
    query.department = req.user.department;
  }

  const leaves = await Leave.find(query)
    .populate('userId', 'name email rollNumber employeeId department semester')
    .sort({ appliedDate: 1 });

  res.json(new ApiResponse(200, leaves, 'Pending leaves fetched successfully'));
});

// @desc    Approve leave
// @route   PUT /api/leaves/:id/approve
// @access  Private (HOD, Admin)
export const approveLeave = asyncHandler(async (req, res) => {
  const { remarks } = req.body;
  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Only pending leaves can be approved');
  }

  // Check authorization
  if (req.user.role === 'hod' && leave.department !== req.user.department) {
    throw new ApiError(403, 'Not authorized to approve leaves from other departments');
  }

  // Approve leave
  await leave.approve(req.user._id, remarks);

  // Deduct from balance (if applicable)
  const balanceTypes = ['casual', 'sick', 'earned', 'emergency', 'medical'];
  if (balanceTypes.includes(leave.leaveType)) {
    try {
      const balance = await LeaveBalance.findOne({ userId: leave.userId });
      if (balance) {
        await balance.deductLeave(leave.leaveType, leave.numberOfDays);
      }
    } catch (error) {
      // Rollback approval if balance deduction fails
      leave.status = 'pending';
      await leave.save();
      throw new ApiError(400, error.message);
    }
  }

  const approvedLeave = await Leave.findById(leave._id)
    .populate('userId', 'name email rollNumber employeeId')
    .populate('approvedBy', 'name email');

  res.json(new ApiResponse(200, approvedLeave, 'Leave approved successfully'));
});

// @desc    Reject leave
// @route   PUT /api/leaves/:id/reject
// @access  Private (HOD, Admin)
export const rejectLeave = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  
  if (!reason) {
    throw new ApiError(400, 'Rejection reason is required');
  }

  const leave = await Leave.findById(req.params.id);

  if (!leave) {
    throw new ApiError(404, 'Leave not found');
  }

  if (leave.status !== 'pending') {
    throw new ApiError(400, 'Only pending leaves can be rejected');
  }

  // Check authorization
  if (req.user.role === 'hod' && leave.department !== req.user.department) {
    throw new ApiError(403, 'Not authorized to reject leaves from other departments');
  }

  await leave.reject(req.user._id, reason);

  const rejectedLeave = await Leave.findById(leave._id)
    .populate('userId', 'name email rollNumber employeeId')
    .populate('approvedBy', 'name email');

  res.json(new ApiResponse(200, rejectedLeave, 'Leave rejected successfully'));
});

// @desc    Get leave statistics
// @route   GET /api/leaves/statistics
// @access  Private (HOD, Admin)
export const getLeaveStatistics = asyncHandler(async (req, res) => {
  const { department, startDate, endDate } = req.query;

  let filters = {};

  // HOD can only see their department
  if (req.user.role === 'hod') {
    filters.department = req.user.department;
  } else if (department) {
    filters.department = department;
  }

  if (startDate) filters.startDate = { $gte: new Date(startDate) };
  if (endDate) filters.endDate = { $lte: new Date(endDate) };

  const stats = await Leave.getStatistics(filters);

  // Get additional metrics
  const [totalLeaves, byType, byDepartment] = await Promise.all([
    Leave.countDocuments(filters),
    Leave.aggregate([
      { $match: filters },
      { $group: { _id: '$leaveType', count: { $sum: 1 }, totalDays: { $sum: '$numberOfDays' } } }
    ]),
    req.user.role === 'superadmin' ? Leave.aggregate([
      { $match: filters },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]) : []
  ]);

  res.json(
    new ApiResponse(200, {
      summary: stats,
      totalLeaves,
      byType,
      byDepartment: req.user.role === 'superadmin' ? byDepartment : null
    }, 'Leave statistics fetched successfully')
  );
});

// @desc    Get department leaves
// @route   GET /api/leaves/department/:dept
// @access  Private (HOD, Admin)
export const getDepartmentLeaves = asyncHandler(async (req, res) => {
  const { dept } = req.params;
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);

  // HOD can only access their department
  if (req.user.role === 'hod' && dept !== req.user.department) {
    throw new ApiError(403, 'Not authorized to view other department leaves');
  }

  const query = { department: dept };

  const [leaves, total] = await Promise.all([
    Leave.find(query)
      .populate('userId', 'name email rollNumber employeeId')
      .populate('approvedBy', 'name email')
      .sort({ appliedDate: -1 })
      .skip(skip)
      .limit(limit),
    Leave.countDocuments(query)
  ]);

  res.json(
    new ApiResponse(200, {
      leaves,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    }, `${dept} department leaves fetched successfully`)
  );
});
