import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import marksRoutes from "./routes/marksRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/marks", marksRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/notices", noticeRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running 🚀" });
});

// Error handler (must be last middleware)
app.use(errorHandler);

export default app;
