import Marks from "../models/Marks.js";
import { emitUpdate } from "../socket/socketServer.js";

// @desc    Get all marks
// @route   GET /api/marks
// @access  Private
const getMarks = async (req, res) => {
  try {
    const marks = await Marks.find({}).populate('studentId', 'name rollNumber email').populate('subjectId', 'name code');
    res.json(marks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get marks by ID
// @route   GET /api/marks/:id
// @access  Private
const getMarksById = async (req, res) => {
  try {
    const marks = await Marks.findById(req.params.id).populate('studentId', 'name rollNumber email').populate('subjectId', 'name code');

    if (marks) {
      res.json(marks);
    } else {
      res.status(404);
      throw new Error("Marks record not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a marks record
// @route   POST /api/marks
// @access  Private
const createMarks = async (req, res) => {
  try {
    const { studentId, subjectId, internalMarks, externalMarks, semester } = req.body;

    // Calculate total and grade
    const totalMarks = internalMarks + externalMarks;
    let grade = 'F';
    if (totalMarks >= 90) grade = 'A+';
    else if (totalMarks >= 80) grade = 'A';
    else if (totalMarks >= 70) grade = 'B+';
    else if (totalMarks >= 60) grade = 'B';
    else if (totalMarks >= 50) grade = 'C';
    else if (totalMarks >= 40) grade = 'D';

    // Check if marks record already exists for this student and subject
    const existingRecord = await Marks.findOne({ studentId, subjectId });

    if (existingRecord) {
      // Update existing record
      existingRecord.internalMarks = internalMarks;
      existingRecord.externalMarks = externalMarks;
      existingRecord.totalMarks = totalMarks;
      existingRecord.grade = grade;
      existingRecord.semester = semester;
      
      const updatedRecord = await existingRecord.save();
      
      // Emit real-time update
      emitUpdate('marks-updated', updatedRecord);
      
      res.json(updatedRecord);
      return;
    }

    const marks = await Marks.create({
      studentId,
      subjectId,
      internalMarks,
      externalMarks,
      totalMarks,
      grade,
      semester
    });

    // Emit real-time update
    emitUpdate('marks-created', marks);

    res.status(201).json(marks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a marks record
// @route   PUT /api/marks/:id
// @access  Private
const updateMarks = async (req, res) => {
  try {
    const { studentId, subjectId, internalMarks, externalMarks, semester } = req.body;

    // Calculate total and grade
    const totalMarks = internalMarks + externalMarks;
    let grade = 'F';
    if (totalMarks >= 90) grade = 'A+';
    else if (totalMarks >= 80) grade = 'A';
    else if (totalMarks >= 70) grade = 'B+';
    else if (totalMarks >= 60) grade = 'B';
    else if (totalMarks >= 50) grade = 'C';
    else if (totalMarks >= 40) grade = 'D';

    const marks = await Marks.findById(req.params.id);

    if (marks) {
      marks.studentId = studentId || marks.studentId;
      marks.subjectId = subjectId || marks.subjectId;
      marks.internalMarks = internalMarks !== undefined ? internalMarks : marks.internalMarks;
      marks.externalMarks = externalMarks !== undefined ? externalMarks : marks.externalMarks;
      marks.totalMarks = (marks.internalMarks || 0) + (marks.externalMarks || 0);
      marks.grade = grade;
      marks.semester = semester || marks.semester;

      const updatedMarks = await marks.save();
      
      // Emit real-time update
      emitUpdate('marks-updated', updatedMarks);
      
      res.json(updatedMarks);
    } else {
      res.status(404);
      throw new Error("Marks record not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a marks record
// @route   DELETE /api/marks/:id
// @access  Private
const deleteMarks = async (req, res) => {
  try {
    const marks = await Marks.findById(req.params.id);

    if (marks) {
      const marksId = marks._id;
      await marks.deleteOne();
      
      // Emit real-time update
      emitUpdate('marks-deleted', { id: marksId });
      
      res.json({ message: "Marks record removed" });
    } else {
      res.status(404);
      throw new Error("Marks record not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get marks for a specific student
// @route   GET /api/marks/student/:studentId
// @access  Private
const getMarksByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const marks = await Marks.find({ studentId }).populate('subjectId', 'name code');
    res.json(marks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get marks for a specific subject
// @route   GET /api/marks/subject/:subjectId
// @access  Private
const getMarksBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const marks = await Marks.find({ subjectId }).populate('studentId', 'name rollNumber email');
    res.json(marks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { 
  getMarks, 
  getMarksById, 
  createMarks, 
  updateMarks, 
  deleteMarks,
  getMarksByStudent,
  getMarksBySubject
};