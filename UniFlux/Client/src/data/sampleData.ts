import { Student, Teacher, Subject, Timetable, AttendanceRecord, Marks, Grievance, Notice } from '../types';

export const sampleStudents: Student[] = [
  { id: '1', name: 'Amit Das', email: 'amit@campuscore.in', rollNumber: '22CS101', registrationNo: 'REG22CS101', department: 'CSE', semester: 5, cgpa: 8.95 },
  { id: '2', name: 'Priya Rani', email: 'priya@campuscore.in', rollNumber: '22CS102', registrationNo: 'REG22CS102', department: 'CSE', semester: 5, cgpa: 8.65 },
  { id: '3', name: 'Rohit Kumar', email: 'rohit@campuscore.in', rollNumber: '22CS103', registrationNo: 'REG22CS103', department: 'CSE', semester: 5, cgpa: 7.85 },
  { id: '4', name: 'Anita Sharma', email: 'anita@campuscore.in', rollNumber: '22CS104', registrationNo: 'REG22CS104', department: 'CSE', semester: 5, cgpa: 9.15 },
  { id: '5', name: 'Vikram Singh', email: 'vikram@campuscore.in', rollNumber: '22CS105', registrationNo: 'REG22CS105', department: 'CSE', semester: 5, cgpa: 8.25 },
  { id: '6', name: 'Deepika Patel', email: 'deepika@campuscore.in', rollNumber: '22CS106', registrationNo: 'REG22CS106', department: 'CSE', semester: 5, cgpa: 8.75 },
  { id: '7', name: 'Arjun Reddy', email: 'arjun@campuscore.in', rollNumber: '22CS107', registrationNo: 'REG22CS107', department: 'CSE', semester: 5, cgpa: 7.95 },
  { id: '8', name: 'Kavya Nair', email: 'kavya@campuscore.in', rollNumber: '22CS108', registrationNo: 'REG22CS108', department: 'CSE', semester: 5, cgpa: 8.85 },
  { id: '9', name: 'Rajesh Gupta', email: 'rajesh@campuscore.in', rollNumber: '22CS109', registrationNo: 'REG22CS109', department: 'CSE', semester: 5, cgpa: 8.05 },
  { id: '10', name: 'Sneha Mehra', email: 'sneha@campuscore.in', rollNumber: '22CS110', registrationNo: 'REG22CS110', department: 'CSE', semester: 5, cgpa: 9.25 }
];

export const sampleTeachers: Teacher[] = [
  { id: '1', name: 'Rahul Mehra', email: 'rahul@campuscore.in', department: 'CSE', subjects: ['CS501'] },
  { id: '2', name: 'Meena Rathi', email: 'meena@campuscore.in', department: 'CSE', subjects: ['CS502'] },
  { id: '3', name: 'Aman Raj', email: 'aman@campuscore.in', department: 'CSE', subjects: ['CS503'] },
  { id: '4', name: 'Kavita Joshi', email: 'kavita@campuscore.in', department: 'CSE', subjects: ['CS504'] },
  { id: '5', name: 'Manoj Kumar', email: 'manoj@campuscore.in', department: 'CSE', subjects: ['CS505'] },
  { id: '6', name: 'Sakshi Bhatia', email: 'sakshi@campuscore.in', department: 'CSE', subjects: ['CS506'] }
];

export const sampleSubjects: Subject[] = [
  { id: '1', code: 'CS501', name: 'Operating Systems', semester: 5, teacherId: '1', teacherName: 'Rahul Mehra', department: 'CSE', credits: 4 },
  { id: '2', code: 'CS502', name: 'Database Management Systems', semester: 5, teacherId: '2', teacherName: 'Meena Rathi', department: 'CSE', credits: 4 },
  { id: '3', code: 'CS503', name: 'Computer Networks', semester: 5, teacherId: '3', teacherName: 'Aman Raj', department: 'CSE', credits: 4 },
  { id: '4', code: 'CS504', name: 'Software Engineering', semester: 5, teacherId: '4', teacherName: 'Kavita Joshi', department: 'CSE', credits: 3 },
  { id: '5', code: 'CS505', name: 'Artificial Intelligence & Machine Learning', semester: 5, teacherId: '5', teacherName: 'Manoj Kumar', department: 'CSE', credits: 4 },
  { id: '6', code: 'CS506', name: 'Web Development', semester: 5, teacherId: '6', teacherName: 'Sakshi Bhatia', department: 'CSE', credits: 3 }
];

