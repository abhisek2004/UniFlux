import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, GraduationCap, BookOpen, TrendingUp, Award, UserCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import SkeletonStats from '../Common/SkeletonStats';
import SkeletonCard from '../Common/SkeletonCard';

const SuperAdminDashboard: React.FC = () => {
  const { students, teachers, subjects, attendance, marks } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Simulate loading delay (in real app, this would be API calls)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsChartLoading(false);
    }, 1500); // 1.5 second loading simulation

    return () => clearTimeout(timer);
  }, []);

  // Calculate statistics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalSubjects = subjects.length;
  
  const totalAttendanceRecords = attendance.length;
  const presentRecords = attendance.filter(a => a.status === 'present').length;
  const attendancePercentage = totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;

  const passedStudents = marks.filter(m => m.totalMarks >= 40).length / 6; // Assuming 6 subjects per student
  const avgCGPA = students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length;

  // Chart data
  const departmentData = [
    { name: 'CSE', students: totalStudents, teachers: totalTeachers }
  ];

  const gradeDistribution = [
    { name: 'A+', value: marks.filter(m => m.grade === 'A+').length, color: '#10B981' },
    { name: 'A', value: marks.filter(m => m.grade === 'A').length, color: '#3B82F6' },
    { name: 'B+', value: marks.filter(m => m.grade === 'B+').length, color: '#8B5CF6' },
    { name: 'B', value: marks.filter(m => m.grade === 'B').length, color: '#F59E0B' },
    { name: 'C', value: marks.filter(m => m.grade === 'C').length, color: '#EF4444' }
  ];

  const performanceData = [
    { month: 'Sep', average: 78 },
    { month: 'Oct', average: 82 },
    { month: 'Nov', average: 79 },
    { month: 'Dec', average: 85 },
    { month: 'Jan', average: 87 }
  ];

  const stats = [
    { title: 'Total Students', value: totalStudents, icon: Users, color: 'bg-blue-500', change: '+5%' },
    { title: 'Total Teachers', value: totalTeachers, icon: GraduationCap, color: 'bg-green-500', change: '+2%' },
    { title: 'Total Subjects', value: totalSubjects, icon: BookOpen, color: 'bg-purple-500', change: '0%' },
    { title: 'Avg Attendance', value: `${attendancePercentage}%`, icon: UserCheck, color: 'bg-yellow-500', change: '+3%' },
    { title: 'Avg CGPA', value: avgCGPA.toFixed(2), icon: Award, color: 'bg-indigo-500', change: '+0.2' },
    { title: 'Pass Rate', value: `${Math.round((passedStudents / totalStudents) * 100)}%`, icon: TrendingUp, color: 'bg-red-500', change: '+8%' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section with Skeleton */}
      {isLoading ? (
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-7 w-64 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-96 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Super Admin!</h1>
          <p className="opacity-90">Here's what's happening at CampusCore University today.</p>
        </div>
      )}

      {/* Stats Grid with Skeleton */}
      {isLoading ? (
        <SkeletonStats count={6} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts Section with Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Statistics Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Overview</h3>
          {isChartLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#3B82F6" name="Students" />
                <Bar dataKey="teachers" fill="#10B981" name="Teachers" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Grade Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
          {isChartLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-64 h-64 bg-gray-100 dark:bg-gray-700 animate-pulse rounded-full"></div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Performance Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Average Performance Trend</h3>
          {isChartLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 animate-pulse rounded"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="average" stroke="#3B82F6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity with Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 animate-pulse">
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">New student registration</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Sneha Mehra joined CSE Department</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Results published</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Semester 5 results are now available</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">New subject added</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Advanced Data Structures course created</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;