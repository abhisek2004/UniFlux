import Grievance from "../models/Grievance.js";
import { emitUpdate } from "../socket/socketServer.js";

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Private
const getGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({}).populate('studentId', 'name rollNumber email');
    res.json(grievances);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get grievance by ID
// @route   GET /api/grievances/:id
// @access  Private
const getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id).populate('studentId', 'name rollNumber email');

    if (grievance) {
      res.json(grievance);
    } else {
      res.status(404);
      throw new Error("Grievance not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a grievance
// @route   POST /api/grievances
// @access  Private
const createGrievance = async (req, res) => {
  try {
    const { studentId, title, description, priority } = req.body;

    const grievance = await Grievance.create({
      studentId,
      title,
      description,
      priority,
      status: 'pending'
    });

    // Emit real-time update
    emitUpdate('grievance-created', grievance);

    res.status(201).json(grievance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a grievance
// @route   PUT /api/grievances/:id
// @access  Private
const updateGrievance = async (req, res) => {
  try {
    const { title, description, status, priority, resolvedAt, response } = req.body;

    const grievance = await Grievance.findById(req.params.id);

    if (grievance) {
      grievance.title = title || grievance.title;
      grievance.description = description || grievance.description;
      grievance.status = status || grievance.status;
      grievance.priority = priority || grievance.priority;
      grievance.resolvedAt = resolvedAt || grievance.resolvedAt;
      grievance.response = response || grievance.response;

      const updatedGrievance = await grievance.save();
      
      // Emit real-time update
      emitUpdate('grievance-updated', updatedGrievance);
      
      res.json(updatedGrievance);
    } else {
      res.status(404);
      throw new Error("Grievance not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a grievance
// @route   DELETE /api/grievances/:id
// @access  Private
const deleteGrievance = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);

    if (grievance) {
      const grievanceId = grievance._id;
      await grievance.deleteOne();
      
      // Emit real-time update
      emitUpdate('grievance-deleted', { id: grievanceId });
      
      res.json({ message: "Grievance removed" });
    } else {
      res.status(404);
      throw new Error("Grievance not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get grievances by student ID
// @route   GET /api/grievances/student/:studentId
// @access  Private
const getGrievancesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const grievances = await Grievance.find({ studentId });
    res.json(grievances);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { 
  getGrievances, 
  getGrievanceById, 
  createGrievance, 
  updateGrievance, 
  deleteGrievance,
  getGrievancesByStudent
};