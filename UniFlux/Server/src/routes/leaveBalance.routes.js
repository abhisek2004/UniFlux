import express from 'express';
import {
  getUserBalance,
  getMyBalance,
  updateUserBalance,
  initializeBalances,
  getDepartmentBalances,
  getLowBalanceUsers,
  resetBalance,
  getBalanceSummary
} from '../controllers/leaveBalance.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (any authenticated user)
router.get('/my-balance', getMyBalance);

// HOD/Admin routes
router.get('/department/:dept', authorize('hod', 'superadmin'), getDepartmentBalances);
router.get('/low-balance', authorize('hod', 'superadmin'), getLowBalanceUsers);
router.get('/summary', authorize('hod', 'superadmin'), getBalanceSummary);
router.get('/:userId', authorize('hod', 'superadmin'), getUserBalance);

// Admin only routes
router.put('/:userId', authorize('superadmin'), updateUserBalance);
router.post('/initialize', authorize('superadmin'), initializeBalances);
router.put('/:userId/reset', authorize('superadmin'), resetBalance);

export default router;
