import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Eye, EyeOff, GraduationCap, AlertCircle } from 'lucide-react';

const LoginForm: React.FC = () => {
  const { login } = useApp();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!formData.email) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const isValid = validateForm();

    if (!isValid) {
      if (!formData.email || !formData.password) {
        showToast('error', 'Action Required', 'Please enter the credentials before sign in');
      } else {
        showToast('error', 'Action Required', 'Please fix the errors in the form before submitting.');
      }
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      showToast('error', 'Error Occurred', 'An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of the component ...

  const demoCredentials = [
    { role: 'Super Admin', email: 'superadmin@campuscore.in', password: 'admin123' },
    { role: 'HOD', email: 'hod.cse@campuscore.in', password: 'hod123' },
    { role: 'Teacher', email: 'rahul@campuscore.in', password: 'teacher123' },
    { role: 'Student', email: 'amit@campuscore.in', password: 'student123' }
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ ...formData, email, password });
    setFormErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to CampusCore
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            University Management System
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
                      ${formErrors.email
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'
                      }
                    `}
                    placeholder="Enter your email"
                  />
                  {formErrors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (formErrors.password) setFormErrors({ ...formErrors, password: undefined });
                    }}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors
                      ${formErrors.password
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-700 dark:text-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white'
                      }
                    `}
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {formErrors.password && (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {formErrors.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {formErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </div>
        </form>
        
        {/* Role Selection Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need to register?{' '}
            <a href="/role-selection" className="font-medium text-primary-600 hover:text-primary-500">
              Select your role
            </a>
          </p>
        </div>


        {/* Demo Credentials */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Demo Credentials</h3>
          <div className="grid grid-cols-1 gap-3">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                className="text-left p-3 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900 dark:text-white">{cred.role}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{cred.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;