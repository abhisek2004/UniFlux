import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="text-white bg-gray-800 border-t border-gray-700 dark:bg-gray-900">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* University Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r rounded-lg from-primary-500 to-secondary-500">
                <span className="font-bold text-white">CC</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold">CampusCore University</h3>
                <p className="text-sm text-gray-300">Excellence in Education & Technology</p>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-300">
              Leading the way in quality education and innovative learning experiences. 
              Empowering students to achieve their academic and professional goals through 
              comprehensive programs and state-of-the-art facilities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                <span className="sr-only">Facebook</span>
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                <span className="sr-only">Twitter</span>
                <div className="w-6 h-6 bg-sky-500 rounded"></div>
              </a>
              <a href="#" className="text-gray-300 transition-colors hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <div className="w-6 h-6 bg-blue-700 rounded"></div>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleLinkClick('/quick-links')} className="text-sm text-left text-gray-300 transition-colors hover:text-white">Academic Calendar</button></li>
              <li><button onClick={() => handleLinkClick('/quick-links')} className="text-sm text-left text-gray-300 transition-colors hover:text-white">Admissions</button></li>
              <li><button onClick={() => handleLinkClick('/quick-links')} className="text-sm text-left text-gray-300 transition-colors hover:text-white">Student Portal</button></li>
              <li><button onClick={() => handleLinkClick('/quick-links')} className="text-sm text-left text-gray-300 transition-colors hover:text-white">Faculty Directory</button></li>
              <li><button onClick={() => handleLinkClick('/quick-links')} className="text-sm text-left text-gray-300 transition-colors hover:text-white">Library</button></li>
              <li><button onClick={() => handleLinkClick('/quick-links')} className="text-sm text-left text-gray-300 transition-colors hover:text-white">Career Services</button></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-4 text-lg font-semibold">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-300">123 University Avenue</p>
                  <p className="text-sm text-gray-300">Education City, EC 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="flex-shrink-0 w-5 h-5 text-primary-400" />
                <p className="text-sm text-gray-300">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="flex-shrink-0 w-5 h-5 text-primary-400" />
                <p className="text-sm text-gray-300">info@campuscore.edu</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-8 border-t border-gray-700">
          <div className="flex flex-col justify-between items-center sm:flex-row">
            <p className="text-sm text-gray-300">
              © 2025 CampusCore University. All rights reserved.
            </p>
            <div className="flex items-center mt-2 space-x-1 sm:mt-0">
              <span className="text-sm text-gray-300">Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-300">for education</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center mt-4 space-x-6 sm:justify-start">
            <button onClick={() => handleLinkClick('/privacy-policy')} className="text-xs text-gray-400 transition-colors hover:text-white">Privacy Policy</button>
            <button onClick={() => handleLinkClick('/terms-of-service')} className="text-xs text-gray-400 transition-colors hover:text-white">Terms of Service</button>
            <button onClick={() => handleLinkClick('/student-code-of-conduct')} className="text-xs text-gray-400 transition-colors hover:text-white">Student Code of Conduct</button>
            <button onClick={() => handleLinkClick('/accessibility')} className="text-xs text-gray-400 transition-colors hover:text-white">Accessibility</button>
            <button onClick={() => handleLinkClick('/creator-info')} className="text-xs text-gray-400 transition-colors hover:text-white">Creator Info</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;