import LeaveBalance from '../models/LeaveBalance.js';
import LeavePolicy from '../models/LeavePolicy.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

// @desc    Get user leave balance
// @route   GET /api/leave-balance/:userId
// @access  Private (Owner, Admin, HOD)
export const getUserBalance = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check access
  const canAccess = 
    req.user.role === 'superadmin' ||
    req.user.role === 'hod' ||
    req.user._id.toString() === userId;

  if (!canAccess) {
    throw new ApiError(403, 'Not authorized to view this balance');
  }

  const balance = await LeaveBalance.findOne({ userId })
    .populate('userId', 'name email rollNumber employeeId department');

  if (!balance) {
    throw new ApiError(404, 'Leave balance not found');
  }

  res.json(new ApiResponse(200, balance, 'Leave balance fetched successfully'));
});

// @desc    Get current user's leave balance
// @route   GET /api/leave-balance/my-balance
// @access  Private
export const getMyBalance = asyncHandler(async (req, res) => {
  let balance = await LeaveBalance.findOne({ userId: req.user._id });

  if (!balance) {
    // Try to initialize if policy exists
    const policy = await LeavePolicy.getActivePolicy(req.user.role, req.user.department);
    if (policy) {
      balance = await LeaveBalance.initializeBalance(req.user._id, req.user.role, policy);
    } else {
      throw new ApiError(404, 'Leave balance not found and no policy available to initialize');
    }
  }

  res.json(new ApiResponse(200, balance, 'Your leave balance fetched successfully'));
});

// @desc    Update user leave balance (Admin only)
// @route   PUT /api/leave-balance/:userId
// @access  Private (Admin only)
export const updateUserBalance = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { casualLeave, sickLeave, earnedLeave, emergencyLeave, medicalLeave } = req.body;

  const balance = await LeaveBalance.findOne({ userId });

  if (!balance) {
    throw new ApiError(404, 'Leave balance not found');
  }

  // Update balances
  if (casualLeave) {
    if (casualLeave.total !== undefined) balance.casualLeave.total = casualLeave.total;
    if (casualLeave.used !== undefined) balance.casualLeave.used = casualLeave.used;
  }

  if (sickLeave) {
    if (sickLeave.total !== undefined) balance.sickLeave.total = sickLeave.total;
    if (sickLeave.used !== undefined) balance.sickLeave.used = sickLeave.used;
  }

  if (earnedLeave) {
    if (earnedLeave.total !== undefined) balance.earnedLeave.total = earnedLeave.total;
    if (earnedLeave.used !== undefined) balance.earnedLeave.used = earnedLeave.used;
  }

  if (emergencyLeave) {
    if (emergencyLeave.total !== undefined) balance.emergencyLeave.total = emergencyLeave.total;
    if (emergencyLeave.used !== undefined) balance.emergencyLeave.used = emergencyLeave.used;
  }

  if (medicalLeave) {
    if (medicalLeave.total !== undefined) balance.medicalLeave.total = medicalLeave.total;
    if (medicalLeave.used !== undefined) balance.medicalLeave.used = medicalLeave.used;
  }

  await balance.save();

  const updatedBalance = await LeaveBalance.findById(balance._id)
    .populate('userId', 'name email rollNumber employeeId');

  res.json(new ApiResponse(200, updatedBalance, 'Leave balance updated successfully'));
});

// @desc    Initialize balance for new academic year
// @route   POST /api/leave-balance/initialize
// @access  Private (Admin only)
export const initializeBalances = asyncHandler(async (req, res) => {
  const { userType, department, academicYear } = req.body;

  if (!userType || !department) {
    throw new ApiError(400, 'userType and department are required');
  }

  // Get active policy
  const policy = await LeavePolicy.getActivePolicy(userType, department, academicYear);

  if (!policy) {
    throw new ApiError(404, 'No active policy found for the specified criteria');
  }

  // Find all users matching criteria
  const users = await User.find({
    role: userType,
    department: department
  });

  if (users.length === 0) {
    throw new ApiError(404, 'No users found matching the criteria');
  }

  const results = {
    initialized: 0,
    updated: 0,
    failed: 0,
    errors: []
  };

  // Initialize or update balance for each user
  for (const user of users) {
    try {
      const existingBalance = await LeaveBalance.findOne({ userId: user._id });

      if (existingBalance) {
        // Reset for new year
        await existingBalance.resetForNewYear(policy);
        results.updated++;
      } else {
        // Create new balance
        await LeaveBalance.initializeBalance(user._id, user.role, policy);
        results.initialized++;
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        userId: user._id,
        name: user.name,
        error: error.message
      });
    }
  }

  res.json(
    new ApiResponse(200, results, 
      `Processed ${users.length} users: ${results.initialized} initialized, ${results.updated} updated, ${results.failed} failed`)
  );
});

