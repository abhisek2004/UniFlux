import ProtectedRoute from "./components/Auth/ProtectedRoute";
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import LoginForm from './components/Auth/LoginForm';
import RoleSelection from './components/Auth/RoleSelection';
import RegistrationForm from './components/Auth/RegistrationForm';
import SuperAdminLogin from './components/Auth/SuperAdminLogin';

// Dashboard Components
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import HODDashboard from './components/Dashboard/HODDashboard';

// Main Components
import StudentList from './components/Students/StudentList';
import AttendanceManagement from './components/Attendance/AttendanceManagement';
import MarksManagement from './components/Marks/MarksManagement';
import TimetableView from './components/Timetable/TimetableView';
import GrievanceManagement from './components/Grievances/GrievanceManagement';
import NoticeBoard from './components/Notices/NoticeBoard';
import TeacherList from './components/Teachers/TeacherList';
import SubjectList from './components/Subjects/SubjectList';
import ReportsManagement from './components/Reports/ReportsManagement';
import SettingsManagement from './components/Settings/SettingsManagement';
import AcademicCalendarPage from './components/AcademicCalendar/AcademicCalendarPage';
import UserFeedback from './components/Feedback/UserFeedback';

// Footer Pages
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
import TermsOfService from './components/Footer/TermsOfService';
import StudentCodeOfConduct from './components/Footer/StudentCodeOfConduct';
import Accessibility from './components/Footer/Accessibility';
import CreatorInfo from './components/Footer/CreatorInfo';
import QuickLinks from './components/Footer/QuickLinks';

// New Pages
import AdmissionsPage from './components/Admissions/AdmissionsPage';
import StudentPortalPage from './components/StudentPortal/StudentPortalPage';
import FacultyDirectoryPage from './components/FacultyDirectory/FacultyDirectoryPage';
import LibraryPage from './components/Library/LibraryPage';
import CareerServicesPage from './components/CareerServices/CareerServicesPage';

function App() {
  const { currentUser } = useApp();

  return (
    <Router>
      <Routes>
        {/* Footer Pages - Accessible without login */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/student-code-of-conduct" element={<StudentCodeOfConduct />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/creator-info" element={<CreatorInfo />} />
        <Route path="/quick-links" element={<QuickLinks />} />

        {/* Quick Links Pages - Accessible without login but with main layout */}
        <Route path="/academic-calendar" element={<MainAppWithPage page="academic-calendar" />} />
        <Route path="/admissions" element={<MainAppWithPage page="admissions" />} />
        <Route path="/student-portal" element={<MainAppWithPage page="student-portal" />} />
        <Route path="/faculty-directory" element={<MainAppWithPage page="faculty-directory" />} />
        <Route path="/library" element={<MainAppWithPage page="library" />} />
        <Route path="/career-services" element={<MainAppWithPage page="career-services" />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register/:role" element={<RegistrationForm />} />
        <Route path="/superadmin" element={<SuperAdminLogin />} />
        
        {/* Main App Route */}
        <Route path="/*" element={currentUser ? <MainApp /> : <RoleSelection />} />
        
        {/* Redirect from root to role selection */}
        <Route path="/" element={<RoleSelection />} />
      </Routes>
    </Router>
  );
}

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

const renderContent = () => {
  switch (activeTab) {
    case 'dashboard':
      switch (currentUser?.role) {
        case 'superadmin':
          return <SuperAdminDashboard />;
        case 'hod':
          return <HODDashboard />;
        case 'teacher':
          return <TeacherDashboard />;
        case 'student':
          return <StudentDashboard />;
        default:
          return <SuperAdminDashboard />;
      }

    case 'students':
      return (
        <ProtectedRoute allowedRoles={['admin', 'superadmin', 'hod']}>
          <StudentList />
        </ProtectedRoute>
      );

    case 'teachers':
      return (
        <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
          <TeacherList />
        </ProtectedRoute>
      );

    case 'subjects':
      return (
        <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
          <SubjectList />
        </ProtectedRoute>
      );

    case 'attendance':
      return (
        <ProtectedRoute allowedRoles={['teacher', 'hod']}>
          <AttendanceManagement />
        </ProtectedRoute>
      );

    case 'marks':
      return (
        <ProtectedRoute allowedRoles={['teacher', 'hod']}>
          <MarksManagement />
        </ProtectedRoute>
      );

    case 'timetable':
      return <TimetableView />;

    case 'reports':
      return (
        <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
          <ReportsManagement />
        </ProtectedRoute>
      );

    case 'grievances':
      return <GrievanceManagement />;

    case 'notices':
      return <NoticeBoard />;

    case 'settings':
      return (
        <ProtectedRoute allowedRoles={['superadmin']}>
          <SettingsManagement />
        </ProtectedRoute>
      );

    case 'user-feedback':
      return <UserFeedback />;

    case 'academic-calendar':
      return <AcademicCalendarPage />;

    case 'admissions':
      return <AdmissionsPage />;

    case 'student-portal':
      return (
        <ProtectedRoute allowedRoles={['student']}>
          <StudentPortalPage />
        </ProtectedRoute>
      );

    case 'faculty-directory':
      return <FacultyDirectoryPage />;

    case 'library':
      return <LibraryPage />;

    case 'career-services':
      return <CareerServicesPage />;

    default:
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Coming Soon
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This feature is under development.
          </p>
        </div>
      );
  }
};

  
     

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />


      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

// Component to render MainApp with a specific page
const MainAppWithPage: React.FC<{ page: string }> = ({ page }) => {
  const { currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();


  const renderContent = () => {
    switch (page) {
      case 'academic-calendar':
        return <AcademicCalendarPage />;
      case 'admissions':
        return <AdmissionsPage />;
      case 'student-portal':
        return <StudentPortalPage />;
      case 'faculty-directory':
        return <FacultyDirectoryPage />;
      case 'library':
        return <LibraryPage />;
      case 'career-services':
        return <CareerServicesPage />;
      case 'user-feedback':
        return <UserFeedback />;
      default:
        return <LoginForm />;
    }
  };

  const handleSidebarNavigate = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={page}
        setActiveTab={() => { }}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onNavigate={handleSidebarNavigate}
        onClose={() => setSidebarOpen(false)}
      />


      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'}`}>
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;