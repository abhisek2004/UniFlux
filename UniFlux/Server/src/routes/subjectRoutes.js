import express from "express";
import { 
  getSubjects, 
  getSubjectById, 
  createSubject, 
  updateSubject, 
  deleteSubject 
} from "../controllers/subjectController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getSubjects).post(protect, createSubject);
router.route("/:id").get(protect, getSubjectById).put(protect, updateSubject).delete(protect, deleteSubject);

export default router;