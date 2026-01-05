import React from 'react';
import { User, GraduationCap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Select Your Role
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Choose the role that best describes you
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4">
            {/* Student Role */}
            <Link 
              to="/register/student"
              className="text-left p-4 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              <div className="mr-3 p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">Student</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Register as a student</div>
              </div>
            </Link>

            {/* Teacher Role */}
            <Link 
              to="/register/teacher"
              className="text-left p-4 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              <div className="mr-3 p-2 bg-green-100 dark:bg-green-900 rounded-md">
                <User className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">Teacher</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Register as a teacher</div>
              </div>
            </Link>

            {/* HOD Role */}
            <Link 
              to="/register/hod"
              className="text-left p-4 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
            >
              <div className="mr-3 p-2 bg-purple-100 dark:bg-purple-900 rounded-md">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="font-medium text-sm text-gray-900 dark:text-white">HOD</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Register as Head of Department</div>
              </div>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Super Admin?{' '}
              <Link to="/superadmin" className="font-medium text-primary-600 hover:text-primary-500">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;