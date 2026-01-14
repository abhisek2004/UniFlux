import express from 'express';
import {
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherSubjects,
  getTeacherWorkload
} from '../controllers/teacher.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/teachers - Get all teachers
// POST /api/teachers - Create new teacher
router.route('/')
  .get(authorize('superadmin', 'hod'), getAllTeachers)
  .post(authorize('superadmin', 'hod'), createTeacher);

// GET /api/teachers/:id - Get single teacher
// PUT /api/teachers/:id - Update teacher
// DELETE /api/teachers/:id - Delete teacher
router.route('/:id')
  .get(authorize('superadmin', 'hod', 'teacher'), getTeacher)
  .put(authorize('superadmin', 'hod'), updateTeacher)
  .delete(authorize('superadmin'), deleteTeacher);

// GET /api/teachers/:id/subjects - Get assigned subjects
router.get('/:id/subjects', authorize('superadmin', 'hod', 'teacher'), getTeacherSubjects);

// GET /api/teachers/:id/workload - Get teacher workload
router.get('/:id/workload', authorize('superadmin', 'hod', 'teacher'), getTeacherWorkload);

export default router;
