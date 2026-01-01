export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'hod' | 'teacher' | 'student';
  department?: string;
  rollNumber?: string;
  semester?: number;
  registrationNo?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  registrationNo: string;
  department: string;
  semester: number;
  cgpa?: number;
  avatar?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  avatar?: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: number;
  teacherId: string;
  teacherName: string;
  department: string;
  credits: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  date: string;
  status: 'present' | 'absent';
  teacherId: string;
}

export interface Marks {
  id: string;
  studentId: string;
  subjectId: string;
  internalMarks: number;
  externalMarks: number;
  totalMarks: number;
  grade: string;
  semester: number;
}

export interface Timetable {
  day: string;
  timeSlots: {
    time: string;
    subjectCode: string;
    subjectName: string;
    teacherName: string;
  }[];
}

export interface Grievance {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  response?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  department: string;
  createdBy: string;
  createdAt: string;
  priority: 'normal' | 'important' | 'urgent';
}