import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import LoginForm from './components/Auth/LoginForm';

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
        
        {/* Main App Route */}
        <Route path="/*" element={currentUser ? <MainApp /> : <LoginForm />} />
      </Routes>
    </Router>
  );
}

const MainApp: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        return <StudentList />;
      case 'teachers':
        return <TeacherList />;
      case 'subjects':
        return <SubjectList />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'marks':
        return <MarksManagement />;
      case 'timetable':
        return <TimetableView />;
      case 'reports':
        return <ReportsManagement />;
      case 'grievances':
        return <GrievanceManagement />;
      case 'notices':
        return <NoticeBoard />;
      case 'settings':
        return <SettingsManagement />;
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
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Coming Soon</h2>
            <p className="text-gray-600 dark:text-gray-400">This feature is under development.</p>
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
      />
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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
        setActiveTab={() => {}} 
        isOpen={sidebarOpen}
        onNavigate={handleSidebarNavigate}
      />
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
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