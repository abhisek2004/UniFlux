import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  MessageCircle,
  Settings,
  BarChart3,
  UserCheck,
  Award,
  Bell,
  ChevronLeft,
  LayoutGrid,
  MessageCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  isCollapsed?: boolean;
  onNavigate?: (tab: string) => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, isCollapsed, onNavigate, onClose }) => {
  const { currentUser } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['superadmin', 'hod', 'teacher', 'student'], route: '/dashboard' },
    { id: 'students', label: 'Students', icon: Users, roles: ['superadmin', 'hod', 'teacher'], route: '/students' },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: ['superadmin', 'hod'], route: '/teachers' },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, roles: ['superadmin', 'hod', 'teacher'], route: '/subjects' },
    { id: 'attendance', label: 'Attendance', icon: UserCheck, roles: ['superadmin', 'hod', 'teacher', 'student'], route: '/attendance' },
    { id: 'marks', label: 'Marks & Results', icon: Award, roles: ['superadmin', 'hod', 'teacher', 'student'], route: '/marks' },
    { id: 'timetable', label: 'Timetable', icon: Calendar, roles: ['superadmin', 'hod', 'teacher', 'student'], route: '/timetable' },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['superadmin', 'hod', 'teacher'], route: '/reports' },
    { id: 'grievances', label: 'Grievances', icon: MessageSquare, roles: ['superadmin', 'hod', 'student'], route: '/grievances' },
    { id: 'notices', label: 'Notices', icon: Bell, roles: ['superadmin', 'hod', 'teacher', 'student'], route: '/notices' },
    { id: 'user-feedback', label: 'User Feedback', icon: MessageCircle, roles: ['superadmin', 'hod', 'teacher', 'student'], route: '/feedback' },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['superadmin', 'hod'], route: '/settings' }
  ];

  const filteredMenuItems = menuItems.filter(item =>
    item.roles.includes(currentUser?.role || '')
  );

  return (
    <aside 
      id="sidebar-menu"
      className={`
        fixed inset-y-0 left-0 z-50 w-64 ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      aria-label="Main navigation"
      aria-hidden={!isOpen && window.innerWidth < 1024}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className={`flex items-center justify-between flex-shrink-0 px-4 ${isCollapsed ? 'lg:justify-center lg:px-0 pt-4' : 'pt-5'} pb-4 lg:hidden`}>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">CampusCore</span>
            </div>
            {/* Mobile/Expanded Close Arrow */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Close Menu"
              aria-label="Close sidebar menu"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </div>

          <nav 
            className="mt-8 flex-1 px-2 space-y-1"
            aria-label="Dashboard navigation"
          >
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(item.route);
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full transition-colors
                    ${isActive
                      ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                  aria-label={`Navigate to ${item.label}`}
                  aria-current={isActive ? "page" : undefined}
                  title={item.label}
                >
                  <Icon
                    className={`flex-shrink-0 h-5 w-5 mr-3 ${isCollapsed ? 'lg:mr-0 lg:mx-auto' : ''} ${isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    aria-hidden="true"
                  />
                  <span className={`${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-700 p-4">
          <div className={`flex items-center w-full ${isCollapsed ? 'lg:justify-center lg:px-0' : ''}`}>
            <div 
              className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0"
              aria-label={`${currentUser?.name}'s profile avatar`}
            >
              <span className="text-white font-medium text-sm">
                {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
            <div className={`ml-3 flex-1 overflow-hidden ${isCollapsed ? 'lg:hidden' : ''}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;