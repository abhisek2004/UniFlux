import express from 'express';
import {
  getAllPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
  getPolicyForUser,
  getMyPolicy,
  createDefaultPolicy,
  initializeBalances,
  deactivatePolicy,
  activatePolicy
} from '../controllers/leavePolicy.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (any authenticated user)
router.get('/my-policy', getMyPolicy);
router.get('/user/:userId', getPolicyForUser);

// HOD/Admin routes
router.get('/', authorize('hod', 'superadmin'), getAllPolicies);
router.get('/:id', authorize('hod', 'superadmin'), getPolicyById);

// Admin only routes
router.post('/', authorize('superadmin'), createPolicy);
router.put('/:id', authorize('superadmin'), updatePolicy);
router.delete('/:id', authorize('superadmin'), deletePolicy);
router.post('/create-default', authorize('superadmin'), createDefaultPolicy);
router.post('/:id/initialize-balances', authorize('superadmin'), initializeBalances);
router.put('/:id/deactivate', authorize('superadmin'), deactivatePolicy);
router.put('/:id/activate', authorize('superadmin'), activatePolicy);

export default router;
