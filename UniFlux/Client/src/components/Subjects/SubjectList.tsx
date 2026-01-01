import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus, Edit2, Eye, Download, Filter, BookOpen, User, Award } from 'lucide-react';
import SubjectForm from './SubjectForm';
import { Subject } from '../../types';

const SubjectList: React.FC = () => {
  const { subjects, teachers, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [filterSemester, setFilterSemester] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === 'all' || subject.semester.toString() === filterSemester;
    const matchesDepartment = filterDepartment === 'all' || subject.department === filterDepartment;
    return matchesSearch && matchesSemester && matchesDepartment;
  });

  const handleEdit = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedSubject(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedSubject(null);
  };

  const canEdit = currentUser?.role === 'superadmin' || currentUser?.role === 'hod';

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Unassigned';
  };

  const departments = ['CSE', 'ECE', 'ME', 'CE', 'EE'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subjects</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage course subjects and assignments</p>
        </div>
        {canEdit && (
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Subject</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subjects by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Subjects</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjects.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Credits</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {subjects.reduce((sum, s) => sum + s.credits, 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Semester 5</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {subjects.filter(s => s.semester === 5).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Credits</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {subjects.length > 0 ? (subjects.reduce((sum, s) => sum + s.credits, 0) / subjects.length).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* Subjects List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSubjects.map((subject) => (
                <React.Fragment key={subject.id}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {subject.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {subject.department} Department
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {subject.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Semester {subject.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {subject.credits}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1 text-sm text-gray-900 dark:text-white">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{getTeacherName(subject.teacherId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setShowDetails(showDetails === subject.id ? null : subject.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(subject)}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                            title="Edit Subject"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="text-green-600 hover:text-green-800 transition-colors"
                          title="Download Syllabus"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {showDetails === subject.id && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Subject Information</h4>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <p><span className="font-medium">Code:</span> {subject.code}</p>
                              <p><span className="font-medium">Name:</span> {subject.name}</p>
                              <p><span className="font-medium">Department:</span> {subject.department}</p>
                              <p><span className="font-medium">Semester:</span> {subject.semester}</p>
                              <p><span className="font-medium">Credits:</span> {subject.credits}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Teaching Information</h4>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <p><span className="font-medium">Assigned Teacher:</span> {getTeacherName(subject.teacherId)}</p>
                              <p><span className="font-medium">Subject Type:</span> Core</p>
                              <p><span className="font-medium">Assessment:</span> Internal + External</p>
                              <p><span className="font-medium">Max Marks:</span> 100 (30 + 70)</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Form Modal */}
      {showForm && (
        <SubjectForm
          subject={selectedSubject}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default SubjectList;