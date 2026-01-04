import Subject from "../models/Subject.js";
import { emitUpdate } from "../socket/socketServer.js";

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Private
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (subject) {
      res.json(subject);
    } else {
      res.status(404);
      throw new Error("Subject not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a subject
// @route   POST /api/subjects
// @access  Private
const createSubject = async (req, res) => {
  try {
    const { code, name, semester, teacherId, teacherName, department, credits } = req.body;

    const subjectExists = await Subject.findOne({ code });

    if (subjectExists) {
      res.status(400);
      throw new Error("Subject with this code already exists");
    }

    const subject = await Subject.create({
      code,
      name,
      semester,
      teacherId,
      teacherName,
      department,
      credits
    });

    // Emit real-time update
    emitUpdate('subject-created', subject);

    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a subject
// @route   PUT /api/subjects/:id
// @access  Private
const updateSubject = async (req, res) => {
  try {
    const { code, name, semester, teacherId, teacherName, department, credits } = req.body;

    const subject = await Subject.findById(req.params.id);

    if (subject) {
      subject.code = code || subject.code;
      subject.name = name || subject.name;
      subject.semester = semester || subject.semester;
      subject.teacherId = teacherId || subject.teacherId;
      subject.teacherName = teacherName || subject.teacherName;
      subject.department = department || subject.department;
      subject.credits = credits || subject.credits;

      const updatedSubject = await subject.save();
      
      // Emit real-time update
      emitUpdate('subject-updated', updatedSubject);
      
      res.json(updatedSubject);
    } else {
      res.status(404);
      throw new Error("Subject not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a subject
// @route   DELETE /api/subjects/:id
// @access  Private
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (subject) {
      const subjectId = subject._id;
      await subject.deleteOne();
      
      // Emit real-time update
      emitUpdate('subject-deleted', { id: subjectId });
      
      res.json({ message: "Subject removed" });
    } else {
      res.status(404);
      throw new Error("Subject not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject };