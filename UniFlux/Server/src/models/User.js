import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['superadmin', 'hod', 'teacher', 'student'],
    required: true
  },
  department: {
    type: String,
    trim: true
  },
  rollNumber: {
    type: String,
    trim: true
  },
  semester: {
    type: Number
  },
  registrationNo: {
    type: String,
    trim: true
  },
  isDemo: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password') || this.isDemo) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.isDemo) {
    // For demo users, we'll use a simple comparison
    return candidatePassword === this.password;
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;