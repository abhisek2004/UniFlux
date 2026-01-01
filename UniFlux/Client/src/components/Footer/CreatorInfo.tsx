import React from 'react';
import { Code, Globe, Github, Linkedin, Coffee, Heart, Star, Zap } from 'lucide-react';

const CreatorInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-8 py-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
                <Code className="h-12 w-12 text-indigo-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Abhisek Panda</h1>
              <p className="text-indigo-100 text-lg">Full-Stack Developer & Creator</p>
              <div className="flex justify-center space-x-4 mt-4">
                <a 
                  href="https://abhisekpanda072.vercel.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>Portfolio</span>
                </a>
                <a 
                  href="https://github.com/abhisek2004" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/abhisekpanda2004/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Disclaimer */}
            <section>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border-l-4 border-yellow-400">
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="h-6 w-6 text-yellow-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">⚠️ Disclaimer & Acknowledgement</h2>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    <strong>🚧 Important Note:</strong> This website has been developed as a personal learning project 
                    to sharpen my skills in full-stack web development. This is <strong>not an official website</strong> 
                    of any organization and is built purely for <strong>educational and practice purposes</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* About the Project */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="h-6 w-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🎯 About This Project</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4">💻 Tech Stack - MERN</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300"><strong>MongoDB:</strong> Database</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300"><strong>Express.js:</strong> Backend Framework</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300"><strong>React.js:</strong> Frontend Library</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300"><strong>Node.js:</strong> Runtime Environment</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">🎯 Project Goals</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                    <li>🕷️ Explore real-world data handling and API usage</li>
                    <li>🧩 Practice routing, dynamic UI rendering, and component design</li>
                    <li>📱💻 Experiment with responsive and clean UI/UX</li>
                    <li>🏗️ Build something from scratch as a challenge</li>
                    <li>🎨 Implement modern design patterns and best practices</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Features Implemented */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">✨ Features Implemented</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <h3 className="font-semibold text-green-800 dark:text-green-200 mb-3">🔐 Authentication & Security</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Role-based access control</li>
                    <li>• Secure login/logout system</li>
                    <li>• Session management</li>
                    <li>• Data protection</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">📊 Data Management</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Student & teacher management</li>
                    <li>• Attendance tracking</li>
                    <li>• Marks & results system</li>
                    <li>• Report generation</li>
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🎨 UI/UX Design</h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>• Responsive design</li>
                    <li>• Dark mode support</li>
                    <li>• Interactive dashboards</li>
                    <li>• Modern animations</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Learning Journey */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🚀 Learning Journey</h2>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-3">🧠 Skills Developed</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Advanced React.js patterns and hooks</li>
                      <li>• TypeScript for type safety</li>
                      <li>• Tailwind CSS for styling</li>
                      <li>• Component architecture design</li>
                      <li>• State management with Context API</li>
                      <li>• Responsive web design principles</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">💡 Challenges Overcome</h3>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Complex role-based routing</li>
                      <li>• Dynamic dashboard generation</li>
                      <li>• PDF generation and export</li>
                      <li>• Real-time data updates</li>
                      <li>• Cross-browser compatibility</li>
                      <li>• Performance optimization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Content Notice */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">📊 About the Content</h2>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
                <div className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>📝 Data Usage:</strong> Any data, media, or design inspiration used in this project is 
                    solely for demonstration and learning purposes.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>❌ No Ownership Claims:</strong> I do not claim any ownership over external assets, 
                    nor is the content used commercially.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>🔗 Third-party References:</strong> All third-party references belong to their 
                    respective owners.
                  </p>
                </div>
              </div>
            </section>

            {/* No Affiliation Notice */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">🚫 No Affiliation Notice</h2>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This site is <strong>not affiliated with, endorsed by, or officially connected to any company 
                  or organization</strong>. It is a <strong>fan-made or personal demo</strong> and a 
                  <strong> portfolio piece</strong> meant to showcase my skills in full-stack development.
                </p>
              </div>
            </section>

            {/* Call to Action */}
            <section>
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-6 w-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🧠 Calling Developers, Learners & Recruiters!</h2>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  If you're into:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                    <li>✨ Learning MERN stack development</li>
                    <li>🧪 Working with real-time data & APIs</li>
                    <li>📦 Exploring frontend/backend architecture</li>
                  </ul>
                  <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                    <li>🤝 Collaborating on open-source projects</li>
                    <li>💼 Discussing career opportunities</li>
                    <li>🎯 Sharing development best practices</li>
                  </ul>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📬 Let's connect!
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Check out more on my GitHub or message me on LinkedIn. Always up for feedback, 
                    collaboration, or just geeking out on tech!
                  </p>
                </div>
              </div>
            </section>

            {/* Footer Message */}
            <section>
              <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-8">
                <div className="flex justify-center items-center space-x-2 mb-4">
                  <Coffee className="h-6 w-6 text-amber-600" />
                  <Code className="h-6 w-6 text-blue-600" />
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  ☕💡💻 This project = Code + Coffee + Curiosity
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Built with passion for learning and sharing knowledge
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorInfo;