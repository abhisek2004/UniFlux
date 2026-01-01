import React from 'react';
import { Shield, Eye, Database, Lock, Mail, Phone } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
                <p className="text-blue-100 mt-1">Your privacy is our priority</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Last Updated */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Last Updated:</strong> January 2025
              </p>
            </div>

            {/* Introduction */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Eye className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Introduction</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                CampusCore University is committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                university management system.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Database className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">📝 Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Full name, email address, and contact information</li>
                    <li>Student ID, roll number, and registration details</li>
                    <li>Academic records, grades, and attendance data</li>
                    <li>Demographic information for statistical purposes</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">💻 Technical Information</h3>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                    <li>IP address, browser type, and device information</li>
                    <li>Login timestamps and system usage patterns</li>
                    <li>Cookies and session data for authentication</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Lock className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How We Use Your Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🎓 Academic Purposes</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Managing student enrollment and records</li>
                    <li>• Tracking academic progress and attendance</li>
                    <li>• Generating transcripts and certificates</li>
                    <li>• Facilitating communication between stakeholders</li>
                  </ul>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">🔧 System Operations</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Providing secure access to the platform</li>
                    <li>• Improving system performance and features</li>
                    <li>• Preventing fraud and unauthorized access</li>
                    <li>• Complying with legal and regulatory requirements</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🔒 Data Security</h2>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Technical Safeguards</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Secure database storage with encryption</li>
                      <li>• Regular security audits and updates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Access Controls</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Role-based access permissions</li>
                      <li>• Multi-factor authentication options</li>
                      <li>• Regular access reviews and monitoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⚖️ Your Rights</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Access:</strong>
                    <span className="text-gray-700 dark:text-gray-300"> Request copies of your personal data</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Correction:</strong>
                    <span className="text-gray-700 dark:text-gray-300"> Request correction of inaccurate information</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Deletion:</strong>
                    <span className="text-gray-700 dark:text-gray-300"> Request deletion of your data (subject to legal requirements)</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900 dark:text-white">Portability:</strong>
                    <span className="text-gray-700 dark:text-gray-300"> Request transfer of your data to another service</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📞 Contact Us</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you have questions about this Privacy Policy or your personal data, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">privacy@campuscore.edu</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Updates */}
            <section>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">📋 Policy Updates</h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last Updated" date.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;