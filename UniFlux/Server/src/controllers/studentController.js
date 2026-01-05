import Student from "../models/Student.js";
import { emitUpdate } from "../socket/socketServer.js";

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({});
    res.json(students);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      res.json(student);
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, registrationNo, department, semester, cgpa } = req.body;

    const studentExists = await Student.findOne({
      $or: [{ email }, { rollNumber }, { registrationNo }]
    });

    if (studentExists) {
      res.status(400);
      throw new Error("Student with this email, roll number, or registration number already exists");
    }

    const student = await Student.create({
      name,
      email,
      rollNumber,
      registrationNo,
      department,
      semester,
      cgpa
    });

    // Emit real-time update
    emitUpdate('student-created', student);

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, registrationNo, department, semester, cgpa } = req.body;

    const student = await Student.findById(req.params.id);

    if (student) {
      student.name = name || student.name;
      student.email = email || student.email;
      student.rollNumber = rollNumber || student.rollNumber;
      student.registrationNo = registrationNo || student.registrationNo;
      student.department = department || student.department;
      student.semester = semester || student.semester;
      student.cgpa = cgpa || student.cgpa;

      const updatedStudent = await student.save();
      
      // Emit real-time update
      emitUpdate('student-updated', updatedStudent);
      
      res.json(updatedStudent);
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      const studentId = student._id;
      await student.deleteOne();
      
      // Emit real-time update
      emitUpdate('student-deleted', { id: studentId });
      
      res.json({ message: "Student removed" });
    } else {
      res.status(404);
      throw new Error("Student not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getStudents, getStudentById, createStudent, updateStudent, deleteStudent };