export const sampleTimetable: Timetable[] = [
  {
    day: 'Monday',
    timeSlots: [
      { time: '9:00-10:00', subjectCode: 'CS501', subjectName: 'Operating Systems', teacherName: 'Rahul Mehra' },
      { time: '10:00-11:00', subjectCode: 'CS502', subjectName: 'DBMS', teacherName: 'Meena Rathi' },
      { time: '11:00-12:00', subjectCode: 'CS506', subjectName: 'Web Development', teacherName: 'Sakshi Bhatia' },
      { time: '1:00-2:00', subjectCode: 'CS503', subjectName: 'Computer Networks', teacherName: 'Aman Raj' },
      { time: '2:00-3:00', subjectCode: 'CS505', subjectName: 'AI & ML', teacherName: 'Manoj Kumar' }
    ]
  },
  {
    day: 'Tuesday',
    timeSlots: [
      { time: '9:00-10:00', subjectCode: 'CS503', subjectName: 'Computer Networks', teacherName: 'Aman Raj' },
      { time: '10:00-11:00', subjectCode: 'CS505', subjectName: 'AI & ML', teacherName: 'Manoj Kumar' },
      { time: '11:00-12:00', subjectCode: 'CS504', subjectName: 'Software Engineering', teacherName: 'Kavita Joshi' },
      { time: '1:00-2:00', subjectCode: 'CS506', subjectName: 'Web Development', teacherName: 'Sakshi Bhatia' },
      { time: '2:00-3:00', subjectCode: 'CS502', subjectName: 'DBMS', teacherName: 'Meena Rathi' }
    ]
  },
  {
    day: 'Wednesday',
    timeSlots: [
      { time: '9:00-10:00', subjectCode: 'CS504', subjectName: 'Software Engineering', teacherName: 'Kavita Joshi' },
      { time: '10:00-11:00', subjectCode: 'CS502', subjectName: 'DBMS', teacherName: 'Meena Rathi' },
      { time: '11:00-12:00', subjectCode: 'CS501', subjectName: 'Operating Systems', teacherName: 'Rahul Mehra' },
      { time: '1:00-2:00', subjectCode: 'CS503', subjectName: 'Computer Networks', teacherName: 'Aman Raj' },
      { time: '2:00-3:00', subjectCode: 'CS506', subjectName: 'Web Development', teacherName: 'Sakshi Bhatia' }
    ]
  },
  {
    day: 'Thursday',
    timeSlots: [
      { time: '9:00-10:00', subjectCode: 'CS505', subjectName: 'AI & ML', teacherName: 'Manoj Kumar' },
      { time: '10:00-11:00', subjectCode: 'CS501', subjectName: 'Operating Systems', teacherName: 'Rahul Mehra' },
      { time: '11:00-12:00', subjectCode: 'CS502', subjectName: 'DBMS', teacherName: 'Meena Rathi' },
      { time: '1:00-2:00', subjectCode: 'CS504', subjectName: 'Software Engineering', teacherName: 'Kavita Joshi' },
      { time: '2:00-3:00', subjectCode: 'CS503', subjectName: 'Computer Networks', teacherName: 'Aman Raj' }
    ]
  },
  {
    day: 'Friday',
    timeSlots: [
      { time: '9:00-10:00', subjectCode: 'CS506', subjectName: 'Web Development', teacherName: 'Sakshi Bhatia' },
      { time: '10:00-11:00', subjectCode: 'CS503', subjectName: 'Computer Networks', teacherName: 'Aman Raj' },
      { time: '11:00-12:00', subjectCode: 'CS505', subjectName: 'AI & ML', teacherName: 'Manoj Kumar' },
      { time: '1:00-2:00', subjectCode: 'CS501', subjectName: 'Operating Systems', teacherName: 'Rahul Mehra' },
      { time: '2:00-3:00', subjectCode: 'CS502', subjectName: 'DBMS', teacherName: 'Meena Rathi' }
    ]
  }
];

