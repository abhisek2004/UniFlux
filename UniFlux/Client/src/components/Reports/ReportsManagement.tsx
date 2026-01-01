import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, Calendar, Users, Award, TrendingUp, FileText, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import jsPDF from 'jspdf';

const ReportsManagement: React.FC = () => {
  const { students, teachers, subjects, attendance, marks, currentUser } = useApp();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-01-31'
  });

  // Calculate comprehensive statistics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalSubjects = subjects.length;
  
  const totalAttendanceRecords = attendance.length;
  const presentRecords = attendance.filter(a => a.status === 'present').length;
  const overallAttendance = totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;
  
  const avgCGPA = students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length;
  const passedStudents = marks.filter(m => m.totalMarks >= 40).length;
  const totalMarksRecords = marks.length;
  const passPercentage = totalMarksRecords > 0 ? Math.round((passedStudents / totalMarksRecords) * 100) : 0;

  // Department-wise data
  const departmentData = [
    { 
      name: 'CSE', 
      students: students.filter(s => s.department === 'CSE').length,
      teachers: teachers.filter(t => t.department === 'CSE').length,
      subjects: subjects.filter(s => s.department === 'CSE').length,
      avgCGPA: students.filter(s => s.department === 'CSE').reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.filter(s => s.department === 'CSE').length || 0
    },
    { 
      name: 'ECE', 
      students: 0,
      teachers: 0,
      subjects: 0,
      avgCGPA: 0
    },
    { 
      name: 'ME', 
      students: 0,
      teachers: 0,
      subjects: 0,
      avgCGPA: 0
    }
  ];

  // Grade distribution
  const gradeDistribution = [
    { name: 'A+', value: marks.filter(m => m.grade === 'A+').length, color: '#10B981' },
    { name: 'A', value: marks.filter(m => m.grade === 'A').length, color: '#3B82F6' },
    { name: 'B+', value: marks.filter(m => m.grade === 'B+').length, color: '#8B5CF6' },
    { name: 'B', value: marks.filter(m => m.grade === 'B').length, color: '#F59E0B' },
    { name: 'C', value: marks.filter(m => m.grade === 'C').length, color: '#EF4444' },
    { name: 'F', value: marks.filter(m => m.grade === 'F').length, color: '#6B7280' }
  ].filter(grade => grade.value > 0);

  // Subject-wise performance
  const subjectPerformance = subjects.map(subject => {
    const subjectMarks = marks.filter(m => m.subjectId === subject.id);
    const avgMarks = subjectMarks.length > 0 
      ? subjectMarks.reduce((sum, m) => sum + m.totalMarks, 0) / subjectMarks.length 
      : 0;
    
    const subjectAttendance = attendance.filter(a => a.subjectId === subject.id);
    const attendancePercentage = subjectAttendance.length > 0 
      ? Math.round((subjectAttendance.filter(a => a.status === 'present').length / subjectAttendance.length) * 100)
      : 0;
    
    return {
      name: subject.code,
      avgMarks: Math.round(avgMarks),
      attendance: attendancePercentage,
      students: subjectMarks.length,
      passRate: subjectMarks.length > 0 ? Math.round((subjectMarks.filter(m => m.totalMarks >= 40).length / subjectMarks.length) * 100) : 0
    };
  });

  // Monthly performance trend
  const performanceTrend = [
    { month: 'Sep', attendance: 78, avgMarks: 75, enrollment: 95 },
    { month: 'Oct', attendance: 82, avgMarks: 78, enrollment: 98 },
    { month: 'Nov', attendance: 79, avgMarks: 80, enrollment: 97 },
    { month: 'Dec', attendance: 85, avgMarks: 82, enrollment: 99 },
    { month: 'Jan', attendance: overallAttendance, avgMarks: Math.round(marks.reduce((sum, m) => sum + m.totalMarks, 0) / marks.length) || 0, enrollment: 100 }
  ];

  // Student performance categories
  const studentCategories = [
    { name: 'Excellent (9.0+)', count: students.filter(s => (s.cgpa || 0) >= 9.0).length, color: '#10B981' },
    { name: 'Good (8.0-8.9)', count: students.filter(s => (s.cgpa || 0) >= 8.0 && (s.cgpa || 0) < 9.0).length, color: '#3B82F6' },
    { name: 'Average (7.0-7.9)', count: students.filter(s => (s.cgpa || 0) >= 7.0 && (s.cgpa || 0) < 8.0).length, color: '#F59E0B' },
    { name: 'Below Average (<7.0)', count: students.filter(s => (s.cgpa || 0) < 7.0).length, color: '#EF4444' }
  ];

  // Generate comprehensive PDF report
  const generatePDFReport = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('CAMPUSCORE UNIVERSITY', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Comprehensive Academic Report - 2025', 105, 30, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });
    
    // Overview Statistics
    doc.setFontSize(14);
    doc.text('OVERVIEW STATISTICS', 20, 60);
    doc.setFontSize(10);
    doc.text(`Total Students: ${totalStudents}`, 20, 75);
    doc.text(`Total Teachers: ${totalTeachers}`, 20, 85);
    doc.text(`Total Subjects: ${totalSubjects}`, 20, 95);
    doc.text(`Overall Attendance: ${overallAttendance}%`, 20, 105);
    doc.text(`Average CGPA: ${avgCGPA.toFixed(2)}`, 20, 115);
    doc.text(`Pass Percentage: ${passPercentage}%`, 20, 125);
    
    // Department Statistics
    doc.setFontSize(14);
    doc.text('DEPARTMENT STATISTICS', 20, 145);
    doc.setFontSize(10);
    let yPos = 160;
    departmentData.forEach(dept => {
      doc.text(`${dept.name}: ${dept.students} students, ${dept.teachers} teachers, Avg CGPA: ${dept.avgCGPA.toFixed(2)}`, 20, yPos);
      yPos += 10;
    });
    
    // Subject Performance
    doc.setFontSize(14);
    doc.text('SUBJECT PERFORMANCE', 20, yPos + 15);
    doc.setFontSize(8);
    doc.text('Subject', 20, yPos + 30);
    doc.text('Avg Marks', 60, yPos + 30);
    doc.text('Attendance', 100, yPos + 30);
    doc.text('Pass Rate', 140, yPos + 30);
    
    yPos += 40;
    subjectPerformance.forEach(subject => {
      doc.text(subject.name, 20, yPos);
      doc.text(subject.avgMarks.toString(), 60, yPos);
      doc.text(`${subject.attendance}%`, 100, yPos);
      doc.text(`${subject.passRate}%`, 140, yPos);
      yPos += 10;
    });
    
    // Footer
    doc.text(`Report generated by: ${currentUser?.name}`, 20, 280);
    doc.text('CampusCore University Management System', 20, 290);
    
    doc.save('Academic_Report.pdf');
  };

  const reportTypes = [
    { id: 'overview', name: 'Overview Report', icon: BarChart3 },
    { id: 'attendance', name: 'Attendance Report', icon: Calendar },
    { id: 'academic', name: 'Academic Performance', icon: Award },
    { id: 'department', name: 'Department Analysis', icon: Users },
    { id: 'trends', name: 'Performance Trends', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive academic and administrative reports</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generatePDFReport}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Generate PDF</span>
          </button>
          <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {reportTypes.map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === type.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${
                  selectedReport === type.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                <p className={`text-sm font-medium ${
                  selectedReport === type.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {type.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Date
            </label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To Date
            </label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudents}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average CGPA</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgCGPA.toFixed(2)}</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{overallAttendance}%</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pass Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{passPercentage}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Department Overview</h3>
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
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
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
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'academic' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject-wise Performance</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgMarks" fill="#3B82F6" name="Average Marks" />
                <Bar dataKey="passRate" fill="#10B981" name="Pass Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Student Performance Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {studentCategories.map((category, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{category.name}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{category.count}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: category.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'trends' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attendance" stroke="#3B82F6" strokeWidth={3} name="Attendance %" />
              <Line type="monotone" dataKey="avgMarks" stroke="#10B981" strokeWidth={3} name="Average Marks" />
              <Line type="monotone" dataKey="enrollment" stroke="#F59E0B" strokeWidth={3} name="Enrollment %" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Detailed Statistics Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Metric
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Overall Attendance Rate
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {overallAttendance}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    overallAttendance >= 85 ? 'bg-green-100 text-green-800' :
                    overallAttendance >= 75 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {overallAttendance >= 85 ? 'Excellent' : overallAttendance >= 75 ? 'Good' : 'Needs Improvement'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  ↗ +3%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Average CGPA
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {avgCGPA.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    avgCGPA >= 8.5 ? 'bg-green-100 text-green-800' :
                    avgCGPA >= 7.5 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {avgCGPA >= 8.5 ? 'Excellent' : avgCGPA >= 7.5 ? 'Good' : 'Average'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  ↗ +0.2
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  Pass Percentage
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {passPercentage}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    passPercentage >= 90 ? 'bg-green-100 text-green-800' :
                    passPercentage >= 80 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {passPercentage >= 90 ? 'Excellent' : passPercentage >= 80 ? 'Good' : 'Needs Focus'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                  ↗ +5%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;