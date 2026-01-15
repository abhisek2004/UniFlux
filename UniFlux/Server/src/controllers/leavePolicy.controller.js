import LeavePolicy from '../models/LeavePolicy.js';
import LeaveBalance from '../models/LeaveBalance.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import { getPagination } from '../utils/pagination.js';

// @desc    Get all leave policies
// @route   GET /api/leave-policies
// @access  Private (Admin, HOD)
export const getAllPolicies = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
  const { userType, department, academicYear, isActive } = req.query;

  const query = {};
  if (userType) query.userType = userType;
  if (department) query.department = department;
  if (academicYear) query.academicYear = academicYear;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  // HOD can only see their department policies
  if (req.user.role === 'hod') {
    query.department = req.user.department;
  }

  const [policies, total] = await Promise.all([
    LeavePolicy.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    LeavePolicy.countDocuments(query)
  ]);

  res.json(
    new ApiResponse(200, {
      policies,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    }, 'Leave policies fetched successfully')
  );
});

// @desc    Get single policy
// @route   GET /api/leave-policies/:id
// @access  Private
export const getPolicyById = asyncHandler(async (req, res) => {
  const policy = await LeavePolicy.findById(req.params.id)
    .populate('createdBy', 'name email');

  if (!policy) {
    throw new ApiError(404, 'Leave policy not found');
  }

  res.json(new ApiResponse(200, policy, 'Leave policy fetched successfully'));
});

// @desc    Create new leave policy
// @route   POST /api/leave-policies
// @access  Private (Admin only)
export const createPolicy = asyncHandler(async (req, res) => {
  const { userType, department, academicYear, policies, generalRules } = req.body;

  // Check if active policy already exists
  const existingPolicy = await LeavePolicy.findOne({
    userType,
    department,
    academicYear,
    isActive: true
  });

  if (existingPolicy) {
    throw new ApiError(400, 'Active policy already exists for this combination. Please deactivate it first.');
  }

  const policy = await LeavePolicy.create({
    userType,
    department,
    academicYear,
    policies,
    generalRules,
    createdBy: req.user._id,
    isActive: true
  });

  const createdPolicy = await LeavePolicy.findById(policy._id)
    .populate('createdBy', 'name email');

  res.status(201).json(
    new ApiResponse(201, createdPolicy, 'Leave policy created successfully')
  );
});

// @desc    Update leave policy
// @route   PUT /api/leave-policies/:id
// @access  Private (Admin only)
export const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await LeavePolicy.findById(req.params.id);

  if (!policy) {
    throw new ApiError(404, 'Leave policy not found');
  }

  const { policies: policyRules, generalRules, isActive } = req.body;

  if (policyRules) policy.policies = { ...policy.policies, ...policyRules };
  if (generalRules) policy.generalRules = { ...policy.generalRules, ...generalRules };
  if (isActive !== undefined) policy.isActive = isActive;

  await policy.save();

  const updatedPolicy = await LeavePolicy.findById(policy._id)
    .populate('createdBy', 'name email');

  res.json(new ApiResponse(200, updatedPolicy, 'Leave policy updated successfully'));
});

// @desc    Delete leave policy
// @route   DELETE /api/leave-policies/:id
// @access  Private (Admin only)
export const deletePolicy = asyncHandler(async (req, res) => {
  const policy = await LeavePolicy.findById(req.params.id);

  if (!policy) {
    throw new ApiError(404, 'Leave policy not found');
  }

  await policy.deleteOne();

  res.json(new ApiResponse(200, null, 'Leave policy deleted successfully'));
});

// @desc    Get applicable policy for a user
// @route   GET /api/leave-policies/user/:userId
// @access  Private
export const getPolicyForUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Check access
  if (req.user.role !== 'superadmin' && req.user._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this user policy');
  }

  const policy = await LeavePolicy.getActivePolicy(user.role, user.department);

  if (!policy) {
    throw new ApiError(404, 'No active policy found for this user');
  }

  res.json(new ApiResponse(200, policy, 'User leave policy fetched successfully'));
});

// @desc    Get current user's applicable policy
// @route   GET /api/leave-policies/my-policy
// @access  Private
export const getMyPolicy = asyncHandler(async (req, res) => {
  const policy = await LeavePolicy.getActivePolicy(req.user.role, req.user.department);

  if (!policy) {
    throw new ApiError(404, 'No active policy found for you');
  }

  res.json(new ApiResponse(200, policy, 'Your leave policy fetched successfully'));
});

// @desc    Create default policy for department
// @route   POST /api/leave-policies/create-default
// @access  Private (Admin only)
export const createDefaultPolicy = asyncHandler(async (req, res) => {
  const { userType, department } = req.body;

  if (!userType || !department) {
    throw new ApiError(400, 'userType and department are required');
  }

  // Check if policy already exists
  const existingPolicy = await LeavePolicy.findOne({
    userType,
    department,
    isActive: true
  });

  if (existingPolicy) {
    throw new ApiError(400, 'Active policy already exists for this combination');
  }

  const policy = await LeavePolicy.createDefaultPolicy(userType, department, req.user._id);

  res.status(201).json(
    new ApiResponse(201, policy, 'Default leave policy created successfully')
  );
});

// @desc    Initialize leave balances for all users based on policy
// @route   POST /api/leave-policies/:id/initialize-balances
// @access  Private (Admin only)
export const initializeBalances = asyncHandler(async (req, res) => {
  const policy = await LeavePolicy.findById(req.params.id);

  if (!policy) {
    throw new ApiError(404, 'Leave policy not found');
  }

  // Find all users matching the policy criteria
  const users = await User.find({
    role: policy.userType,
    department: policy.department
  });

  if (users.length === 0) {
    throw new ApiError(404, 'No users found matching the policy criteria');
  }

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  // Initialize balance for each user
  for (const user of users) {
    try {
      // Check if balance already exists
      const existingBalance = await LeaveBalance.findOne({ userId: user._id });
      
      if (existingBalance) {
        // Update existing balance
        await existingBalance.resetForNewYear(policy);
        results.success++;
      } else {
        // Create new balance
        await LeaveBalance.initializeBalance(user._id, user.role, policy);
        results.success++;
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
    new ApiResponse(200, results, `Initialized balances for ${results.success} users`)
  );
});

// @desc    Deactivate policy
// @route   PUT /api/leave-policies/:id/deactivate
// @access  Private (Admin only)
export const deactivatePolicy = asyncHandler(async (req, res) => {
  const policy = await LeavePolicy.findById(req.params.id);

  if (!policy) {
    throw new ApiError(404, 'Leave policy not found');
  }

  policy.isActive = false;
  await policy.save();

  res.json(new ApiResponse(200, policy, 'Leave policy deactivated successfully'));
});

// @desc    Activate policy
// @route   PUT /api/leave-policies/:id/activate
// @access  Private (Admin only)
export const activatePolicy = asyncHandler(async (req, res) => {
  const policy = await LeavePolicy.findById(req.params.id);

  if (!policy) {
    throw new ApiError(404, 'Leave policy not found');
  }

  // Check if another active policy exists for same combination
  const existingActive = await LeavePolicy.findOne({
    userType: policy.userType,
    department: policy.department,
    academicYear: policy.academicYear,
    isActive: true,
    _id: { $ne: policy._id }
  });

  if (existingActive) {
    throw new ApiError(400, 'Another active policy exists for this combination. Deactivate it first.');
  }

  policy.isActive = true;
  await policy.save();

  res.json(new ApiResponse(200, policy, 'Leave policy activated successfully'));
});
