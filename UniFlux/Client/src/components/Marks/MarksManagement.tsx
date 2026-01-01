import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Search, Download, Edit2, Save, X, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

const MarksManagement: React.FC = () => {
  const { currentUser, students, subjects, marks, updateMarks } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [editingMark, setEditingMark] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ internal: 0, external: 0 });
  const [viewMode, setViewMode] = useState<'entry' | 'results'>('entry');

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

  // Get marks for a specific student and subject
  const getStudentMarks = (studentId: string, subjectId: string) => {
    return marks.find(m => m.studentId === studentId && m.subjectId === subjectId);
  };

  // Calculate grade based on total marks
  const calculateGrade = (totalMarks: number) => {
    if (totalMarks >= 90) return 'A+';
    if (totalMarks >= 80) return 'A';
    if (totalMarks >= 70) return 'B+';
    if (totalMarks >= 60) return 'B';
    if (totalMarks >= 50) return 'C';
    if (totalMarks >= 40) return 'D';
    return 'F';
  };

  const handleEditStart = (studentId: string, subjectId: string) => {
    const mark = getStudentMarks(studentId, subjectId);
    setEditingMark(`${studentId}-${subjectId}`);
    setEditValues({
      internal: mark?.internalMarks || 0,
      external: mark?.externalMarks || 0
    });
  };

  const handleEditSave = (studentId: string, subjectId: string) => {
    updateMarks(studentId, subjectId, editValues.internal, editValues.external);
    setEditingMark(null);
  };

  const handleEditCancel = () => {
    setEditingMark(null);
    setEditValues({ internal: 0, external: 0 });
  };

  // Generate PDF marksheet for a student
  const generateMarksheet = (student: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('CAMPUSCORE UNIVERSITY', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text('Semester Grade Sheet - 2025', 105, 30, { align: 'center' });
    
    // Student Info
    doc.setFontSize(12);
    doc.text(`Name: ${student.name}`, 20, 50);
    doc.text(`Roll Number: ${student.rollNumber}`, 20, 60);
    doc.text(`Registration No: ${student.registrationNo}`, 20, 70);
    doc.text(`Department: ${student.department}`, 20, 80);
    doc.text(`Semester: ${student.semester}`, 20, 90);
    
    // Table header
    doc.text('Subject', 20, 110);
    doc.text('Internal', 80, 110);
    doc.text('External', 110, 110);
    doc.text('Total', 140, 110);
    doc.text('Grade', 170, 110);
    
    // Draw line
    doc.line(20, 115, 190, 115);
    
    // Student marks
    let yPos = 125;
    let totalMarks = 0;
    let totalSubjects = 0;
    
    subjects.forEach(subject => {
      const studentMark = marks.find(m => m.studentId === student.id && m.subjectId === subject.id);
      if (studentMark) {
        doc.text(subject.code, 20, yPos);
        doc.text(studentMark.internalMarks.toString(), 80, yPos);
        doc.text(studentMark.externalMarks.toString(), 110, yPos);
        doc.text(studentMark.totalMarks.toString(), 140, yPos);
        doc.text(studentMark.grade, 170, yPos);
        
        totalMarks += studentMark.totalMarks;
        totalSubjects++;
        yPos += 10;
      }
    });
    
    // Summary
    doc.line(20, yPos, 190, yPos);
    yPos += 15;
    const cgpa = totalSubjects > 0 ? (totalMarks / (totalSubjects * 10)).toFixed(2) : '0.00';
    doc.text(`CGPA: ${cgpa}`, 20, yPos);
    doc.text(`Result: ${totalMarks >= (totalSubjects * 40) ? 'PASS' : 'FAIL'}`, 20, yPos + 10);
    
    // Footer
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos + 30);
    doc.text('Principal Signature: ________________', 120, yPos + 30);
    
    doc.save(`${student.name}_Marksheet.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marks & Results</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage student marks and generate results</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setViewMode('entry')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'entry' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Marks Entry
          </button>
          <button
            onClick={() => setViewMode('results')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'results' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            View Results
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <option value="">All Subjects</option>
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

      {viewMode === 'entry' ? (
        /* Marks Entry View */
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marks Entry</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Internal (30)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    External (70)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Grade
                  </th>
                  {currentUser?.role !== 'student' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map(student => 
                  (selectedSubject ? [selectedSubject] : availableSubjects.map(s => s.id)).map(subjectId => {
                    const subject = subjects.find(s => s.id === subjectId);
                    const mark = getStudentMarks(student.id, subjectId);
                    const isEditing = editingMark === `${student.id}-${subjectId}`;
                    
                    if (!subject) return null;
                    
                    return (
                      <tr key={`${student.id}-${subjectId}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
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
                          {subject.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={editValues.internal}
                              onChange={(e) => setEditValues({...editValues, internal: parseInt(e.target.value) || 0})}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                          ) : (
                            mark?.internalMarks || '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {isEditing ? (
                            <input
                              type="number"
                              min="0"
                              max="70"
                              value={editValues.external}
                              onChange={(e) => setEditValues({...editValues, external: parseInt(e.target.value) || 0})}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                          ) : (
                            mark?.externalMarks || '-'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {isEditing ? editValues.internal + editValues.external : mark?.totalMarks || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {mark ? (
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              mark.grade === 'A+' || mark.grade === 'A' ? 'bg-green-100 text-green-800' :
                              mark.grade === 'B+' || mark.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              mark.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {isEditing ? calculateGrade(editValues.internal + editValues.external) : mark.grade}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        {currentUser?.role !== 'student' && (
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {isEditing ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditSave(student.id, subjectId)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Save"
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={handleEditCancel}
                                  className="text-red-600 hover:text-red-800"
                                  title="Cancel"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEditStart(student.id, subjectId)}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="Edit Marks"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Students</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredStudents.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pass Rate</h3>
              <p className="text-2xl font-bold text-green-600">
                {Math.round((marks.filter(m => m.totalMarks >= 40).length / marks.length) * 100) || 0}%
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Marks</h3>
              <p className="text-2xl font-bold text-blue-600">
                {marks.length > 0 ? (marks.reduce((sum, m) => sum + m.totalMarks, 0) / marks.length).toFixed(1) : '0'}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Scorers</h3>
              <p className="text-2xl font-bold text-purple-600">
                {marks.filter(m => m.grade === 'A+').length}
              </p>
            </div>
          </div>

          {/* Student Results */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Student Results</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      CGPA
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.map(student => {
                    const studentMarks = marks.filter(m => m.studentId === student.id);
                    const totalMarks = studentMarks.reduce((sum, m) => sum + m.totalMarks, 0);
                    const cgpa = studentMarks.length > 0 ? (totalMarks / (studentMarks.length * 10)).toFixed(2) : '0.00';
                    const isPassed = studentMarks.every(m => m.totalMarks >= 40);
                    
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
                                {student.rollNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-lg font-bold ${
                            parseFloat(cgpa) >= 9.0 ? 'text-green-600' :
                            parseFloat(cgpa) >= 8.0 ? 'text-blue-600' :
                            parseFloat(cgpa) >= 7.0 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {cgpa}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {isPassed ? 'PASS' : 'FAIL'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => generateMarksheet(student)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                              title="Download Marksheet"
                            >
                              <FileText className="h-4 w-4" />
                              <span>PDF</span>
                            </button>
                          </div>
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

export default MarksManagement;