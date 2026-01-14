import express from "express";
import { 
  getAllStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentAttendance,
  getStudentMarks
} from "../controllers/student.controller.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Student CRUD routes
router.route("/")
  .get(protect, authorize("admin", "teacher"), getAllStudents)
  .post(protect, authorize("admin"), createStudent);

router.route("/:id")
  .get(protect, getStudent)
  .put(protect, authorize("admin", "student"), updateStudent)
  .delete(protect, authorize("admin"), deleteStudent);

// Additional student routes
router.get("/:id/attendance", protect, getStudentAttendance);
router.get("/:id/marks", protect, getStudentMarks);

export default router;