import React from 'react';
import { GraduationCap, Users, BookOpen, Shield, Heart, Star } from 'lucide-react';

const StudentCodeOfConduct: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-3xl font-bold text-white">Student Code of Conduct</h1>
                <p className="text-purple-100 mt-1">Guidelines for academic and social excellence</p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Mission Statement */}
            <section>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  CampusCore University is committed to fostering an environment of academic excellence, personal growth, 
                  and mutual respect. This Code of Conduct outlines the standards of behavior expected from all students 
                  to maintain a positive and productive learning community.
                </p>
              </div>
            </section>

            {/* Core Values */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Core Values</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">🎯 Academic Excellence</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• Commitment to learning and intellectual growth</li>
                    <li>• Pursuit of knowledge with curiosity and dedication</li>
                    <li>• Striving for personal and academic achievement</li>
                    <li>• Continuous improvement and lifelong learning</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">🤝 Integrity & Honesty</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• Truthfulness in all academic and personal interactions</li>
                    <li>• Taking responsibility for actions and decisions</li>
                    <li>• Respecting intellectual property and academic work</li>
                    <li>• Maintaining ethical standards in all endeavors</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">🌍 Respect & Diversity</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• Valuing different perspectives and backgrounds</li>
                    <li>• Treating all community members with dignity</li>
                    <li>• Promoting inclusive and welcoming environment</li>
                    <li>• Celebrating cultural and individual differences</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">🏆 Leadership & Service</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• Contributing positively to the university community</li>
                    <li>• Taking initiative in academic and social activities</li>
                    <li>• Supporting fellow students and community members</li>
                    <li>• Engaging in meaningful service and volunteerism</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Academic Conduct */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-indigo-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Conduct</h2>
              </div>
              <div className="space-y-6">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-4">📚 Academic Integrity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✅ Expected Behaviors</h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Submit original work and cite sources properly</li>
                        <li>• Collaborate ethically when permitted</li>
                        <li>• Seek help from appropriate resources</li>
                        <li>• Report academic misconduct when witnessed</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">❌ Prohibited Actions</h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Plagiarism or unauthorized copying</li>
                        <li>• Cheating on exams or assignments</li>
                        <li>• Falsifying data or research results</li>
                        <li>• Unauthorized collaboration or sharing</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">🕐 Attendance & Participation</h3>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                    <li>• Regular attendance at all scheduled classes and activities</li>
                    <li>• Active participation in discussions and group work</li>
                    <li>• Punctuality and preparedness for all academic commitments</li>
                    <li>• Respectful engagement with instructors and peers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Social Conduct */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Users className="h-6 w-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Conduct</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">🤝 Community Standards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💬 Communication</h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Use respectful language</li>
                        <li>• Listen actively to others</li>
                        <li>• Avoid discriminatory speech</li>
                        <li>• Resolve conflicts peacefully</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏠 Campus Life</h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Respect shared spaces</li>
                        <li>• Follow residence hall policies</li>
                        <li>• Maintain cleanliness</li>
                        <li>• Be considerate of others</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎉 Events & Activities</h4>
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <li>• Participate responsibly</li>
                        <li>• Follow event guidelines</li>
                        <li>• Respect organizers and venues</li>
                        <li>• Promote inclusive participation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Technology Use */}
            <section>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Technology & Digital Citizenship</h2>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">💻 Responsible Use</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use university technology for academic purposes</li>
                      <li>• Protect personal and institutional data</li>
                      <li>• Respect software licensing and copyrights</li>
                      <li>• Report security issues promptly</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">🌐 Digital Ethics</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Maintain professional online presence</li>
                      <li>• Respect others' digital privacy</li>
                      <li>• Avoid cyberbullying or harassment</li>
                      <li>• Verify information before sharing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Consequences */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">⚖️ Consequences & Support</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">⚠️ Violations</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    Violations of this code may result in:
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Warning or counseling</li>
                    <li>• Academic probation</li>
                    <li>• Suspension or dismissal</li>
                    <li>• Loss of privileges or activities</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">🤝 Support Resources</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    We provide support through:
                  </p>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Academic advising and tutoring</li>
                    <li>• Counseling and mental health services</li>
                    <li>• Peer mentoring programs</li>
                    <li>• Conflict resolution assistance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Commitment */}
            <section>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🌟 Our Commitment to You</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By following this Code of Conduct, you contribute to a vibrant, inclusive, and supportive learning 
                  environment. Together, we build a community where every student can thrive academically, personally, 
                  and socially. Your success is our success, and we are committed to supporting you throughout your 
                  journey at CampusCore University.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCodeOfConduct;