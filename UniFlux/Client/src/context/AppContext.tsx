import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Student, Teacher, Subject, AttendanceRecord, Marks, Grievance, Notice } from '../types';

interface AppContextType {
  // Auth
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: { name: string; email: string; password: string; role: string; department: string; rollNumber?: string; registrationNo?: string; semester?: number }) => Promise<boolean>;
  
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
  deleteStudent: (id: string) => Promise<void>;
  addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
  updateTeacher: (id: string, teacher: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  addSubject: (subject: Omit<Subject, 'id'>) => Promise<void>;
  updateSubject: (id: string, subject: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
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

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    // Initialize socket connection
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
    const newSocket = io(socketUrl);
    setSocket(newSocket);
    
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
    
    // Load initial data
    fetchInitialData();
    
    // Set up real-time listeners
    setupSocketListeners(newSocket);
    
    // Cleanup function
    return () => {
      newSocket.close();
    };
  }, []);

  const setupSocketListeners = (socket: Socket) => {
    // Listen for student updates
    socket.on('student-created', (student: Student) => {
      setStudents(prev => [...prev, student]);
    });
    
    socket.on('student-updated', (updatedStudent: Student) => {
      setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    });
    
    socket.on('student-deleted', (data: { id: string }) => {
      setStudents(prev => prev.filter(s => s.id !== data.id));
    });
    
    // Listen for teacher updates
    socket.on('teacher-created', (teacher: Teacher) => {
      setTeachers(prev => [...prev, teacher]);
    });
    
    socket.on('teacher-updated', (updatedTeacher: Teacher) => {
      setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    });
    
    socket.on('teacher-deleted', (data: { id: string }) => {
      setTeachers(prev => prev.filter(t => t.id !== data.id));
    });
    
    // Listen for subject updates
    socket.on('subject-created', (subject: Subject) => {
      setSubjects(prev => [...prev, subject]);
    });
    
    socket.on('subject-updated', (updatedSubject: Subject) => {
      setSubjects(prev => prev.map(s => s.id === updatedSubject.id ? updatedSubject : s));
    });
    
    socket.on('subject-deleted', (data: { id: string }) => {
      setSubjects(prev => prev.filter(s => s.id !== data.id));
    });
    
    // Listen for attendance updates
    socket.on('attendance-created', (attendance: AttendanceRecord) => {
      setAttendance(prev => [...prev, attendance]);
    });
    
    socket.on('attendance-updated', (updatedAttendance: AttendanceRecord) => {
      setAttendance(prev => prev.map(a => a.id === updatedAttendance.id ? updatedAttendance : a));
    });
    
    socket.on('attendance-deleted', (data: { id: string }) => {
      setAttendance(prev => prev.filter(a => a.id !== data.id));
    });
    
    // Listen for marks updates
    socket.on('marks-created', (marks: Marks) => {
      setMarks(prev => [...prev, marks]);
    });
    
    socket.on('marks-updated', (updatedMarks: Marks) => {
      setMarks(prev => prev.map(m => m.id === updatedMarks.id ? updatedMarks : m));
    });
    
    socket.on('marks-deleted', (data: { id: string }) => {
      setMarks(prev => prev.filter(m => m.id !== data.id));
    });
    
    // Listen for grievance updates
    socket.on('grievance-created', (grievance: Grievance) => {
      setGrievances(prev => [...prev, grievance]);
    });
    
    socket.on('grievance-updated', (updatedGrievance: Grievance) => {
      setGrievances(prev => prev.map(g => g.id === updatedGrievance.id ? updatedGrievance : g));
    });
    
    socket.on('grievance-deleted', (data: { id: string }) => {
      setGrievances(prev => prev.filter(g => g.id !== data.id));
    });
    
    // Listen for notice updates
    socket.on('notice-created', (notice: Notice) => {
      setNotices(prev => [...prev, notice]);
    });
    
    socket.on('notice-updated', (updatedNotice: Notice) => {
      setNotices(prev => prev.map(n => n.id === updatedNotice.id ? updatedNotice : n));
    });
    
    socket.on('notice-deleted', (data: { id: string }) => {
      setNotices(prev => prev.filter(n => n.id !== data.id));
    });
  };

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchStudents(),
        fetchTeachers(),
        fetchSubjects(),
        fetchAttendance(),
        fetchMarks(),
        fetchGrievances(),
        fetchNotices()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTeachers(data);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchMarks = async () => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/marks`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMarks(data);
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const fetchGrievances = async () => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/grievances`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setGrievances(data);
      }
    } catch (error) {
      console.error('Error fetching grievances:', error);
    }
  };

  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/notices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotices(data);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setCurrentUser(data);
        localStorage.setItem('campuscore_user', JSON.stringify(data));
        localStorage.setItem('campuscore_token', data.token);
        
        // Connect to socket after login
        if (socket) {
          socket.disconnect();
        }
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
        const newSocket = io(socketUrl);
        setSocket(newSocket);
        setupSocketListeners(newSocket);
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('campuscore_user');
    localStorage.removeItem('campuscore_token');
    
    // Disconnect socket on logout
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role: string; department: string; rollNumber?: string; registrationNo?: string; semester?: number }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Only parse JSON if response is OK or has content
      let data;
      if (response.ok || response.headers.get('content-type')?.includes('application/json')) {
        data = await response.json();
      }

      if (response.ok) {
        // Auto-login after successful registration
        setCurrentUser(data);
        localStorage.setItem('campuscore_user', JSON.stringify(data));
        localStorage.setItem('campuscore_token', data.token);
        
        // Connect to socket after registration
        if (socket) {
          socket.disconnect();
        }
        const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';
        const newSocket = io(socketUrl);
        setSocket(newSocket);
        setupSocketListeners(newSocket);
        
        return true;
      } else {
        console.error('Registration failed:', data?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const addStudent = async (student: Omit<Student, 'id'>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        const newStudent = await response.json();
        setStudents(prev => [...prev, newStudent]);
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(prev => prev.map(s => s.id === id ? updatedStudent : s));
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const addTeacher = async (teacher: Omit<Teacher, 'id'>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/teachers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(teacher),
      });

      if (response.ok) {
        const newTeacher = await response.json();
        setTeachers(prev => [...prev, newTeacher]);
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTeacher = await response.json();
        setTeachers(prev => prev.map(t => t.id === id ? updatedTeacher : t));
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const deleteTeacher = async (id: string) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setTeachers(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const addSubject = async (subject: Omit<Subject, 'id'>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subject),
      });

      if (response.ok) {
        const newSubject = await response.json();
        setSubjects(prev => [...prev, newSubject]);
      }
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedSubject = await response.json();
        setSubjects(prev => prev.map(s => s.id === id ? updatedSubject : s));
      }
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSubjects(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

  const markAttendance = async (studentId: string, subjectId: string, date: string, status: 'present' | 'absent') => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      // Find the subject to get the teacherId
      const subject = subjects.find(s => s.id === subjectId);
      
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          subjectId,
          date,
          status,
          teacherId: subject?.teacherId || ''
        }),
      });

      if (response.ok) {
        const newAttendance = await response.json();
        setAttendance(prev => [...prev, newAttendance]);
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const updateMarks = async (studentId: string, subjectId: string, internal: number, external: number) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      // Calculate total and grade
      const total = internal + external;
      let grade = 'F';
      if (total >= 90) grade = 'A+'
      else if (total >= 80) grade = 'A'
      else if (total >= 70) grade = 'B+'
      else if (total >= 60) grade = 'B'
      else if (total >= 50) grade = 'C'
      else if (total >= 40) grade = 'D'

      const response = await fetch(`${API_BASE_URL}/marks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId,
          subjectId,
          internalMarks: internal,
          externalMarks: external,
          semester: 5
        }),
      });

      if (response.ok) {
        const newMarks = await response.json();
        setMarks(prev => [...prev, newMarks]);
      }
    } catch (error) {
      console.error('Error updating marks:', error);
    }
  };

  const addGrievance = async (grievance: Omit<Grievance, 'id' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/grievances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(grievance),
      });

      if (response.ok) {
        const newGrievance = await response.json();
        setGrievances(prev => [...prev, newGrievance]);
      }
    } catch (error) {
      console.error('Error adding grievance:', error);
    }
  };

  const updateGrievance = async (id: string, updates: Partial<Grievance>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/grievances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedGrievance = await response.json();
        setGrievances(prev => prev.map(g => g.id === id ? updatedGrievance : g));
      }
    } catch (error) {
      console.error('Error updating grievance:', error);
    }
  };

  const addNotice = async (notice: Omit<Notice, 'id' | 'createdAt'>) => {
    try {
      const token = localStorage.getItem('campuscore_token');
      if (!token) return;
      
      const response = await fetch(`${API_BASE_URL}/notices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notice),
      });

      if (response.ok) {
        const newNotice = await response.json();
        setNotices(prev => [...prev, newNotice]);
      }
    } catch (error) {
      console.error('Error adding notice:', error);
    }
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
      setCurrentUser,
      login,
      logout,
      register,
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
      updateStudent,
      deleteStudent,
      addTeacher,
      updateTeacher,
      deleteTeacher,
      addSubject,
      updateSubject,
      deleteSubject,
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