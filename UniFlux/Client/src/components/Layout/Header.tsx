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
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="hidden lg:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="h-5 w-5" />
            </button>

            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden focus:ring-2 focus:ring-primary-500"
              aria-label="Open sidebar menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">CC</span>
              </div>
              <div className="block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">CampusCore</h1>
                <p className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">University Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                   setShowNotifications(!showNotifications);
                   setShowProfile(false);
                }}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                {urgentNotices > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    {urgentNotices > 0 && <span className="text-xs text-red-500 font-medium">{urgentNotices} Urgent</span>}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notices.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">No new notifications</div>
                    ) : (
                        notices.slice(0, 5).map(notice => (
                        <div key={notice.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                                    notice.priority === 'urgent' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                    {notice.priority}
                                </span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-white font-medium line-clamp-1">{notice.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notice.content}</p>
                        </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                }}
                className="flex items-center space-x-2 sm:space-x-3 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              >
                <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize leading-none">{currentUser?.role}</p>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2 w-56 max-w-[90vw] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                    <p className="text-xs text-primary-500 font-medium mt-1 capitalize">{currentUser?.role}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
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