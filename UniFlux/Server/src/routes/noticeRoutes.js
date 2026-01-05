import express from "express";
import { 
  getNotices, 
  getNoticeById, 
  createNotice, 
  updateNotice, 
  deleteNotice,
  getNoticesByDepartment
} from "../controllers/noticeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getNotices).post(protect, createNotice);
router.route("/:id").get(protect, getNoticeById).put(protect, updateNotice).delete(protect, deleteNotice);
router.route("/department/:department").get(protect, getNoticesByDepartment);

export default router;