import Notice from "../models/Notice.js";
import { emitUpdate } from "../socket/socketServer.js";

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get notice by ID
// @route   GET /api/notices/:id
// @access  Private
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
      res.json(notice);
    } else {
      res.status(404);
      throw new Error("Notice not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private
const createNotice = async (req, res) => {
  try {
    const { title, content, department, createdBy, priority } = req.body;

    const notice = await Notice.create({
      title,
      content,
      department,
      createdBy,
      priority
    });

    // Emit real-time update
    emitUpdate('notice-created', notice);

    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private
const updateNotice = async (req, res) => {
  try {
    const { title, content, department, createdBy, priority } = req.body;

    const notice = await Notice.findById(req.params.id);

    if (notice) {
      notice.title = title || notice.title;
      notice.content = content || notice.content;
      notice.department = department || notice.department;
      notice.createdBy = createdBy || notice.createdBy;
      notice.priority = priority || notice.priority;

      const updatedNotice = await notice.save();
      
      // Emit real-time update
      emitUpdate('notice-updated', updatedNotice);
      
      res.json(updatedNotice);
    } else {
      res.status(404);
      throw new Error("Notice not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (notice) {
      const noticeId = notice._id;
      await notice.deleteOne();
      
      // Emit real-time update
      emitUpdate('notice-deleted', { id: noticeId });
      
      res.json({ message: "Notice removed" });
    } else {
      res.status(404);
      throw new Error("Notice not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get notices by department
// @route   GET /api/notices/department/:department
// @access  Private
const getNoticesByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const notices = await Notice.find({ department: { $in: [department, 'All'] } }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { 
  getNotices, 
  getNoticeById, 
  createNotice, 
  updateNotice, 
  deleteNotice,
  getNoticesByDepartment
};