import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Teacher from '../models/Teacher.js';
import User from '../models/User.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private (SuperAdmin, HOD)
export const getAllTeachers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, department, search } = req.query;
  const { skip, limit: pageLimit } = getPagination(page, limit);

  const query = {};
  
  if (department) query.department = department;
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Teacher.countDocuments(query);
  const teachers = await Teacher.find(query)
    .skip(skip)
    .limit(pageLimit)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(
    new ApiResponse(200, {
      teachers,
      pagination: getPaginationMeta(total, page, limit)
    }, 'Teachers fetched successfully')
  );
});

// @desc    Get single teacher
// @route   GET /api/teachers/:id
// @access  Private (SuperAdmin, HOD, Teacher - own profile)
export const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id).lean();

  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  // Check access rights
  if (req.user.role === 'teacher' && req.user._id.toString() !== teacher._id.toString()) {
    throw new ApiError(403, 'Access denied');
  }

  res.status(200).json(
    new ApiResponse(200, { teacher }, 'Teacher fetched successfully')
  );
});

// @desc    Create new teacher
// @route   POST /api/teachers
// @access  Private (SuperAdmin, HOD)
export const createTeacher = asyncHandler(async (req, res) => {
  const { name, email, password, department, employeeId, qualification, specialization } = req.body;

  if (!name || !email || !password || !department || !employeeId) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  // Check for duplicate email
  const existingTeacher = await Teacher.findOne({ email });
  if (existingTeacher) {
    throw new ApiError(400, 'Teacher with this email already exists');
  }

  // Check for duplicate employee ID
  const existingEmployeeId = await Teacher.findOne({ employeeId });
  if (existingEmployeeId) {
    throw new ApiError(400, 'Teacher with this employee ID already exists');
  }

  // Create teacher
  const teacher = await Teacher.create({
    name,
    email,
    employeeId,
    department,
    qualification,
    specialization
  });

  // Create in User collection for authentication
  await User.create({
    name,
    email,
    password,
    role: 'teacher',
    department
  });

  res.status(201).json(
    new ApiResponse(201, { teacher }, 'Teacher created successfully')
  );
});

// @desc    Update teacher
// @route   PUT /api/teachers/:id
// @access  Private (SuperAdmin, HOD)
export const updateTeacher = asyncHandler(async (req, res) => {
  const { name, email, department, qualification, specialization } = req.body;

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  if (name) teacher.name = name;
  if (email) teacher.email = email;
  if (department) teacher.department = department;
  if (qualification) teacher.qualification = qualification;
  if (specialization) teacher.specialization = specialization;

  await teacher.save();

  // Update User collection
  await User.findOneAndUpdate(
    { email: teacher.email, role: 'teacher' },
    { name: teacher.name, department: teacher.department }
  );

  res.status(200).json(
    new ApiResponse(200, { teacher }, 'Teacher updated successfully')
  );
});

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (SuperAdmin only)
export const deleteTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  await teacher.deleteOne();
  await User.findOneAndDelete({ email: teacher.email, role: 'teacher' });

  res.status(200).json(
    new ApiResponse(200, null, 'Teacher deleted successfully')
  );
});

// @desc    Get assigned subjects for teacher
// @route   GET /api/teachers/:id/subjects
// @access  Private (SuperAdmin, HOD, Teacher - own)
export const getTeacherSubjects = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  const { default: Subject } = await import('../models/Subject.js');
  
  const subjects = await Subject.find({ teacherId: req.params.id }).sort({ semester: 1 });

  res.status(200).json(
    new ApiResponse(200, { subjects }, 'Teacher subjects fetched successfully')
  );
});

// @desc    Get teacher workload
// @route   GET /api/teachers/:id/workload
// @access  Private (SuperAdmin, HOD, Teacher - own)
export const getTeacherWorkload = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  const { default: Subject } = await import('../models/Subject.js');
  const { default: Timetable } = await import('../models/Timetable.js');
  
  const subjects = await Subject.find({ teacherId: req.params.id });
  const timetableEntries = await Timetable.find({ teacher: req.params.id });

  const totalSubjects = subjects.length;
  const totalClasses = timetableEntries.length;
  const totalCredits = subjects.reduce((sum, subject) => sum + (subject.credits || 0), 0);

  // Calculate classes per week
  const classesPerWeek = timetableEntries.length;
  const workloadPercentage = Math.min((classesPerWeek / 30) * 100, 100).toFixed(2); // Assuming 30 hours max

  res.status(200).json(
    new ApiResponse(200, {
      workload: {
        totalSubjects,
        totalClasses,
        totalCredits,
        classesPerWeek,
        workloadPercentage: parseFloat(workloadPercentage)
      }
    }, 'Teacher workload fetched successfully')
  );
});

export default {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherSubjects,
  getTeacherWorkload
};
