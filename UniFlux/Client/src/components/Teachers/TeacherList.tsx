import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Search, Plus, Edit2, Eye, Download, Filter, GraduationCap, BookOpen, Mail, Trash2 } from 'lucide-react';
import TeacherForm from './TeacherForm';
import { Teacher } from '../../types';

const TeacherList: React.FC = () => {
  const { teachers, subjects, currentUser, deleteTeacher } = useApp();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      deleteTeacher(id);
      showToast('success', 'Teacher Deleted', 'Teacher record has been successfully deleted.');
    }
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || teacher.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowForm(true);
  };

  const handleAdd = () => {
    setSelectedTeacher(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedTeacher(null);
  };

  const canEdit = currentUser?.role === 'superadmin' || currentUser?.role === 'hod';

  const getTeacherSubjects = (teacherId: string) => {
    return subjects.filter(s => s.teacherId === teacherId);
  };

  const departments = ['CSE', 'ECE', 'ME', 'CE', 'EE'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage faculty information and assignments</p>
        </div>
        {canEdit && (
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Teacher</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teachers by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{teachers.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">CSE Department</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {teachers.filter(t => t.department === 'CSE').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Subjects</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{subjects.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Load</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {teachers.length > 0 ? Math.round(subjects.length / teachers.length) : 0} subjects
          </p>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subjects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTeachers.map((teacher) => {
                const teacherSubjects = getTeacherSubjects(teacher.id);
                return (
                  <React.Fragment key={teacher.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {teacher.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Faculty ID: T{teacher.id.padStart(3, '0')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {teacher.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span>{teacherSubjects.length} subjects</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                          <Mail className="h-4 w-4" />
                          <span>{teacher.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowDetails(showDetails === teacher.id ? null : teacher.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors"
                              title="Edit Teacher"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Download Report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          {canEdit && (
                            <button
                              onClick={() => handleDelete(teacher.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Delete Teacher"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {
                      showDetails === teacher.id && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Personal Information</h4>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  <p><span className="font-medium">Email:</span> {teacher.email}</p>
                                  <p><span className="font-medium">Department:</span> {teacher.department}</p>
                                  <p><span className="font-medium">Faculty ID:</span> T{teacher.id.padStart(3, '0')}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Assigned Subjects</h4>
                                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                  {teacherSubjects.length > 0 ? (
                                    teacherSubjects.map(subject => (
                                      <p key={subject.id}>
                                        <span className="font-medium">{subject.code}:</span> {subject.name} (Sem {subject.semester})
                                      </p>
                                    ))
                                  ) : (
                                    <p>No subjects assigned</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    }
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Form Modal */}
      {
        showForm && (
          <TeacherForm
            teacher={selectedTeacher}
            onClose={closeForm}
          />
        )
      }
    </div >
  );
};

export default TeacherList;