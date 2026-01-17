import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    // Changed: bg-gray-50 for light mode, dark:bg-gray-900 for dark mode
    // Changed: text-gray-600 for light mode, dark:text-gray-300 for dark mode
    <footer className="bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          
          {/* University Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="flex justify-center items-center w-10 h-10 bg-gradient-to-r rounded-lg from-primary-500 to-secondary-500 shadow-md">
                <span className="font-bold text-white">CC</span>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">CampusCore University</h3>
                <p className="text-sm font-medium text-primary-600 dark:text-primary-400">Excellence in Education & Technology</p>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed max-w-md">
              Leading the way in quality education and innovative learning experiences. 
              Empowering students to achieve their academic and professional goals through 
              comprehensive programs and state-of-the-art facilities.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" icon={<Facebook size={20} />} label="Facebook" color="hover:text-blue-600" />
              <SocialIcon href="#" icon={<Twitter size={20} />} label="Twitter" color="hover:text-sky-500" />
              <SocialIcon href="#" icon={<Linkedin size={20} />} label="LinkedIn" color="hover:text-blue-700" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink onClick={() => handleLinkClick('/quick-links')}>Academic Calendar</FooterLink>
              <FooterLink onClick={() => handleLinkClick('/quick-links')}>Admissions</FooterLink>
              <FooterLink onClick={() => handleLinkClick('/quick-links')}>Student Portal</FooterLink>
              <FooterLink onClick={() => handleLinkClick('/quick-links')}>Faculty Directory</FooterLink>
              <FooterLink onClick={() => handleLinkClick('/quick-links')}>Library</FooterLink>
              <FooterLink onClick={() => handleLinkClick('/quick-links')}>Career Services</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p>123 University Avenue</p>
                  <p>Education City, EC 12345</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="flex-shrink-0 w-5 h-5 text-primary-500" />
                <p className="text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="flex-shrink-0 w-5 h-5 text-primary-500" />
                <p className="text-sm">info@campuscore.edu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col justify-between items-center md:flex-row">
            <p className="text-sm">
              © 2026 CampusCore University. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0 space-x-1">
              <span className="text-sm">Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span className="text-sm">for education</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center mt-6 gap-x-6 gap-y-2 md:justify-start">
            <LegalLink onClick={() => handleLinkClick('/privacy-policy')}>Privacy Policy</LegalLink>
            <LegalLink onClick={() => handleLinkClick('/terms-of-service')}>Terms of Service</LegalLink>
            <LegalLink onClick={() => handleLinkClick('/student-code-of-conduct')}>Student Code of Conduct</LegalLink>
            <LegalLink onClick={() => handleLinkClick('/accessibility')}>Accessibility</LegalLink>
            <LegalLink onClick={() => handleLinkClick('/creator-info')}>Creator Info</LegalLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Helper Components for cleaner code ---

const FooterLink = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
  <li>
    <button 
      onClick={onClick} 
      className="text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
    >
      {children}
    </button>
  </li>
);

const LegalLink = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
  <button 
    onClick={onClick} 
    className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
  >
    {children}
  </button>
);

const SocialIcon = ({ href, icon, label, color }: { href: string, icon: React.ReactNode, label: string, color: string }) => (
  <a 
    href={href} 
    className={`p-2 bg-gray-200 dark:bg-gray-800 rounded-full transition-all ${color} hover:shadow-md`}
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;