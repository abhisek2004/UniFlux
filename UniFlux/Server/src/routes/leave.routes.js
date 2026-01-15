import express from 'express';
import {
  applyLeave,
  getAllLeaves,
  getLeaveById,
  updateLeave,
  cancelLeave,
  getMyLeaves,
  getLeaveBalance,
  getPendingLeaves,
  approveLeave,
  rejectLeave,
  getLeaveStatistics,
  getDepartmentLeaves
} from '../controllers/leave.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (require authentication only)
router.use(protect);

// Must be before /:id routes to avoid conflicts
router.get('/my-leaves', getMyLeaves);
router.get('/balance', getLeaveBalance);
router.get('/pending', authorize('hod', 'superadmin'), getPendingLeaves);
router.get('/statistics', authorize('hod', 'superadmin'), getLeaveStatistics);
router.get('/department/:dept', authorize('hod', 'superadmin'), getDepartmentLeaves);

// Admin/HOD/Teacher - Get all leaves (must be before /:id)
router.get('/', authorize('superadmin', 'hod', 'teacher'), getAllLeaves);

// Student/Teacher/Staff routes - Create and specific ID operations
router.post('/', applyLeave);
router.get('/:id', getLeaveById);
router.put('/:id', updateLeave);
router.delete('/:id', cancelLeave);

// HOD/Admin approval routes
router.put('/:id/approve', authorize('hod', 'superadmin'), approveLeave);
router.put('/:id/reject', authorize('hod', 'superadmin'), rejectLeave);

export default router;
