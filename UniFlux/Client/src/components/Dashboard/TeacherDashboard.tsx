import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Users, ClipboardCheck, Award, Bell, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const TeacherDashboard: React.FC = () => {
  const { currentUser, students, subjects, attendance, marks, notices } = useApp();

  // Get teacher's subjects
  const teacherSubjects = subjects.filter(s => s.teacherId === currentUser?.id);
  const subjectIds = teacherSubjects.map(s => s.id);

  // Calculate teacher-specific data
  const teacherAttendance = attendance.filter(a => subjectIds.includes(a.subjectId));
  const teacherMarks = marks.filter(m => subjectIds.includes(m.subjectId));
  
  const totalClasses = teacherAttendance.length;
  const presentClasses = teacherAttendance.filter(a => a.status === 'present').length;
  const avgAttendance = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
  
  const avgMarks = teacherMarks.length > 0 
    ? teacherMarks.reduce((sum, m) => sum + m.totalMarks, 0) / teacherMarks.length 
    : 0;

  const passedStudents = teacherMarks.filter(m => m.totalMarks >= 40).length;
  const passPercentage = teacherMarks.length > 0 ? Math.round((passedStudents / teacherMarks.length) * 100) : 0;

  // Subject-wise performance
  const subjectPerformance = teacherSubjects.map(subject => {
    const subjectMarks = teacherMarks.filter(m => m.subjectId === subject.id);
    const subjectAttendance = teacherAttendance.filter(a => a.subjectId === subject.id);
    
    const avgSubjectMarks = subjectMarks.length > 0 
      ? subjectMarks.reduce((sum, m) => sum + m.totalMarks, 0) / subjectMarks.length 
      : 0;
    
    const subjectAttendancePercentage = subjectAttendance.length > 0 
      ? Math.round((subjectAttendance.filter(a => a.status === 'present').length / subjectAttendance.length) * 100)
      : 0;
    
    return {
      name: subject.code,
      avgMarks: Math.round(avgSubjectMarks),
      attendance: subjectAttendancePercentage,
      students: subjectMarks.length
    };
  });

  // Grade distribution across all subjects
  const gradeDistribution = [
    { name: 'A+', value: teacherMarks.filter(m => m.grade === 'A+').length, color: '#10B981' },
    { name: 'A', value: teacherMarks.filter(m => m.grade === 'A').length, color: '#3B82F6' },
    { name: 'B+', value: teacherMarks.filter(m => m.grade === 'B+').length, color: '#8B5CF6' },
    { name: 'B', value: teacherMarks.filter(m => m.grade === 'B').length, color: '#F59E0B' },
    { name: 'C', value: teacherMarks.filter(m => m.grade === 'C').length, color: '#EF4444' },
    { name: 'F', value: teacherMarks.filter(m => m.grade === 'F').length, color: '#6B7280' }
  ].filter(grade => grade.value > 0);

  const stats = [
    { title: 'My Subjects', value: teacherSubjects.length.toString(), icon: BookOpen, color: 'bg-blue-500', change: 'Active courses' },
    { title: 'Total Students', value: students.length.toString(), icon: Users, color: 'bg-green-500', change: 'Across all subjects' },
    { title: 'Avg Attendance', value: `${avgAttendance}%`, icon: ClipboardCheck, color: 'bg-yellow-500', change: avgAttendance >= 75 ? 'Good' : 'Needs Focus' },
    { title: 'Pass Rate', value: `${passPercentage}%`, icon: Award, color: 'bg-purple-500', change: passPercentage >= 80 ? 'Excellent' : 'Good' }
  ];

  const recentNotices = notices.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="opacity-90">Here's your teaching dashboard and class performance overview.</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Department: {currentUser?.department}</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Subjects: {teacherSubjects.length}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgMarks" fill="#3B82F6" name="Avg Marks" />
              <Bar dataKey="attendance" fill="#10B981" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
          {gradeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No grades data available</p>
            </div>
          )}
        </div>
      </div>

      {/* My Subjects & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Subjects */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Subjects</h3>
          <div className="space-y-3">
            {teacherSubjects.map(subject => {
              const subjectMarks = teacherMarks.filter(m => m.subjectId === subject.id);
              const avgSubjectMarks = subjectMarks.length > 0 
                ? subjectMarks.reduce((sum, m) => sum + m.totalMarks, 0) / subjectMarks.length 
                : 0;
              
              return (
                <div key={subject.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{subject.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {subject.code} • Semester {subject.semester} • {subject.credits} Credits
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {avgSubjectMarks.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Avg Marks</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notices</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentNotices.map(notice => (
              <div key={notice.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notice.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notice.content.substring(0, 80)}...</p>
                    <p className="text-xs text-gray-400 mt-1">By: {notice.createdBy}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    notice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    notice.priority === 'important' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notice.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <ClipboardCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mark Attendance</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Today's classes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer transition-colors">
            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Enter Marks</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Update grades</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer transition-colors">
            <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">View Reports</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Class analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 cursor-pointer transition-colors">
            <div className="h-10 w-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">View Timetable</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Class schedule</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;