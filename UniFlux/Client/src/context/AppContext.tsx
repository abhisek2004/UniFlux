import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Teacher, Subject, AttendanceRecord, Marks, Grievance, Notice } from '../types';
import { 
  sampleStudents, 
  sampleTeachers, 
  sampleSubjects, 
  generateSampleAttendance, 
  generateSampleMarks,
  sampleGrievances,
  sampleNotices 
} from '../data/sampleData';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  
  // Data
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  marks: Marks[];
  grievances: Grievance[];
  notices: Notice[];
  
  // Actions
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void;
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, subject: Partial<Subject>) => void;
  markAttendance: (studentId: string, subjectId: string, date: string, status: 'present' | 'absent') => void;
  updateMarks: (studentId: string, subjectId: string, internal: number, external: number) => void;
  addGrievance: (grievance: Omit<Grievance, 'id' | 'createdAt'>) => void;
  updateGrievance: (id: string, updates: Partial<Grievance>) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  
  // UI
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Sample users for authentication
const sampleUsers: User[] = [
  { id: 'admin', name: 'Super Admin', email: 'superadmin@campuscore.in', role: 'superadmin' },
  { id: 'hod1', name: 'Dr. Rajesh Kumar', email: 'hod.cse@campuscore.in', role: 'hod', department: 'CSE' },
  ...sampleTeachers.map(teacher => ({ 
    id: teacher.id, 
    name: teacher.name, 
    email: teacher.email, 
    role: 'teacher' as const,
    department: teacher.department 
  })),
  ...sampleStudents.map(student => ({ 
    id: student.id, 
    name: student.name, 
    email: student.email, 
    role: 'student' as const,
    rollNumber: student.rollNumber,
    semester: student.semester,
    department: student.department 
  }))
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(sampleStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(sampleTeachers);
  const [subjects, setSubjects] = useState<Subject[]>(sampleSubjects);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [marks, setMarks] = useState<Marks[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>(sampleGrievances);
  const [notices, setNotices] = useState<Notice[]>(sampleNotices);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Initialize sample data
    setAttendance(generateSampleAttendance());
    setMarks(generateSampleMarks());
    
    // Check for saved user
    const savedUser = localStorage.getItem('campuscore_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Check for dark mode preference
    const savedTheme = localStorage.getItem('campuscore_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple authentication - in real app, this would be API call
    const validCredentials = [
      { email: 'superadmin@campuscore.in', password: 'admin123' },
      { email: 'hod.cse@campuscore.in', password: 'hod123' },
      ...sampleTeachers.map(t => ({ email: t.email, password: 'teacher123' })),
      ...sampleStudents.map(s => ({ email: s.email, password: 'student123' }))
    ];

    const credential = validCredentials.find(c => c.email === email && c.password === password);
    if (credential) {
      const user = sampleUsers.find(u => u.email === email);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('campuscore_user', JSON.stringify(user));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campuscore_user');
  };

  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: Date.now().toString() };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher = { ...teacher, id: Date.now().toString() };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject = { ...subject, id: Date.now().toString() };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const markAttendance = (studentId: string, subjectId: string, date: string, status: 'present' | 'absent') => {
    const id = `${studentId}-${subjectId}-${date}`;
    const existingRecord = attendance.find(a => a.id === id);
    
    if (existingRecord) {
      setAttendance(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } else {
      const subject = subjects.find(s => s.id === subjectId);
      const newRecord: AttendanceRecord = {
        id,
        studentId,
        subjectId,
        date,
        status,
        teacherId: subject?.teacherId || ''
      };
      setAttendance(prev => [...prev, newRecord]);
    }
  };

  const updateMarks = (studentId: string, subjectId: string, internal: number, external: number) => {
    const total = internal + external;
    let grade = 'F';
    if (total >= 90) grade = 'A+';
    else if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B+';
    else if (total >= 60) grade = 'B';
    else if (total >= 50) grade = 'C';
    else if (total >= 40) grade = 'D';

    const id = `${studentId}-${subjectId}`;
    const existingMark = marks.find(m => m.id === id);
    
    if (existingMark) {
      setMarks(prev => prev.map(m => 
        m.id === id 
          ? { ...m, internalMarks: internal, externalMarks: external, totalMarks: total, grade }
          : m
      ));
    } else {
      const newMark: Marks = {
        id,
        studentId,
        subjectId,
        internalMarks: internal,
        externalMarks: external,
        totalMarks: total,
        grade,
        semester: 5
      };
      setMarks(prev => [...prev, newMark]);
    }
  };

  const addGrievance = (grievance: Omit<Grievance, 'id' | 'createdAt'>) => {
    const newGrievance: Grievance = {
      ...grievance,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setGrievances(prev => [...prev, newGrievance]);
  };

  const updateGrievance = (id: string, updates: Partial<Grievance>) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const addNotice = (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...notice,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setNotices(prev => [...prev, newNotice]);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('campuscore_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('campuscore_theme', 'light');
      }
      return newMode;
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      login,
      logout,
      students,
      teachers,
      subjects,
      attendance,
      marks,
      grievances,
      notices,
      addStudent,
      updateStudent,
      addTeacher,
      updateTeacher,
      addSubject,
      updateSubject,
      markAttendance,
      updateMarks,
      addGrievance,
      updateGrievance,
      addNotice,
      darkMode,
      toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};