import express from 'express';
import {
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  getStudentMarks
} from '../controllers/student.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/students - Get all students
// POST /api/students - Create new student
router.route('/')
  .get(authorize('superadmin', 'hod', 'teacher'), getAllStudents)
  .post(authorize('superadmin', 'hod'), createStudent);

// GET /api/students/:id - Get single student
// PUT /api/students/:id - Update student
// DELETE /api/students/:id - Delete student
router.route('/:id')
  .get(authorize('superadmin', 'hod', 'teacher', 'student'), getStudent)
  .put(authorize('superadmin', 'hod'), updateStudent)
  .delete(authorize('superadmin'), deleteStudent);

// GET /api/students/:id/attendance - Get student attendance
router.get('/:id/attendance', authorize('superadmin', 'hod', 'teacher', 'student'), getStudentAttendance);

// GET /api/students/:id/marks - Get student marks
router.get('/:id/marks', authorize('superadmin', 'hod', 'teacher', 'student'), getStudentMarks);

export default router;
