import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && await user.comparePassword(password)) {
      res.json({
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        semester: user.semester,
        registrationNo: user.registrationNo,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department, rollNumber, semester, registrationNo } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      department,
      rollNumber,
      semester,
      registrationNo,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        semester: user.semester,
        registrationNo: user.registrationNo,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        rollNumber: user.rollNumber,
        semester: user.semester,
        registrationNo: user.registrationNo,
        avatar: user.avatar,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.department = req.body.department || user.department;
      user.rollNumber = req.body.rollNumber || user.rollNumber;
      user.semester = req.body.semester || user.semester;
      user.registrationNo = req.body.registrationNo || user.registrationNo;
      user.avatar = req.body.avatar || user.avatar;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        rollNumber: updatedUser.rollNumber,
        semester: updatedUser.semester,
        registrationNo: updatedUser.registrationNo,
        avatar: updatedUser.avatar,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Super Admin login with fixed password
// @route   POST /api/auth/superadmin-login
// @access  Public
const superAdminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Check if the password matches the super admin password
    // In a real application, this should be stored securely in environment variables
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'admin123';
    
    if (password === SUPER_ADMIN_PASSWORD) {
      // Create a mock super admin user object
      const superAdminUser = {
        _id: 'superadmin',
        id: 'superadmin',
        name: 'Super Admin',
        email: 'superadmin@campuscore.in',
        role: 'superadmin',
        avatar: null,
        token: generateToken('superadmin'),
      };
      
      res.json(superAdminUser);
    } else {
      res.status(401);
      throw new Error('Invalid super admin credentials');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { authUser, registerUser, getUserProfile, updateUserProfile, superAdminLogin };