// @desc    Get balances for department
// @route   GET /api/leave-balance/department/:dept
// @access  Private (HOD, Admin)
export const getDepartmentBalances = asyncHandler(async (req, res) => {
  const { dept } = req.params;

  // HOD can only access their department
  if (req.user.role === 'hod' && dept !== req.user.department) {
    throw new ApiError(403, 'Not authorized to view other department balances');
  }

  // Find users from department
  const users = await User.find({ department: dept }).select('_id');
  const userIds = users.map(u => u._id);

  const balances = await LeaveBalance.find({ userId: { $in: userIds } })
    .populate('userId', 'name email rollNumber employeeId role')
    .sort({ 'userId.name': 1 });

  res.json(
    new ApiResponse(200, balances, `${dept} department balances fetched successfully`)
  );
});

// @desc    Get low balance users (Alert system)
// @route   GET /api/leave-balance/low-balance
// @access  Private (Admin, HOD)
export const getLowBalanceUsers = asyncHandler(async (req, res) => {
  const { threshold = 2 } = req.query;

  let query = {};
  
  // HOD can only see their department
  if (req.user.role === 'hod') {
    const users = await User.find({ department: req.user.department }).select('_id');
    const userIds = users.map(u => u._id);
    query.userId = { $in: userIds };
  }

  // Find users with low balance in any leave type
  const balances = await LeaveBalance.find(query)
    .populate('userId', 'name email rollNumber employeeId department role');

  // Filter users with balance below threshold
  const lowBalanceUsers = balances.filter(balance => {
    return balance.casualLeave.remaining < threshold ||
           balance.sickLeave.remaining < threshold ||
           balance.earnedLeave.remaining < threshold ||
           balance.emergencyLeave.remaining < threshold ||
           balance.medicalLeave.remaining < threshold;
  });

  res.json(
    new ApiResponse(200, {
      threshold,
      count: lowBalanceUsers.length,
      users: lowBalanceUsers
    }, `Found ${lowBalanceUsers.length} users with low leave balance`)
  );
});

// @desc    Reset balance to policy defaults
// @route   PUT /api/leave-balance/:userId/reset
// @access  Private (Admin only)
export const resetBalance = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const balance = await LeaveBalance.findOne({ userId });
  if (!balance) {
    throw new ApiError(404, 'Leave balance not found');
  }

  const policy = await LeavePolicy.getActivePolicy(user.role, user.department);
  if (!policy) {
    throw new ApiError(404, 'No active policy found for this user');
  }

  await balance.resetForNewYear(policy);

  const resetBalance = await LeaveBalance.findById(balance._id)
    .populate('userId', 'name email rollNumber employeeId');

  res.json(new ApiResponse(200, resetBalance, 'Leave balance reset successfully'));
});

// @desc    Get balance summary (statistics)
// @route   GET /api/leave-balance/summary
// @access  Private (Admin, HOD)
export const getBalanceSummary = asyncHandler(async (req, res) => {
  const { department } = req.query;

  let userQuery = {};
  
  // HOD can only see their department
  if (req.user.role === 'hod') {
    userQuery.department = req.user.department;
  } else if (department) {
    userQuery.department = department;
  }

  const users = await User.find(userQuery).select('_id');
  const userIds = users.map(u => u._id);

  const balances = await LeaveBalance.find({ userId: { $in: userIds } });

  const summary = {
    totalUsers: balances.length,
    casualLeave: {
      total: balances.reduce((sum, b) => sum + b.casualLeave.total, 0),
      used: balances.reduce((sum, b) => sum + b.casualLeave.used, 0),
      remaining: balances.reduce((sum, b) => sum + b.casualLeave.remaining, 0)
    },
    sickLeave: {
      total: balances.reduce((sum, b) => sum + b.sickLeave.total, 0),
      used: balances.reduce((sum, b) => sum + b.sickLeave.used, 0),
      remaining: balances.reduce((sum, b) => sum + b.sickLeave.remaining, 0)
    },
    earnedLeave: {
      total: balances.reduce((sum, b) => sum + b.earnedLeave.total, 0),
      used: balances.reduce((sum, b) => sum + b.earnedLeave.used, 0),
      remaining: balances.reduce((sum, b) => sum + b.earnedLeave.remaining, 0)
    },
    emergencyLeave: {
      total: balances.reduce((sum, b) => sum + b.emergencyLeave.total, 0),
      used: balances.reduce((sum, b) => sum + b.emergencyLeave.used, 0),
      remaining: balances.reduce((sum, b) => sum + b.emergencyLeave.remaining, 0)
    },
    medicalLeave: {
      total: balances.reduce((sum, b) => sum + b.medicalLeave.total, 0),
      used: balances.reduce((sum, b) => sum + b.medicalLeave.used, 0),
      remaining: balances.reduce((sum, b) => sum + b.medicalLeave.remaining, 0)
    }
  };

  res.json(new ApiResponse(200, summary, 'Balance summary fetched successfully'));
});
