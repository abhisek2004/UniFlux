import express from 'express';
import {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStudents,
  assignTeacher
} from '../controllers/subject.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET /api/subjects - Get all subjects (accessible to all authenticated users)
// POST /api/subjects - Create new subject
router.route('/')
  .get(getAllSubjects)
  .post(authorize('superadmin', 'hod'), createSubject);

// GET /api/subjects/:id - Get single subject
// PUT /api/subjects/:id - Update subject
// DELETE /api/subjects/:id - Delete subject
router.route('/:id')
  .get(getSubject)
  .put(authorize('superadmin', 'hod'), updateSubject)
  .delete(authorize('superadmin'), deleteSubject);

// GET /api/subjects/:id/students - Get enrolled students
router.get('/:id/students', authorize('superadmin', 'hod', 'teacher'), getSubjectStudents);

// POST /api/subjects/:id/assign-teacher - Assign/Reassign teacher
router.post('/:id/assign-teacher', authorize('superadmin', 'hod'), assignTeacher);

export default router;
