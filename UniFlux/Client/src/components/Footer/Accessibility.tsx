import React from 'react';
import { Eye, Ear, Hand, Brain, Heart, Phone } from 'lucide-react';

const Accessibility: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <Eye className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Accessibility Statement</h1>
                <p className="text-teal-100 mt-1">Committed to inclusive education for all</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Commitment */}
            <section>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Heart className="h-6 w-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Commitment</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  CampusCore University is committed to ensuring that our digital platforms and physical facilities 
                  are accessible to all students, faculty, and staff, regardless of their abilities. We strive to 
                  provide equal access to education and university services for everyone in our community.
                </p>
              </div>
            </section>

            {/* Digital Accessibility */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Eye className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Digital Accessibility Features</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">👁️ Visual Accessibility</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• High contrast color schemes and dark mode</li>
                    <li>• Scalable fonts and adjustable text sizes</li>
                    <li>• Alternative text for all images and graphics</li>
                    <li>• Screen reader compatible navigation</li>
                    <li>• Keyboard-only navigation support</li>
                    <li>• Focus indicators for interactive elements</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">🔊 Audio & Motor Accessibility</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• Captions and transcripts for video content</li>
                    <li>• Audio descriptions for visual content</li>
                    <li>• Voice navigation and control options</li>
                    <li>• Customizable interface layouts</li>
                    <li>• Extended time limits for timed activities</li>
                    <li>• Alternative input methods support</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Assistive Technologies */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Hand className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Supported Assistive Technologies</h2>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🖥️ Screen Readers</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• JAWS (Windows)</li>
                      <li>• NVDA (Windows)</li>
                      <li>• VoiceOver (macOS/iOS)</li>
                      <li>• TalkBack (Android)</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">⌨️ Input Devices</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Switch controls</li>
                      <li>• Eye-tracking systems</li>
                      <li>• Voice recognition</li>
                      <li>• Alternative keyboards</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🔍 Visual Aids</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Screen magnifiers</li>
                      <li>• Color contrast tools</li>
                      <li>• Text-to-speech software</li>
                      <li>• Reading comprehension tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Campus Accessibility */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Campus Accessibility Services</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-4">🏢 Physical Accessibility</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>• Wheelchair accessible entrances and pathways</li>
                      <li>• Elevators in all multi-story buildings</li>
                      <li>• Accessible parking spaces near entrances</li>
                      <li>• Braille signage and tactile guidance systems</li>
                    </ul>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>• Accessible restrooms and water fountains</li>
                      <li>• Adjustable-height desks and workstations</li>
                      <li>• Hearing loop systems in auditoriums</li>
                      <li>• Emergency evacuation assistance plans</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4">🎓 Academic Accommodations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>• Extended time for exams and assignments</li>
                      <li>• Alternative format materials (Braille, large print)</li>
                      <li>• Note-taking and transcription services</li>
                      <li>• Sign language interpreters</li>
                    </ul>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>• Assistive technology in computer labs</li>
                      <li>• Flexible attendance policies when needed</li>
                      <li>• Priority registration for courses</li>
                      <li>• Accessible housing accommodations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Standards Compliance */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📋 Standards & Compliance</h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Our digital platforms are designed to meet or exceed the following accessibility standards:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• <strong>WCAG 2.1 AA:</strong> Web Content Accessibility Guidelines</li>
                    <li>• <strong>Section 508:</strong> U.S. Federal accessibility requirements</li>
                    <li>• <strong>ADA:</strong> Americans with Disabilities Act compliance</li>
                  </ul>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• <strong>ARIA:</strong> Accessible Rich Internet Applications</li>
                    <li>• <strong>ISO 14289:</strong> PDF accessibility standards</li>
                    <li>• <strong>EN 301 549:</strong> European accessibility standard</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How to Request Accommodations */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📝 Requesting Accommodations</h2>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">1️⃣ Contact Our Accessibility Office</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Reach out to our Disability Services Office to discuss your needs and begin the accommodation process.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">2️⃣ Provide Documentation</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Submit relevant medical or psychological documentation that supports your accommodation request.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">3️⃣ Develop an Accommodation Plan</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Work with our team to create a personalized accommodation plan that meets your specific needs.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">4️⃣ Implement and Monitor</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Begin using your accommodations and maintain regular contact to ensure they remain effective.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Feedback and Reporting */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💬 Feedback & Reporting Issues</h2>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  We continuously work to improve accessibility. If you encounter barriers or have suggestions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🐛 Report Issues</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Describe the specific barrier encountered</li>
                      <li>• Include your browser and assistive technology details</li>
                      <li>• Provide the URL or location of the issue</li>
                      <li>• Suggest potential solutions if possible</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Share Feedback</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Tell us about your user experience</li>
                      <li>• Suggest new accessibility features</li>
                      <li>• Share what works well for you</li>
                      <li>• Recommend improvements</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="h-6 w-6 text-teal-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Information</h2>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">🏢 Disability Services Office</h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>📧 accessibility@campuscore.edu</p>
                      <p>📞 +1 (555) 123-4567</p>
                      <p>📍 Student Services Building, Room 150</p>
                      <p>🕒 Monday-Friday, 8:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-teal-800 dark:text-teal-200 mb-3">💻 Technical Support</h3>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>📧 techsupport@campuscore.edu</p>
                      <p>📞 +1 (555) 123-4568</p>
                      <p>💬 Live chat available 24/7</p>
                      <p>🎫 Submit online support ticket</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Ongoing Commitment */}
            <section>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🌟 Our Ongoing Commitment</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Accessibility is not a destination but a journey. We are committed to continuously improving our 
                  services, regularly updating our systems, and staying current with accessibility best practices. 
                  Your feedback and experiences help us create a more inclusive environment for everyone in our 
                  university community.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;