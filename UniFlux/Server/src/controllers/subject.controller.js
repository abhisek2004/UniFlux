import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Subject from '../models/Subject.js';
import { getPagination, getPaginationMeta } from '../utils/pagination.js';

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private (All authenticated users)
export const getAllSubjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, semester, department, type, search } = req.query;
  const { skip, limit: pageLimit } = getPagination(page, limit);

  const query = {};
  
  if (semester) query.semester = parseInt(semester);
  if (department) query.department = department;
  if (type) query.type = type;
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Subject.countDocuments(query);
  const subjects = await Subject.find(query)
    .skip(skip)
    .limit(pageLimit)
    .sort({ semester: 1, code: 1 })
    .lean();

  res.status(200).json(
    new ApiResponse(200, {
      subjects,
      pagination: getPaginationMeta(total, page, limit)
    }, 'Subjects fetched successfully')
  );
});

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private (All authenticated users)
export const getSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).lean();

  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  res.status(200).json(
    new ApiResponse(200, { subject }, 'Subject fetched successfully')
  );
});

// @desc    Create new subject
// @route   POST /api/subjects
// @access  Private (SuperAdmin, HOD)
export const createSubject = asyncHandler(async (req, res) => {
  const { code, name, semester, teacherId, teacherName, department, credits, type } = req.body;

  if (!code || !name || !semester || !teacherId || !department || !credits) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  // Check for duplicate subject code
  const existingSubject = await Subject.findOne({ code });
  if (existingSubject) {
    throw new ApiError(400, 'Subject with this code already exists');
  }

  // Verify teacher exists
  const { default: Teacher } = await import('../models/Teacher.js');
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  // Create subject
  const subject = await Subject.create({
    code,
    name,
    semester,
    teacherId,
    teacherName: teacherName || teacher.name,
    department,
    credits,
    type: type || 'theory'
  });

  res.status(201).json(
    new ApiResponse(201, { subject }, 'Subject created successfully')
  );
});

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (SuperAdmin, HOD)
export const updateSubject = asyncHandler(async (req, res) => {
  const { name, semester, teacherId, teacherName, department, credits, type } = req.body;

  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  // If teacher is being changed, verify new teacher exists
  if (teacherId && teacherId !== subject.teacherId) {
    const { default: Teacher } = await import('../models/Teacher.js');
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      throw new ApiError(404, 'New teacher not found');
    }
    subject.teacherId = teacherId;
    subject.teacherName = teacherName || teacher.name;
  }

  if (name) subject.name = name;
  if (semester) subject.semester = semester;
  if (department) subject.department = department;
  if (credits) subject.credits = credits;
  if (type) subject.type = type;

  await subject.save();

  res.status(200).json(
    new ApiResponse(200, { subject }, 'Subject updated successfully')
  );
});

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (SuperAdmin only)
export const deleteSubject = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  // Check if subject has associated marks or attendance records
  const { default: Marks } = await import('../models/Marks.js');
  const { default: Attendance } = await import('../models/Attendance.js');
  
  const marksCount = await Marks.countDocuments({ subjectId: req.params.id });
  const attendanceCount = await Attendance.countDocuments({ subjectId: req.params.id });

  if (marksCount > 0 || attendanceCount > 0) {
    throw new ApiError(400, 'Cannot delete subject with existing marks or attendance records. Consider deactivating instead.');
  }

  await subject.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Subject deleted successfully')
  );
});

// @desc    Get enrolled students for subject
// @route   GET /api/subjects/:id/students
// @access  Private (SuperAdmin, HOD, Teacher - assigned)
export const getSubjectStudents = asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  // Find all students in same semester and department
  const { default: Student } = await import('../models/Student.js');
  const students = await Student.find({
    semester: subject.semester,
    department: subject.department
  }).sort({ rollNumber: 1 });

  res.status(200).json(
    new ApiResponse(200, {
      students,
      total: students.length
    }, 'Enrolled students fetched successfully')
  );
});

// @desc    Assign/Reassign teacher to subject
// @route   POST /api/subjects/:id/assign-teacher
// @access  Private (SuperAdmin, HOD)
export const assignTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.body;

  if (!teacherId) {
    throw new ApiError(400, 'Teacher ID is required');
  }

  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new ApiError(404, 'Subject not found');
  }

  // Verify teacher exists
  const { default: Teacher } = await import('../models/Teacher.js');
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    throw new ApiError(404, 'Teacher not found');
  }

  // Check teacher workload (optional - you can add more sophisticated logic)
  const teacherSubjects = await Subject.countDocuments({ teacherId });
  if (teacherSubjects >= 6) {
    throw new ApiError(400, 'Teacher already has maximum workload (6 subjects)');
  }

  subject.teacherId = teacherId;
  subject.teacherName = teacher.name;
  await subject.save();

  res.status(200).json(
    new ApiResponse(200, { subject }, 'Teacher assigned successfully')
  );
});

export default {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStudents,
  assignTeacher
};
