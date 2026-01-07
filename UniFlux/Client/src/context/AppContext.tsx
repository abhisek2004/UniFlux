import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Student, Teacher, Subject, AttendanceRecord, Marks, Grievance, Notice } from '../types';

interface AppContextType {
  // Auth
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    department: string;
    rollNumber?: string;
    registrationNo?: string;
    semester?: number;
  }) => Promise<boolean>;

  // 🔐 RBAC helpers
  isAuthenticated: boolean;
  userRole: string | null;
  hasRole: (roles: string | string[]) => boolean;

  // Socket
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;

  // Data
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  marks: Marks[];
  grievances: Grievance[];
  notices: Notice[];

  // Actions
  addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  markAttendance: (
    studentId: string,
    subjectId: string,
    date: string,
    status: 'present' | 'absent'
  ) => Promise<void>;
  updateMarks: (
    studentId: string,
    subjectId: string,
    internal: number,
    external: number
  ) => Promise<void>;
  addGrievance: (grievance: Omit<Grievance, 'id' | 'createdAt'>) => Promise<void>;
  updateGrievance: (id: string, updates: Partial<Grievance>) => Promise<void>;
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => Promise<void>;

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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [marks, setMarks] = useState<Marks[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  // 🔐 RBAC derived values
  const isAuthenticated = !!currentUser;
  const userRole = currentUser?.role || null;

  const hasRole = (roles: string | string[]) => {
    if (!currentUser) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(currentUser.role);
  };

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    const savedUser = localStorage.getItem('campuscore_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedTheme = localStorage.getItem('campuscore_theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data);
        localStorage.setItem('campuscore_user', JSON.stringify(data));
        localStorage.setItem('campuscore_token', data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campuscore_user');
    localStorage.removeItem('campuscore_token');
    if (socket) socket.disconnect();
    setSocket(null);
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data);
        localStorage.setItem('campuscore_user', JSON.stringify(data));
        localStorage.setItem('campuscore_token', data.token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('campuscore_theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        register,
        isAuthenticated,
        userRole,
        hasRole,
        socket,
        setSocket,
        students,
        teachers,
        subjects,
        attendance,
        marks,
        grievances,
        notices,
        addStudent: async () => {},
        updateStudent: async () => {},
        addTeacher: async () => {},
        updateTeacher: async () => {},
        addSubject: async () => {},
        updateSubject: async () => {},
        markAttendance: async () => {},
        updateMarks: async () => {},
        addGrievance: async () => {},
        updateGrievance: async () => {},
        addNotice: async () => {},
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
