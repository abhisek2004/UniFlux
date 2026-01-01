import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, GraduationCap, BookOpen, TrendingUp, Award, UserCheck, Settings, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const HODDashboard: React.FC = () => {
  const { currentUser, students, teachers, subjects, attendance, marks, grievances, notices } = useApp();

  // Filter data for current department
  const departmentStudents = students.filter(s => s.department === currentUser?.department);
  const departmentTeachers = teachers.filter(t => t.department === currentUser?.department);
  const departmentSubjects = subjects.filter(s => s.department === currentUser?.department);

  // Calculate department statistics
  const totalStudents = departmentStudents.length;
  const totalTeachers = departmentTeachers.length;
  const totalSubjects = departmentSubjects.length;
  
  const departmentAttendance = attendance.filter(a => 
    departmentSubjects.some(s => s.id === a.subjectId)
  );
  const totalAttendanceRecords = departmentAttendance.length;
  const presentRecords = departmentAttendance.filter(a => a.status === 'present').length;
  const attendancePercentage = totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;

  const departmentMarks = marks.filter(m => 
    departmentStudents.some(s => s.id === m.studentId)
  );
  const avgCGPA = departmentStudents.reduce((sum, s) => sum + (s.cgpa || 0), 0) / departmentStudents.length;
  const passedStudents = departmentMarks.filter(m => m.totalMarks >= 40).length / departmentSubjects.length;
  const passPercentage = departmentStudents.length > 0 ? Math.round((passedStudents / departmentStudents.length) * 100) : 0;

  // Subject-wise performance
  const subjectPerformance = departmentSubjects.map(subject => {
    const subjectMarks = departmentMarks.filter(m => m.subjectId === subject.id);
    const avgMarks = subjectMarks.length > 0 
      ? subjectMarks.reduce((sum, m) => sum + m.totalMarks, 0) / subjectMarks.length 
      : 0;
    
    return {
      name: subject.code,
      avgMarks: Math.round(avgMarks),
      students: subjectMarks.length,
      teacher: subject.teacherName
    };
  });

  // Grade distribution
  const gradeDistribution = [
    { name: 'A+', value: departmentMarks.filter(m => m.grade === 'A+').length, color: '#10B981' },
    { name: 'A', value: departmentMarks.filter(m => m.grade === 'A').length, color: '#3B82F6' },
    { name: 'B+', value: departmentMarks.filter(m => m.grade === 'B+').length, color: '#8B5CF6' },
    { name: 'B', value: departmentMarks.filter(m => m.grade === 'B').length, color: '#F59E0B' },
    { name: 'C', value: departmentMarks.filter(m => m.grade === 'C').length, color: '#EF4444' },
    { name: 'F', value: departmentMarks.filter(m => m.grade === 'F').length, color: '#6B7280' }
  ].filter(grade => grade.value > 0);

  // Performance trend (mock data)
  const performanceTrend = [
    { month: 'Sep', average: 78, attendance: 82 },
    { month: 'Oct', average: 82, attendance: 85 },
    { month: 'Nov', average: 79, attendance: 80 },
    { month: 'Dec', average: 85, attendance: 88 },
    { month: 'Jan', average: 87, attendance: 90 }
  ];

  const stats = [
    { title: 'Total Students', value: totalStudents, icon: Users, color: 'bg-blue-500', change: '+5%' },
    { title: 'Total Teachers', value: totalTeachers, icon: GraduationCap, color: 'bg-green-500', change: '+2%' },
    { title: 'Total Subjects', value: totalSubjects, icon: BookOpen, color: 'bg-purple-500', change: '0%' },
    { title: 'Avg Attendance', value: `${attendancePercentage}%`, icon: UserCheck, color: 'bg-yellow-500', change: '+3%' },
    { title: 'Avg CGPA', value: avgCGPA.toFixed(2), icon: Award, color: 'bg-indigo-500', change: '+0.2' },
    { title: 'Pass Rate', value: `${passPercentage}%`, icon: TrendingUp, color: 'bg-red-500', change: '+8%' }
  ];

  const pendingGrievances = grievances.filter(g => g.status === 'pending').length;
  const departmentNotices = notices.filter(n => n.department === currentUser?.department || n.department === 'All');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="opacity-90">Department overview and management dashboard for {currentUser?.department} Department.</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Department: {currentUser?.department}</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Role: Head of Department</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
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
              <Bar dataKey="avgMarks" fill="#3B82F6" name="Average Marks" />
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

        {/* Performance Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="average" stroke="#3B82F6" strokeWidth={3} name="Average Marks" />
              <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={3} name="Attendance %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teachers Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Teachers</h3>
          <div className="space-y-3">
            {departmentTeachers.map(teacher => {
              const teacherSubjects = departmentSubjects.filter(s => s.teacherId === teacher.id);
              return (
                <div key={teacher.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{teacher.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {teacher.email} • {teacherSubjects.length} subjects
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {teacherSubjects.map(s => s.code).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions & Alerts</h3>
          <div className="space-y-4">
            {/* Pending Grievances Alert */}
            {pendingGrievances > 0 && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      {pendingGrievances} Pending Grievances
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-300">Requires immediate attention</p>
                  </div>
                </div>
              </div>
            )}

            {/* Low Attendance Alert */}
            {attendancePercentage < 75 && (
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Low Department Attendance
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-300">Current: {attendancePercentage}% (Target: 75%)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <Settings className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-800 dark:text-blue-200">Settings</p>
              </button>
              <button className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-800 dark:text-green-200">Reports</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Department Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">New student enrollment</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">5 new students joined {currentUser?.department} Department</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Results approved</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Semester 5 results approved for publication</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">New subject assigned</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Advanced Algorithms assigned to Prof. Kumar</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;