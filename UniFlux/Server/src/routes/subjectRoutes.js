import express from "express";
import { 
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStudents,
  assignTeacher
} from "../controllers/subject.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Subject CRUD routes
router.route("/")
  .get(protect, getAllSubjects)
  .post(protect, authorize("admin"), createSubject);

router.route("/:id")
  .get(protect, getSubject)
  .put(protect, authorize("admin"), updateSubject)
  .delete(protect, authorize("admin"), deleteSubject);

// Additional subject routes
router.get("/:id/students", protect, getSubjectStudents);
router.put("/:id/assign-teacher", protect, authorize("admin"), assignTeacher);

export default router;