import Attendance from "../models/Attendance.js";
import { emitUpdate } from "../socket/socketServer.js";

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendanceRecords = async (req, res) => {
  try {
    const attendance = await Attendance.find({}).populate('studentId', 'name rollNumber email').populate('subjectId', 'name code').populate('teacherId', 'name email');
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance by ID
// @route   GET /api/attendance/:id
// @access  Private
const getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('studentId', 'name rollNumber email').populate('subjectId', 'name code').populate('teacherId', 'name email');

    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404);
      throw new Error("Attendance record not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create an attendance record
// @route   POST /api/attendance
// @access  Private
const createAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status, teacherId } = req.body;

    // Check if attendance record already exists for this student, subject, and date
    const existingRecord = await Attendance.findOne({ studentId, subjectId, date });

    if (existingRecord) {
      // Update existing record
      existingRecord.status = status;
      const updatedRecord = await existingRecord.save();
      
      // Emit real-time update
      emitUpdate('attendance-updated', updatedRecord);
      
      res.json(updatedRecord);
      return;
    }

    const attendance = await Attendance.create({
      studentId,
      subjectId,
      date,
      status,
      teacherId
    });

    // Emit real-time update
    emitUpdate('attendance-created', attendance);

    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an attendance record
// @route   PUT /api/attendance/:id
// @access  Private
const updateAttendance = async (req, res) => {
  try {
    const { studentId, subjectId, date, status, teacherId } = req.body;

    const attendance = await Attendance.findById(req.params.id);

    if (attendance) {
      attendance.studentId = studentId || attendance.studentId;
      attendance.subjectId = subjectId || attendance.subjectId;
      attendance.date = date || attendance.date;
      attendance.status = status || attendance.status;
      attendance.teacherId = teacherId || attendance.teacherId;

      const updatedAttendance = await attendance.save();
      
      // Emit real-time update
      emitUpdate('attendance-updated', updatedAttendance);
      
      res.json(updatedAttendance);
    } else {
      res.status(404);
      throw new Error("Attendance record not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an attendance record
// @route   DELETE /api/attendance/:id
// @access  Private
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (attendance) {
      const attendanceId = attendance._id;
      await attendance.deleteOne();
      
      // Emit real-time update
      emitUpdate('attendance-deleted', { id: attendanceId });
      
      res.json({ message: "Attendance record removed" });
    } else {
      res.status(404);
      throw new Error("Attendance record not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance records for a specific student
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await Attendance.find({ studentId }).populate('subjectId', 'name code').populate('teacherId', 'name email');
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get attendance records for a specific subject
// @route   GET /api/attendance/subject/:subjectId
// @access  Private
const getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const attendance = await Attendance.find({ subjectId }).populate('studentId', 'name rollNumber email').populate('teacherId', 'name email');
    res.json(attendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { 
  getAttendanceRecords, 
  getAttendanceById, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance,
  getAttendanceByStudent,
  getAttendanceBySubject
};