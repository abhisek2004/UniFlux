import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Student, Teacher, Subject, AttendanceRecord, Marks, Grievance, Notice } from '../types';
import { useToast } from './ToastContext';

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
  deleteStudent: (id: string) => Promise<void>;
  updateStudent: (id: string, student: Partial<Student>) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  markAttendance: (studentId: string, subjectId: string, date: string, status: 'present' | 'absent') => Promise<void>;
  updateMarks: (studentId: string, subjectId: string, internal: number, external: number) => Promise<void>;
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

  const { showToast } = useToast();
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const getToken = () => {
    const token = localStorage.getItem('campuscore_token');
    if (!token) {
      showToast('error', 'Session expired', 'Please log in again to continue.');
    }
    return token;
  };

  const extractErrorMessage = async (response: Response) => {
    try {
      const data = await response.json();
      if (typeof data === 'string') return data;
      return data?.message || data?.error || 'Please try again later.';
    } catch {
      return response.statusText || 'Please try again later.';
    }
  };

  const handleNetworkError = (error: unknown, title: string) => {
    console.error(title, error);
    const description = error instanceof Error ? error.message : 'Please try again later.';
    showToast('error', title, description);
  };

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
        showToast('success', 'Welcome back', `Logged in as ${data.role || 'user'}`);
        return true;
      }

      const message = data?.message || 'Invalid email or password.';
      showToast('error', 'Login failed', message);
      return false;
    } catch (error) {
      handleNetworkError(error, 'Login failed');
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campuscore_user');
    localStorage.removeItem('campuscore_token');
    if (socket) socket.disconnect();
    setSocket(null);
    showToast('info', 'Logged out', 'You have been signed out safely.');
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
        showToast('success', 'Registration complete', 'Account created successfully.');
        return true;
      }

      const message = data?.message || 'Unable to register with the provided details.';
      showToast('error', 'Registration failed', message);
      return false;
    } catch (error) {
      handleNetworkError(error, 'Registration failed');
      return false;
    }
  };
  const addStudent = async (student: Omit<Student, 'id'>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to add student', message);
        return;
      }

      const newStudent = await response.json();
      setStudents((prev) => [...prev, newStudent]);
      showToast('success', 'Student added', `${newStudent.name} has been added successfully.`);
    } catch (error) {
      handleNetworkError(error, 'Unable to add student');
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to update student', message);
        return;
      }

      const updatedStudent = await response.json();
      setStudents((prev) => prev.map((s) => (s.id === id ? updatedStudent : s)));
      showToast('success', 'Student updated', `${updatedStudent.name} was updated successfully.`);
    } catch (error) {
      handleNetworkError(error, 'Unable to update student');
    }
  };

  const deleteStudent = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to delete student', message);
        return;
      }

      setStudents((prev) => prev.filter((s) => s.id !== id));
      showToast('success', 'Student deleted', 'Student record has been removed.');
    } catch (error) {
      handleNetworkError(error, 'Unable to delete student');
    }
  };

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(teacher),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to add teacher', message);
        return;
      }

      const newTeacher = await response.json();
      setTeachers((prev) => [...prev, newTeacher]);
      showToast('success', 'Teacher added', `${newTeacher.name} has been added successfully.`);
    } catch (error) {
      handleNetworkError(error, 'Unable to add teacher');
    }
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to update teacher', message);
        return;
      }

      const updatedTeacher = await response.json();
      setTeachers((prev) => prev.map((t) => (t.id === id ? updatedTeacher : t)));
      showToast('success', 'Teacher updated', `${updatedTeacher.name} was updated successfully.`);
    } catch (error) {
      handleNetworkError(error, 'Unable to update teacher');
    }
  };

  const deleteTeacher = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to delete teacher', message);
        return;
      }

      setTeachers((prev) => prev.filter((t) => t.id !== id));
      showToast('success', 'Teacher deleted', 'Teacher record has been removed.');
    } catch (error) {
      handleNetworkError(error, 'Unable to delete teacher');
    }
  };

  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subject),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to add subject', message);
        return;
      }

      const newSubject = await response.json();
      setSubjects((prev) => [...prev, newSubject]);
      showToast('success', 'Subject added', `${newSubject.name} has been added successfully.`);
    } catch (error) {
      handleNetworkError(error, 'Unable to add subject');
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to update subject', message);
        return;
      }

      const updatedSubject = await response.json();
      setSubjects((prev) => prev.map((s) => (s.id === id ? updatedSubject : s)));
      showToast('success', 'Subject updated', `${updatedSubject.name} was updated successfully.`);
    } catch (error) {
      handleNetworkError(error, 'Unable to update subject');
    }
  };

  const deleteSubject = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to delete subject', message);
        return;
      }

      setSubjects((prev) => prev.filter((s) => s.id !== id));
      showToast('success', 'Subject deleted', 'Subject record has been removed.');
    } catch (error) {
      handleNetworkError(error, 'Unable to delete subject');
    }
  };

  const markAttendance = async (studentId: string, subjectId: string, date: string, status: 'present' | 'absent') => {
    const token = getToken();
    if (!token) return;

    try {
      const subject = subjects.find((s) => s.id === subjectId);

      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          subjectId,
          date,
          status,
          teacherId: subject?.teacherId || '',
        }),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to mark attendance', message);
        return;
      }

      const newAttendance = await response.json();
      setAttendance((prev) => [...prev, newAttendance]);
      showToast('success', 'Attendance saved', 'Attendance has been recorded successfully.');
    } catch (error) {
      handleNetworkError(error, 'Unable to mark attendance');
    }
  };

  const updateMarks = async (studentId: string, subjectId: string, internal: number, external: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/marks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId,
          subjectId,
          internalMarks: internal,
          externalMarks: external,
          semester: 5,
        }),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to update marks', message);
        return;
      }

      const newMarks = await response.json();
      setMarks((prev) => [...prev, newMarks]);
      showToast('success', 'Marks updated', 'Marks have been updated successfully.');
    } catch (error) {
      handleNetworkError(error, 'Unable to update marks');
    }
  };

  const addGrievance = async (grievance: Omit<Grievance, 'id' | 'createdAt'>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/grievances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(grievance),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to submit grievance', message);
        return;
      }

      const newGrievance = await response.json();
      setGrievances((prev) => [...prev, newGrievance]);
      showToast('success', 'Grievance submitted', 'Your grievance has been recorded.');
    } catch (error) {
      handleNetworkError(error, 'Unable to submit grievance');
    }
  };

  const updateGrievance = async (id: string, updates: Partial<Grievance>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/grievances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to update grievance', message);
        return;
      }

      const updatedGrievance = await response.json();
      setGrievances((prev) => prev.map((g) => (g.id === id ? updatedGrievance : g)));
      showToast('success', 'Grievance updated', 'Grievance status has been updated.');
    } catch (error) {
      handleNetworkError(error, 'Unable to update grievance');
    }
  };

  const addNotice = async (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(notice),
      });

      if (!response.ok) {
        const message = await extractErrorMessage(response);
        showToast('error', 'Unable to add notice', message);
        return;
      }

      const newNotice = await response.json();
      setNotices((prev) => [...prev, newNotice]);
      showToast('success', 'Notice added', 'The notice has been published.');
    } catch (error) {
      handleNetworkError(error, 'Unable to add notice');
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
        addStudent,
        deleteStudent,
        updateStudent,
        addTeacher,
        deleteTeacher,
        updateTeacher,
        addSubject,
        deleteSubject,
        updateSubject,
        markAttendance,
        updateMarks,
        addGrievance,
        updateGrievance,
        addNotice,
        darkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