export const generateSampleAttendance = (): AttendanceRecord[] => {
  const attendance: AttendanceRecord[] = [];
  const dates = ['2025-01-20', '2025-01-21', '2025-01-22', '2025-01-23', '2025-01-24'];
  
  sampleStudents.forEach(student => {
    sampleSubjects.forEach(subject => {
      dates.forEach(date => {
        attendance.push({
          id: `${student.id}-${subject.id}-${date}`,
          studentId: student.id,
          subjectId: subject.id,
          date,
          status: Math.random() > 0.2 ? 'present' : 'absent',
          teacherId: subject.teacherId
        });
      });
    });
  });
  
  return attendance;
};

export const generateSampleMarks = (): Marks[] => {
  const marks: Marks[] = [];
  
  sampleStudents.forEach(student => {
    sampleSubjects.forEach(subject => {
      const internal = Math.floor(Math.random() * 10) + 20; // 20-30
      const external = Math.floor(Math.random() * 20) + 50; // 50-70
      const total = internal + external;
      
      let grade = 'F';
      if (total >= 90) grade = 'A+';
      else if (total >= 80) grade = 'A';
      else if (total >= 70) grade = 'B+';
      else if (total >= 60) grade = 'B';
      else if (total >= 50) grade = 'C';
      else if (total >= 40) grade = 'D';
      
      marks.push({
        id: `${student.id}-${subject.id}`,
        studentId: student.id,
        subjectId: subject.id,
        internalMarks: internal,
        externalMarks: external,
        totalMarks: total,
        grade,
        semester: 5
      });
    });
  });
  
  return marks;
};

export const sampleGrievances: Grievance[] = [
  {
    id: '1',
    studentId: '1',
    title: 'Library Access Issue',
    description: 'Unable to access digital library resources with my credentials.',
    status: 'pending',
    priority: 'medium',
    createdAt: '2025-01-20T10:00:00Z'
  },
  {
    id: '2',
    studentId: '2',
    title: 'Hostel Wi-Fi Problem',
    description: 'Wi-Fi connectivity is very poor in Block A, Room 201.',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2025-01-19T14:30:00Z'
  },
  {
    id: '3',
    studentId: '3',
    title: 'Marks Discrepancy',
    description: 'There seems to be an error in my DBMS internal marks calculation.',
    status: 'resolved',
    priority: 'high',
    createdAt: '2025-01-18T09:15:00Z',
    resolvedAt: '2025-01-22T16:00:00Z',
    response: 'Marks have been recalculated and updated. Please check your result portal.'
  }
];

export const sampleNotices: Notice[] = [
  {
    id: '1',
    title: 'Semester End Examination Schedule',
    content: 'The semester end examinations will commence from February 15, 2025. Students are advised to check the detailed timetable on the portal.',
    department: 'CSE',
    createdBy: 'HOD CSE',
    createdAt: '2025-01-20T09:00:00Z',
    priority: 'important'
  },
  {
    id: '2',
    title: 'Library Maintenance Notice',
    content: 'The central library will be closed for maintenance on January 25, 2025. Students can access digital resources online.',
    department: 'All',
    createdBy: 'Librarian',
    createdAt: '2025-01-19T11:30:00Z',
    priority: 'normal'
  },
  {
    id: '3',
    title: 'Urgent: Fee Payment Deadline',
    content: 'Last date for semester fee payment is January 30, 2025. Late fee will be applicable after this date.',
    department: 'All',
    createdBy: 'Accounts Office',
    createdAt: '2025-01-21T08:00:00Z',
    priority: 'urgent'
  }
];