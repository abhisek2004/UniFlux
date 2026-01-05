import express from "express";
import { 
  getStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} from "../controllers/studentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getStudents).post(protect, createStudent);
router.route("/:id").get(protect, getStudentById).put(protect, updateStudent).delete(protect, deleteStudent);

export default router;