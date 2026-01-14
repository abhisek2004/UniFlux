import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-lg">
        <div className="text-9xl font-bold text-gray-300 dark:text-gray-700 mb-4">404</div>
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
          The page you're looking for doesn't exist or you don't have access to it.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7m-7 7h18"></path>
            </svg>
            Go to Home
          </Link>
          
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Back to Login
          </Link>
        </div>
        
        <p className="mt-8 text-gray-500 dark:text-gray-500 text-sm">
          If you believe this is an error, please contact your system administrator.
        </p>
      </div>
    </div>
  );
};

export default NotFound;