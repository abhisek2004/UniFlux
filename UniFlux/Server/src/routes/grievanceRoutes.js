import express from "express";
import { 
  getGrievances, 
  getGrievanceById, 
  createGrievance, 
  updateGrievance, 
  deleteGrievance,
  getGrievancesByStudent
} from "../controllers/grievanceController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getGrievances).post(protect, createGrievance);
router.route("/:id").get(protect, getGrievanceById).put(protect, updateGrievance).delete(protect, deleteGrievance);
router.route("/student/:studentId").get(protect, getGrievancesByStudent);

export default router;