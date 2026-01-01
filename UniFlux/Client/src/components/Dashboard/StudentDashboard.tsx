import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Calendar, ClipboardCheck, Award, Bell, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const StudentDashboard: React.FC = () => {
  const { currentUser, attendance, marks, subjects, notices, grievances } = useApp();

  // Calculate student-specific data
  const studentAttendance = attendance.filter(a => a.studentId === currentUser?.id);
  const studentMarks = marks.filter(m => m.studentId === currentUser?.id);
  
  const totalClasses = studentAttendance.length;
  const presentClasses = studentAttendance.filter(a => a.status === 'present').length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
  
  const avgMarks = studentMarks.length > 0 
    ? studentMarks.reduce((sum, m) => sum + m.totalMarks, 0) / studentMarks.length 
    : 0;

  const currentSemester = currentUser?.semester || 5;
  const currentCGPA = studentMarks.length > 0 
    ? studentMarks.reduce((sum, m) => sum + (m.totalMarks / 10), 0) / studentMarks.length 
    : 0;

  // Subject-wise performance
  const subjectPerformance = subjects.map(subject => {
    const subjectMark = studentMarks.find(m => m.subjectId === subject.id);
    const subjectAttendance = studentAttendance.filter(a => a.subjectId === subject.id);
    const subjectAttendancePercentage = subjectAttendance.length > 0 
      ? Math.round((subjectAttendance.filter(a => a.status === 'present').length / subjectAttendance.length) * 100)
      : 0;
    
    return {
      name: subject.code,
      marks: subjectMark?.totalMarks || 0,
      attendance: subjectAttendancePercentage
    };
  });

  // Grade distribution
  const gradeDistribution = [
    { name: 'A+', value: studentMarks.filter(m => m.grade === 'A+').length, color: '#10B981' },
    { name: 'A', value: studentMarks.filter(m => m.grade === 'A').length, color: '#3B82F6' },
    { name: 'B+', value: studentMarks.filter(m => m.grade === 'B+').length, color: '#8B5CF6' },
    { name: 'B', value: studentMarks.filter(m => m.grade === 'B').length, color: '#F59E0B' },
    { name: 'C', value: studentMarks.filter(m => m.grade === 'C').length, color: '#EF4444' }
  ].filter(grade => grade.value > 0);

  const stats = [
    { title: 'Current CGPA', value: currentCGPA.toFixed(2), icon: Award, color: 'bg-green-500', change: '+0.2 from last sem' },
    { title: 'Attendance', value: `${attendancePercentage}%`, icon: ClipboardCheck, color: 'bg-blue-500', change: attendancePercentage >= 75 ? 'Good' : 'Needs Improvement' },
    { title: 'Average Marks', value: avgMarks.toFixed(1), icon: TrendingUp, color: 'bg-purple-500', change: avgMarks >= 80 ? 'Excellent' : avgMarks >= 60 ? 'Good' : 'Needs Focus' },
    { title: 'Current Semester', value: currentSemester.toString(), icon: BookOpen, color: 'bg-indigo-500', change: 'Active' }
  ];

  const recentNotices = notices.slice(0, 3);
  const myGrievances = grievances.filter(g => g.studentId === currentUser?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="opacity-90">Here's your academic progress and updates for Semester {currentSemester}.</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Roll: {currentUser?.rollNumber}</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Department: {currentUser?.department}</span>
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#3B82F6" name="Marks" />
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
              <p>No grades available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* My Grievances */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Grievances</h3>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {myGrievances.length > 0 ? (
              myGrievances.slice(0, 3).map(grievance => (
                <div key={grievance.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{grievance.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{grievance.description.substring(0, 60)}...</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      grievance.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      grievance.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grievance.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No grievances submitted</p>
            )}
          </div>
        </div>
      </div>

      {/* Academic Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mid-term Exams</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Feb 15 - Feb 25</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Assignment Due</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Jan 30, 2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Result Declaration</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mar 10, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;