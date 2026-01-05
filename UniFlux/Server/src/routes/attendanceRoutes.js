import express from "express";
import { 
  getAttendanceRecords, 
  getAttendanceById, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance,
  getAttendanceByStudent,
  getAttendanceBySubject
} from "../controllers/attendanceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAttendanceRecords).post(protect, createAttendance);
router.route("/:id").get(protect, getAttendanceById).put(protect, updateAttendance).delete(protect, deleteAttendance);
router.route("/student/:studentId").get(protect, getAttendanceByStudent);
router.route("/subject/:subjectId").get(protect, getAttendanceBySubject);

export default router;