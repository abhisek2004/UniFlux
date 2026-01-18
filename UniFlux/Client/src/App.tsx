import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import LoginForm from './components/Auth/LoginForm';
import RoleSelection from './components/Auth/RoleSelection';
import RegistrationForm from './components/Auth/RegistrationForm';
import SuperAdminLogin from './components/Auth/SuperAdminLogin';
import ScrollToTop from "./components/ScrollToTop";
import NotFound from './components/NotFound';

// Dashboard Components
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import TeacherDashboard from './components/Dashboard/TeacherDashboard';
import HODDashboard from './components/Dashboard/HODDashboard';
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
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
import TermsOfService from './components/Footer/TermsOfService';
import StudentCodeOfConduct from './components/Footer/StudentCodeOfConduct';
import Accessibility from './components/Footer/Accessibility';
import CreatorInfo from './components/Footer/CreatorInfo';
import QuickLinks from './components/Footer/QuickLinks';
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
        <Route path="/*" element={currentUser ? <MainApp /> : <RoleSelection />} />
        <Route path="/" element={currentUser ? <MainApp /> : <RoleSelection />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ScrollToTop />
    </Router>
  );
}

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        switch (currentUser?.role) {
          case 'superadmin': return <SuperAdminDashboard />;
          case 'hod': return <HODDashboard />;
          case 'teacher': return <TeacherDashboard />;
          case 'student': return <StudentDashboard />;
          default: return <RoleSelection />;
        }
      case 'students': return <StudentList />;
      case 'teachers': return <TeacherList />;
      case 'subjects': return <SubjectList />;
      case 'attendance': return <AttendanceManagement />;
      case 'marks': return <MarksManagement />;
      case 'timetable': return <TimetableView />;
      case 'reports': return <ReportsManagement />;
      case 'grievances': return <GrievanceManagement />;
      case 'notices': return <NoticeBoard />;
      case 'settings': return <SettingsManagement />;
      case 'user-feedback': return <UserFeedback />;
      case 'academic-calendar': return <AcademicCalendarPage />;
      case 'admissions': return <AdmissionsPage />;
      case 'student-portal': return <StudentPortalPage />;
      case 'faculty-directory': return <FacultyDirectoryPage />;
      case 'library': return <LibraryPage />;
      case 'career-services': return <CareerServicesPage />;
      default: return <div className="p-4 sm:p-8"><NotFound /></div>;
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
        />

<main className="flex-1 pt-20 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

const MainAppWithPage: React.FC<{ page: string }> = ({ page }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (page) {
      case 'academic-calendar': return <AcademicCalendarPage />;
      case 'admissions': return <AdmissionsPage />;
      case 'student-portal': return <StudentPortalPage />;
      case 'faculty-directory': return <FacultyDirectoryPage />;
      case 'library': return <LibraryPage />;
      case 'career-services': return <CareerServicesPage />;
      case 'user-feedback': return <UserFeedback />;
      default: return <NotFound />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      <Sidebar
        activeTab={page}
        setActiveTab={() => { }}
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onNavigate={(route) => navigate(route)}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          isSidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default App;