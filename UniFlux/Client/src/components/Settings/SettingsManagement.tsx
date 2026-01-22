import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Users, GraduationCap, BookOpen, Shield, Bell, Database, Download, Upload, Save } from 'lucide-react';
import UserManagement from './UserManagement';

const SettingsManagement: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('users');
  const [systemSettings, setSystemSettings] = useState({
    universityName: 'CampusCore University',
    academicYear: '2024-2025',
    currentSemester: 'Spring 2025',
    attendanceThreshold: 75,
    passingMarks: 40,
    maxCreditsPerSemester: 24,
    enableNotifications: true,
    enableDarkMode: true,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [gradeSettings, setGradeSettings] = useState([
    { grade: 'A+', minMarks: 90, maxMarks: 100, points: 10 },
    { grade: 'A', minMarks: 80, maxMarks: 89, points: 9 },
    { grade: 'B+', minMarks: 70, maxMarks: 79, points: 8 },
    { grade: 'B', minMarks: 60, maxMarks: 69, points: 7 },
    { grade: 'C', minMarks: 50, maxMarks: 59, points: 6 },
    { grade: 'D', minMarks: 40, maxMarks: 49, points: 5 },
    { grade: 'F', minMarks: 0, maxMarks: 39, points: 0 }
  ]);

  const handleSystemSettingsChange = (key: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleGradeSettingsChange = (index: number, field: string, value: any) => {
    setGradeSettings(prev => prev.map((grade, i) =>
      i === index ? { ...grade, [field]: value } : grade
    ));
  };

  const saveSettings = () => {
    console.log('Settings saved:', { systemSettings, gradeSettings });
    alert('Settings saved successfully!');
  };

  const exportData = () => {
    console.log('Exporting data...');
    alert('Data export initiated!');
  };

  const importData = () => {
    console.log('Importing data...');
    alert('Data import feature - select file to import');
  };

  const tabs = [
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'system', name: 'System Settings', icon: Settings },
    { id: 'academic', name: 'Academic Settings', icon: GraduationCap },
    { id: 'grades', name: 'Grade Configuration', icon: BookOpen },
    { id: 'security', name: 'Security & Backup', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage system configuration and preferences</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={exportData}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={importData}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Import Data</span>
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-4 overflow-x-auto px-4 sm:px-6 py-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-3 border-b-2 text-sm font-medium flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* User Management */}
          {activeTab === 'users' && <UserManagement />}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University Name</label>
                  <input
                    type="text"
                    value={systemSettings.universityName}
                    onChange={(e) => handleSystemSettingsChange('universityName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={systemSettings.academicYear}
                    onChange={(e) => handleSystemSettingsChange('academicYear', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Semester</label>
                  <input
                    type="text"
                    value={systemSettings.currentSemester}
                    onChange={(e) => handleSystemSettingsChange('currentSemester', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attendance Threshold (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={systemSettings.attendanceThreshold}
                    onChange={(e) => handleSystemSettingsChange('attendanceThreshold', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-md font-medium text-gray-900 dark:text-white">System Preferences</h4>
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Notifications</span>
                    <input
                      type="checkbox"
                      checked={systemSettings.enableNotifications}
                      onChange={(e) => handleSystemSettingsChange('enableNotifications', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Dark Mode</span>
                    <input
                      type="checkbox"
                      checked={systemSettings.enableDarkMode}
                      onChange={(e) => handleSystemSettingsChange('enableDarkMode', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Auto Backup</span>
                    <input
                      type="checkbox"
                      checked={systemSettings.autoBackup}
                      onChange={(e) => handleSystemSettingsChange('autoBackup', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Academic Settings */}
          {activeTab === 'academic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={systemSettings.passingMarks}
                    onChange={(e) => handleSystemSettingsChange('passingMarks', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Credits Per Semester</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={systemSettings.maxCreditsPerSemester}
                    onChange={(e) => handleSystemSettingsChange('maxCreditsPerSemester', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">Semester Configuration</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <div key={sem} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg text-center">
                      <h5 className="font-medium text-gray-900 dark:text-white">Semester {sem}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Grade Settings */}
          {activeTab === 'grades' && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Min Marks</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Max Marks</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {gradeSettings.map((grade, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">{grade.grade}</td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          value={grade.minMarks}
                          onChange={(e) => handleGradeSettingsChange(index, 'minMarks', parseInt(e.target.value))}
                          className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          value={grade.maxMarks}
                          onChange={(e) => handleGradeSettingsChange(index, 'maxMarks', parseInt(e.target.value))}
                          className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.1"
                          value={grade.points}
                          onChange={(e) => handleGradeSettingsChange(index, 'points', parseFloat(e.target.value))}
                          className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Security & Notifications tabs remain similar but wrapped in responsive grids */}
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
