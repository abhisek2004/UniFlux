import React from 'react';
import { FileText, Users, Shield, AlertTriangle, Scale, Clock } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
                <p className="text-green-100 mt-1">Agreement for using CampusCore services</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Effective Date */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Effective Date:</strong> January 1, 2025 | <strong>Last Updated:</strong> January 2025
              </p>
            </div>

            {/* Agreement */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Scale className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Agreement to Terms</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                By accessing and using the CampusCore University Management System, you accept and agree to be bound by 
                the terms and provision of this agreement. These Terms of Service govern your use of our platform and 
                all related services provided by CampusCore University.
              </p>
            </section>

            {/* User Accounts */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Accounts & Responsibilities</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">👤 Account Creation</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• You must provide accurate and complete information during registration</li>
                    <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
                    <li>• You must notify us immediately of any unauthorized use of your account</li>
                    <li>• One person may not maintain multiple accounts</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">🎯 Acceptable Use</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Use the platform only for legitimate academic and administrative purposes</li>
                    <li>• Respect the intellectual property rights of others</li>
                    <li>• Do not attempt to gain unauthorized access to any part of the system</li>
                    <li>• Report any security vulnerabilities or bugs to the administration</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Prohibited Activities */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prohibited Activities</h2>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                <p className="text-red-800 dark:text-red-200 mb-4 font-semibold">
                  The following activities are strictly prohibited:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">🚫 System Abuse</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Attempting to hack or compromise system security</li>
                      <li>• Using automated tools to access the platform</li>
                      <li>• Overloading servers with excessive requests</li>
                      <li>• Reverse engineering or decompiling software</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">📝 Content Violations</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Uploading malicious or harmful content</li>
                      <li>• Sharing false or misleading information</li>
                      <li>• Violating copyright or intellectual property rights</li>
                      <li>• Harassment or inappropriate communication</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Academic Integrity */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🎓 Academic Integrity</h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📚 Student Responsibilities</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Submit original work and properly cite sources</li>
                    <li>• Do not share assignment solutions or exam answers</li>
                    <li>• Report any academic misconduct you witness</li>
                    <li>• Follow all examination rules and procedures</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">👨‍🏫 Faculty Responsibilities</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Maintain confidentiality of student records</li>
                    <li>• Provide fair and unbiased evaluation</li>
                    <li>• Report grades accurately and on time</li>
                    <li>• Follow university policies and procedures</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data and Privacy */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data and Privacy</h2>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Your privacy is important to us. By using our services, you agree to:
                </p>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>Allow us to collect and process your academic data as outlined in our Privacy Policy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>Receive important notifications related to your academic progress</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>Have your data shared with authorized university personnel as needed</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-6 w-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Service Availability</h2>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We strive to provide reliable service, but please note:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Services may be temporarily unavailable for maintenance</li>
                  <li>• We are not liable for service interruptions beyond our control</li>
                  <li>• Critical maintenance will be announced in advance when possible</li>
                  <li>• Emergency maintenance may occur without prior notice</li>
                </ul>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⚠️ Termination</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  We reserve the right to terminate or suspend your account if you:
                </p>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Violate these Terms of Service</li>
                  <li>• Engage in prohibited activities</li>
                  <li>• Compromise system security or integrity</li>
                  <li>• Are no longer affiliated with the university</li>
                </ul>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📝 Changes to Terms</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon 
                  posting. Your continued use of the service after changes are posted constitutes acceptance of the 
                  new terms.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📞 Contact Information</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  For questions about these Terms of Service, contact:
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email: legal@campuscore.edu | Phone: +1 (555) 123-4567
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;