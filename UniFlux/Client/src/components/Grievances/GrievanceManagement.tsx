import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Plus, Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const GrievanceManagement: React.FC = () => {
  const { currentUser, grievances, addGrievance, updateGrievance, students } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Filter grievances based on user role
  const filteredGrievances = grievances.filter(grievance => {
    // Role-based filtering
    if (currentUser?.role === 'student') {
      if (grievance.studentId !== currentUser.id) return false;
    }
    
    // Search filter
    if (searchTerm && !grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !grievance.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && grievance.status !== statusFilter) {
      return false;
    }
    
    // Priority filter
    if (priorityFilter !== 'all' && grievance.priority !== priorityFilter) {
      return false;
    }
    
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role === 'student') {
      addGrievance({
        studentId: currentUser.id,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: 'pending'
      });
      setFormData({ title: '', description: '', priority: 'medium' });
      setShowForm(false);
    }
  };

  const handleStatusUpdate = (grievanceId: string, status: 'pending' | 'in-progress' | 'resolved', response?: string) => {
    const updates: any = { status };
    if (status === 'resolved') {
      updates.resolvedAt = new Date().toISOString();
      if (response) {
        updates.response = response;
      }
    }
    updateGrievance(grievanceId, updates);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const stats = [
    { 
      title: 'Total Grievances', 
      value: filteredGrievances.length, 
      icon: MessageSquare, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Pending', 
      value: filteredGrievances.filter(g => g.status === 'pending').length, 
      icon: Clock, 
      color: 'bg-red-500' 
    },
    { 
      title: 'In Progress', 
      value: filteredGrievances.filter(g => g.status === 'in-progress').length, 
      icon: AlertCircle, 
      color: 'bg-yellow-500' 
    },
    { 
      title: 'Resolved', 
      value: filteredGrievances.filter(g => g.status === 'resolved').length, 
      icon: CheckCircle, 
      color: 'bg-green-500' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grievance Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentUser?.role === 'student' 
              ? 'Submit and track your grievances'
              : 'Manage and resolve student grievances'
            }
          </p>
        </div>
        {currentUser?.role === 'student' && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Submit Grievance</span>
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search grievances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grievances List */}
      <div className="space-y-4">
        {filteredGrievances.map(grievance => (
          <div key={grievance.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {grievance.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(grievance.status)}`}>
                    {grievance.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(grievance.priority)}`}>
                    {grievance.priority.toUpperCase()}
                  </span>
                </div>
                
                {currentUser?.role !== 'student' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Student: {getStudentName(grievance.studentId)}
                  </p>
                )}
                
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {grievance.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Submitted: {format(new Date(grievance.createdAt), 'MMM dd, yyyy')}</span>
                  {grievance.resolvedAt && (
                    <span>Resolved: {format(new Date(grievance.resolvedAt), 'MMM dd, yyyy')}</span>
                  )}
                </div>
                
                {grievance.response && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Response:</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">{grievance.response}</p>
                  </div>
                )}
              </div>
              
              {(currentUser?.role === 'hod' || currentUser?.role === 'superadmin') && grievance.status !== 'resolved' && (
                <div className="ml-4 flex flex-col space-y-2">
                  {grievance.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(grievance.id, 'in-progress')}
                      className="px-3 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                    >
                      Start Progress
                    </button>
                  )}
                  <button
                    onClick={() => {
                      const response = prompt('Enter resolution response:');
                      if (response) {
                        handleStatusUpdate(grievance.id, 'resolved', response);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredGrievances.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Grievances Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {currentUser?.role === 'student' 
                ? "You haven't submitted any grievances yet."
                : "No grievances match your current filters."
              }
            </p>
          </div>
        )}
      </div>

      {/* Submit Grievance Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowForm(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Submit New Grievance
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Brief title for your grievance"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Detailed description of your grievance"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Submit Grievance
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceManagement;