import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Users, Search, Filter, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

const AttendanceManagement: React.FC = () => {
  const { currentUser, students, subjects, attendance, markAttendance } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'mark' | 'view'>('mark');

  // Filter subjects based on user role
  const availableSubjects = currentUser?.role === 'teacher' 
    ? subjects.filter(s => s.teacherId === currentUser.id)
    : subjects;

  // Filter students based on current user role
  const availableStudents = currentUser?.role === 'student' 
    ? students.filter(s => s.id === currentUser.id)
    : students;

  const filteredStudents = availableStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get attendance for selected date and subject
  const getAttendanceStatus = (studentId: string, subjectId: string, date: string) => {
    const record = attendance.find(a => 
      a.studentId === studentId && 
      a.subjectId === subjectId && 
      a.date === date
    );
    return record?.status || null;
  };

  // Calculate attendance statistics
  const calculateAttendanceStats = (studentId: string, subjectId?: string) => {
    const studentAttendance = attendance.filter(a => {
      if (subjectId) {
        return a.studentId === studentId && a.subjectId === subjectId;
      }
      return a.studentId === studentId;
    });
    
    const totalClasses = studentAttendance.length;
    const presentClasses = studentAttendance.filter(a => a.status === 'present').length;
    const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    
    return { totalClasses, presentClasses, percentage };
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    if (selectedSubject) {
      markAttendance(studentId, selectedSubject, selectedDate, status);
    }
  };

  const exportAttendance = () => {
    // Implementation for exporting attendance to Excel
    console.log('Exporting attendance data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage student attendance</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('mark')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'mark' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setViewMode('view')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'view' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            View Reports
          </button>
          <button
            onClick={exportAttendance}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          
          {(currentUser?.role === 'teacher' || currentUser?.role === 'hod' || currentUser?.role === 'superadmin') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Subject</option>
                {availableSubjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Students
            </label>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'mark' ? (
        /* Mark Attendance View */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Mark Attendance - {selectedDate}
              {selectedSubject && (
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                  ({availableSubjects.find(s => s.id === selectedSubject)?.name})
                </span>
              )}
            </h3>
          </div>
          
          {selectedSubject || currentUser?.role === 'student' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    {currentUser?.role !== 'student' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map(student => {
                    const status = getAttendanceStatus(student.id, selectedSubject || subjects[0]?.id, selectedDate);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {status ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              status === 'present' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {status === 'present' ? 'Present' : 'Absent'}
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Not Marked
                            </span>
                          )}
                        </td>
                        {currentUser?.role !== 'student' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'present')}
                                className={`p-2 rounded-lg transition-colors ${
                                  status === 'present' 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                                }`}
                                title="Mark Present"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleAttendanceChange(student.id, 'absent')}
                                className={`p-2 rounded-lg transition-colors ${
                                  status === 'absent' 
                                    ? 'bg-red-100 text-red-600' 
                                    : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600'
                                }`}
                                title="Mark Absent"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select a Subject</h3>
              <p className="text-gray-500 dark:text-gray-400">Please select a subject to mark attendance</p>
            </div>
          )}
        </div>
      ) : (
        /* View Reports */
        <div className="space-y-6">
          {/* Attendance Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Attendance</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) || 0}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Classes</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendance.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Present Today</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {attendance.filter(a => a.date === selectedDate && a.status === 'present').length}
              </p>
            </div>
          </div>

          {/* Student Attendance Report */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Attendance Report</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total Classes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Present
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Absent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Percentage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map(student => {
                    const stats = calculateAttendanceStats(student.id, selectedSubject);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-medium text-xs">
                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {student.rollNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {stats.totalClasses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {stats.presentClasses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {stats.totalClasses - stats.presentClasses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            stats.percentage >= 75 ? 'bg-green-100 text-green-800' :
                            stats.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {stats.percentage}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;