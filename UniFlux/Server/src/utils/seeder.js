import mongoose from "mongoose";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Subject from "../models/Subject.js";
import Attendance from "../models/Attendance.js";
import Marks from "../models/Marks.js";
import Grievance from "../models/Grievance.js";
import Notice from "../models/Notice.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await User.deleteMany();
    await Student.deleteMany();
    await Teacher.deleteMany();
    await Subject.deleteMany();
    await Attendance.deleteMany();
    await Marks.deleteMany();
    await Grievance.deleteMany();
    await Notice.deleteMany();

    // Create demo users
    const demoUsers = [
      {
        name: 'Super Admin',
        email: 'superadmin@campuscore.in',
        password: 'admin123', // Plain text for demo
        role: 'superadmin',
        isDemo: true
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'hod.cse@campuscore.in',
        password: 'hod123', // Plain text for demo
        role: 'hod',
        department: 'CSE',
        isDemo: true
      },
      {
        name: 'Rahul Mehra',
        email: 'rahul@campuscore.in',
        password: 'teacher123', // Plain text for demo
        role: 'teacher',
        department: 'CSE',
        isDemo: true
      },
      {
        name: 'Amit Das',
        email: 'amit@campuscore.in',
        password: 'student123', // Plain text for demo
        role: 'student',
        department: 'CSE',
        rollNumber: '22CS101',
        semester: 5,
        registrationNo: 'REG22CS101',
        isDemo: true
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log('Demo users created');

    // Create sample students
    const sampleStudents = [
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Amit Das', 
        email: 'amit@campuscore.in', 
        rollNumber: '22CS101', 
        registrationNo: 'REG22CS101', 
        department: 'CSE', 
        semester: 5, 
        cgpa: 8.95 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Priya Rani', 
        email: 'priya@campuscore.in', 
        rollNumber: '22CS102', 
        registrationNo: 'REG22CS102', 
        department: 'CSE', 
        semester: 5, 
        cgpa: 8.65 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Rohit Kumar', 
        email: 'rohit@campuscore.in', 
        rollNumber: '22CS103', 
        registrationNo: 'REG22CS103', 
        department: 'CSE', 
        semester: 5, 
        cgpa: 7.85 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Anita Sharma', 
        email: 'anita@campuscore.in', 
        rollNumber: '22CS104', 
        registrationNo: 'REG22CS104', 
        department: 'CSE', 
        semester: 5, 
        cgpa: 9.15 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Vikram Singh', 
        email: 'vikram@campuscore.in', 
        rollNumber: '22CS105', 
        registrationNo: 'REG22CS105', 
        department: 'CSE', 
        semester: 5, 
        cgpa: 8.25 
      }
    ];

    await Student.insertMany(sampleStudents);
    console.log('Sample students created');

    // Create sample teachers
    const sampleTeachers = [
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Rahul Mehra', 
        email: 'rahul@campuscore.in', 
        department: 'CSE', 
        subjects: ['CS501'] 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Meena Rathi', 
        email: 'meena@campuscore.in', 
        department: 'CSE', 
        subjects: ['CS502'] 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Aman Raj', 
        email: 'aman@campuscore.in', 
        department: 'CSE', 
        subjects: ['CS503'] 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        name: 'Kavita Joshi', 
        email: 'kavita@campuscore.in', 
        department: 'CSE', 
        subjects: ['CS504'] 
      }
    ];

    await Teacher.insertMany(sampleTeachers);
    console.log('Sample teachers created');

    // Create sample subjects
    const sampleSubjects = [
      { 
        _id: new mongoose.Types.ObjectId(), 
        code: 'CS501', 
        name: 'Operating Systems', 
        semester: 5, 
        teacherId: sampleTeachers[0]._id.toString(), 
        teacherName: 'Rahul Mehra', 
        department: 'CSE', 
        credits: 4 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        code: 'CS502', 
        name: 'Database Management Systems', 
        semester: 5, 
        teacherId: sampleTeachers[1]._id.toString(), 
        teacherName: 'Meena Rathi', 
        department: 'CSE', 
        credits: 4 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        code: 'CS503', 
        name: 'Computer Networks', 
        semester: 5, 
        teacherId: sampleTeachers[2]._id.toString(), 
        teacherName: 'Aman Raj', 
        department: 'CSE', 
        credits: 4 
      },
      { 
        _id: new mongoose.Types.ObjectId(), 
        code: 'CS504', 
        name: 'Software Engineering', 
        semester: 5, 
        teacherId: sampleTeachers[3]._id.toString(), 
        teacherName: 'Kavita Joshi', 
        department: 'CSE', 
        credits: 3 
      }
    ];

    await Subject.insertMany(sampleSubjects);
    console.log('Sample subjects created');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();