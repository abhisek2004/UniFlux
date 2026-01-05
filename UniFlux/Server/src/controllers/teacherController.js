import Teacher from "../models/Teacher.js";
import { emitUpdate } from "../socket/socketServer.js";

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({});
    res.json(teachers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404);
      throw new Error("Teacher not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a teacher
// @route   POST /api/teachers
// @access  Private
const createTeacher = async (req, res) => {
  try {
    const { name, email, department, subjects } = req.body;

    const teacherExists = await Teacher.findOne({ email });

    if (teacherExists) {
      res.status(400);
      throw new Error("Teacher with this email already exists");
    }

    const teacher = await Teacher.create({
      name,
      email,
      department,
      subjects: subjects || []
    });

    // Emit real-time update
    emitUpdate('teacher-created', teacher);

    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a teacher
// @route   PUT /api/teachers/:id
// @access  Private
const updateTeacher = async (req, res) => {
  try {
    const { name, email, department, subjects } = req.body;

    const teacher = await Teacher.findById(req.params.id);

    if (teacher) {
      teacher.name = name || teacher.name;
      teacher.email = email || teacher.email;
      teacher.department = department || teacher.department;
      teacher.subjects = subjects || teacher.subjects;

      const updatedTeacher = await teacher.save();
      
      // Emit real-time update
      emitUpdate('teacher-updated', updatedTeacher);
      
      res.json(updatedTeacher);
    } else {
      res.status(404);
      throw new Error("Teacher not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a teacher
// @route   DELETE /api/teachers/:id
// @access  Private
const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);

    if (teacher) {
      const teacherId = teacher._id;
      await teacher.deleteOne();
      
      // Emit real-time update
      emitUpdate('teacher-deleted', { id: teacherId });
      
      res.json({ message: "Teacher removed" });
    } else {
      res.status(404);
      throw new Error("Teacher not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getTeachers, getTeacherById, createTeacher, updateTeacher, deleteTeacher };