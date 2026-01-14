import express from "express";
import { 
  getAllTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  getTeacherSubjects,
  getTeacherWorkload
} from "../controllers/teacher.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Teacher CRUD routes
router.route("/")
  .get(protect, authorize("admin", "teacher"), getAllTeachers)
  .post(protect, authorize("admin"), createTeacher);

router.route("/:id")
  .get(protect, getTeacher)
  .put(protect, authorize("admin", "teacher"), updateTeacher)
  .delete(protect, authorize("admin"), deleteTeacher);

// Additional teacher routes
router.get("/:id/subjects", protect, getTeacherSubjects);
router.get("/:id/workload", protect, authorize("admin", "teacher"), getTeacherWorkload);

export default router;