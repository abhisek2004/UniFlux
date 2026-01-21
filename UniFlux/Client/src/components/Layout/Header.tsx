import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Bell, Moon, Sun, User, LogOut, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onToggleSidebar,
  isSidebarCollapsed,
}) => {
  const { currentUser, logout, darkMode, toggleDarkMode, notices } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const urgentNotices = notices.filter((n) => n.priority === "urgent").length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
    setShowNotifications(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50
      bg-white dark:bg-gray-800
      shadow-lg
      border-b border-gray-200 dark:border-gray-700"
    >
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="hidden p-2 text-gray-500 transition-colors rounded-lg lg:flex hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={onMenuClick}
              className="p-2 text-gray-400 rounded-md hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500">
                <span className="text-sm font-bold text-white">CC</span>
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  CampusCore
                </h1>
                <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">
                  University Management
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Bell className="w-5 h-5" />
                {urgentNotices > 0 && (
                  <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                    {urgentNotices}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 z-50 mt-2 bg-white border rounded-lg shadow-lg w-80 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold dark:text-white">
                      Notifications
                    </h3>
                  </div>

                  <div className="overflow-y-auto max-h-64">
                    {notices.slice(0, 5).map((notice) => (
                      <div
                        key={notice.id}
                        className="p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium dark:text-white">
                              {notice.title}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              {notice.content.substring(0, 60)}...
                            </p>
                          </div>

                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              notice.priority === "urgent"
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
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

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfile}
                className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600">
                  <User className="w-4 h-4 text-white" />
                </div>

                <div className="hidden ml-3 text-left md:block">
                  <p className="text-sm font-medium dark:text-white">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize dark:text-gray-400">
                    {currentUser?.role}
                  </p>
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 z-50 w-48 mt-2 bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-4 border-b dark:border-gray-700">
                    <p className="text-sm font-medium dark:text-white">
                      {currentUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser?.email}
                    </p>
                    <p className="mt-1 text-xs font-medium capitalize text-primary-500">
                      {currentUser?.role}
                    </p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
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
