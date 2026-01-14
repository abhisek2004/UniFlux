import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Moon, Sun, User, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onToggleSidebar, isSidebarCollapsed }) => {
  const { currentUser, logout, darkMode, toggleDarkMode, notices } = useApp();
  const [showProfile, setShowProfile] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const urgentNotices = notices.filter(n => n.priority === 'urgent').length;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-1 sm:px-1 lg:px-1">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center">
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 mr-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              aria-label={isSidebarCollapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
              aria-expanded={!isSidebarCollapsed}
              aria-controls="sidebar-menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden"
              aria-label="Open sidebar menu"
              aria-expanded="false"
              aria-controls="sidebar-menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <div className="ml-3 hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">CampusCore</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">University Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={darkMode}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors relative"
                aria-label={`View notifications ${urgentNotices > 0 ? `(${urgentNotices} urgent)` : ''}`}
                aria-expanded={showNotifications}
                aria-controls="notifications-dropdown"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {urgentNotices > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    aria-label={`${urgentNotices} urgent notifications`}
                  >
                    {urgentNotices}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div 
                  id="notifications-dropdown"
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  role="menu"
                  aria-label="Notifications menu"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notices.slice(0, 5).map(notice => (
                      <div 
                        key={notice.id} 
                        className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notice.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notice.content.substring(0, 60)}...</p>
                          </div>
                          <span 
                            className={`px-2 py-1 text-xs rounded-full ${notice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              notice.priority === 'important' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}
                            aria-label={`Priority: ${notice.priority}`}
                          >
                            {notice.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="User profile menu"
                aria-expanded={showProfile}
                aria-controls="profile-dropdown"
                title="User profile"
              >
                <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser?.role}</p>
                </div>
              </button>

              {showProfile && (
                <div 
                  id="profile-dropdown"
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  role="menu"
                  aria-label="User profile menu"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      aria-label="Log out from CampusCore"
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;