import express from "express";
import { 
  getMarks, 
  getMarksById, 
  createMarks, 
  updateMarks, 
  deleteMarks,
  getMarksByStudent,
  getMarksBySubject
} from "../controllers/marksController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getMarks).post(protect, createMarks);
router.route("/:id").get(protect, getMarksById).put(protect, updateMarks).delete(protect, deleteMarks);
router.route("/student/:studentId").get(protect, getMarksByStudent);
router.route("/subject/:subjectId").get(protect, getMarksBySubject);

export default router;