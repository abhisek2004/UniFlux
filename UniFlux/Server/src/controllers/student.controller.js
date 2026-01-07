import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

// @desc    Get all students
// @route   GET /api/students
// @access  Private (SuperAdmin, HOD, Teacher)
export const getAllStudents = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, semester, department, course, search } = req.query;
  const { skip, limit: pageLimit } = getPagination(page, limit);

  // Build query
  const query = {};
  
  if (semester) query.semester = parseInt(semester);
  if (department) query.department = department;
  if (course) query.course = course;
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
      { registrationNo: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Student.countDocuments(query);
  const students = await Student.find(query)
    .skip(skip)
    .limit(pageLimit)
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(
    new ApiResponse(200, {
      students,
      pagination: getPaginationMeta(total, page, limit)
    }, 'Students fetched successfully')
  );
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private (SuperAdmin, HOD, Teacher, Student - own profile)
export const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id).lean();

  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Check access rights
  if (req.user.role === 'student' && req.user._id.toString() !== student._id.toString()) {
    throw new ApiError(403, 'Access denied');
  }

  res.status(200).json(
    new ApiResponse(200, { student }, 'Student fetched successfully')
  );
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private (SuperAdmin, HOD)
export const createStudent = asyncHandler(async (req, res) => {
  const { name, email, password, department, semester, rollNumber, registrationNo } = req.body;

  // Validate required fields
  if (!name || !email || !password || !department || !semester || !rollNumber || !registrationNo) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  // Check for duplicate email
  const existingStudent = await Student.findOne({ email });
  if (existingStudent) {
    throw new ApiError(400, 'Student with this email already exists');
  }

  // Check for duplicate roll number
  const existingRollNumber = await Student.findOne({ rollNumber });
  if (existingRollNumber) {
    throw new ApiError(400, 'Student with this roll number already exists');
  }

  // Check for duplicate registration number
  const existingRegNo = await Student.findOne({ registrationNo });
  if (existingRegNo) {
    throw new ApiError(400, 'Student with this registration number already exists');
  }

  // Create student
  const student = await Student.create({
    name,
    email,
    rollNumber,
    registrationNo,
    department,
    semester
  });

  // Also create in User collection for authentication
  await User.create({
    name,
    email,
    password,
    role: 'student',
    department,
    rollNumber,
    semester,
    registrationNo
  });

  res.status(201).json(
    new ApiResponse(201, { student }, 'Student created successfully')
  );
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private (SuperAdmin, HOD)
export const updateStudent = asyncHandler(async (req, res) => {
  const { name, email, department, semester, cgpa } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Update fields if provided
  if (name) student.name = name;
  if (email) student.email = email;
  if (department) student.department = department;
  if (semester) student.semester = semester;
  if (cgpa !== undefined) student.cgpa = cgpa;

  await student.save();

  // Update User collection as well
  await User.findOneAndUpdate(
    { email: student.email, role: 'student' },
    { name: student.name, department: student.department, semester: student.semester }
  );

  res.status(200).json(
    new ApiResponse(200, { student }, 'Student updated successfully')
  );
});

// @desc    Delete student (soft delete)
// @route   DELETE /api/students/:id
// @access  Private (SuperAdmin only)
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Soft delete - could implement isActive field
  await student.deleteOne();

  // Also delete from User collection
  await User.findOneAndDelete({ email: student.email, role: 'student' });

  res.status(200).json(
    new ApiResponse(200, null, 'Student deleted successfully')
  );
});

// @desc    Get student attendance
// @route   GET /api/students/:id/attendance
// @access  Private (SuperAdmin, HOD, Teacher, Student - own)
export const getStudentAttendance = asyncHandler(async (req, res) => {
  const { subjectId, startDate, endDate } = req.query;
  
  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  // Import Attendance model dynamically to avoid circular dependency
  const { default: Attendance } = await import('../models/Attendance.js');

  const query = { studentId: req.params.id };
  if (subjectId) query.subjectId = subjectId;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  const attendanceRecords = await Attendance.find(query).sort({ date: -1 });

  // Calculate percentage
  const totalClasses = attendanceRecords.length;
  const presentClasses = attendanceRecords.filter(record => record.status === 'present').length;
  const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

  res.status(200).json(
    new ApiResponse(200, {
      attendance: attendanceRecords,
      summary: {
        total: totalClasses,
        present: presentClasses,
        absent: totalClasses - presentClasses,
        percentage
      }
    }, 'Attendance fetched successfully')
  );
});

// @desc    Get student marks
// @route   GET /api/students/:id/marks
// @access  Private (SuperAdmin, HOD, Teacher, Student - own)
export const getStudentMarks = asyncHandler(async (req, res) => {
  const { semester } = req.query;
  
  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new ApiError(404, 'Student not found');
  }

  const { default: Marks } = await import('../models/Marks.js');

  const query = { studentId: req.params.id };
  if (semester) query.semester = parseInt(semester);

  const marks = await Marks.find(query).sort({ semester: 1 });

  res.status(200).json(
    new ApiResponse(200, { marks }, 'Marks fetched successfully')
  );
});

export default {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  getStudentMarks
};
