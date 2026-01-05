import React from 'react';
import { Calendar, Users, GraduationCap, BookOpen, Building, Briefcase, ExternalLink, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const QuickLinks: React.FC = () => {
  const navigate = useNavigate();
  const quickLinks = [
    {
      title: 'Academic Calendar',
      description: 'View important academic dates, exam schedules, and university events',
      purpose: 'Keeps students, faculty, and staff informed about all key academic dates, deadlines, and events throughout the year.',
      details: 'The Academic Calendar provides a comprehensive overview of semester start/end dates, holidays, exam periods, registration deadlines, and special university events. It helps everyone plan their academic and personal schedules effectively. Downloadable PDFs and event reminders are available.',
      icon: Calendar,
      color: 'bg-blue-500',
      links: [
        { name: 'Current Academic Year Calendar', url: '/academic-calendar', info: 'Displays the full calendar for the current academic year, including semester start/end dates, breaks, and key events.' },
        { name: 'Exam Schedule', url: '#', info: 'Lists all major exam dates for midterms, finals, and entrance exams, with downloadable timetables.' },
        { name: 'Holiday List', url: '#', info: 'Shows all university holidays and non-instructional days for the year.' },
        { name: 'Important Deadlines', url: '#', info: 'Highlights critical academic deadlines such as registration, add/drop, and graduation application dates.' }
      ]
    },
    {
      title: 'Admissions',
      description: 'Information about admission process, requirements, and applications',
      purpose: 'Guides prospective students through the process of joining the university, from inquiry to enrollment.',
      details: 'The Admissions section covers eligibility criteria, required documents, application steps, fee structure, scholarships, and FAQs. It provides downloadable forms, online application portals, and direct contact with the admissions office for support.',
      icon: Users,
      color: 'bg-green-500',
      links: [
        { name: 'Admission Requirements', url: '/admissions', info: 'Lists academic and documentation requirements for undergraduate and postgraduate programs.' },
        { name: 'Application Process', url: '/admissions', info: 'Step-by-step guide to submitting your application online, including important dates and instructions.' },
        { name: 'Fee Structure', url: '/admissions', info: 'Breakdown of tuition, hostel, and other fees for all programs, with payment options.' },
        { name: 'Scholarship Information', url: '/admissions', info: 'Details on available scholarships, eligibility, and how to apply for financial aid.' }
      ]
    },
    {
      title: 'Student Portal',
      description: 'Access your academic records, grades, and student services',
      purpose: 'Centralizes all student academic, administrative, and campus life resources in one secure dashboard.',
      details: 'The Student Portal allows students to register for courses, view grades and transcripts, track attendance, access notices, and manage their profiles. It also provides links to student support services, campus news, and resource downloads.',
      icon: GraduationCap,
      color: 'bg-purple-500',
      links: [
        { name: 'Login to Student Portal', url: '/student-portal', info: 'Secure login for students to access personalized dashboard and services.' },
        { name: 'Academic Records', url: '/student-portal', info: 'View and download your grades, transcripts, and academic history.' },
        { name: 'Course Registration', url: '/student-portal', info: 'Register for new courses, view schedules, and manage your enrollments.' },
        { name: 'Student Services', url: '/student-portal', info: 'Access support services including counseling, health, and campus resources.' }
      ]
    },
    {
      title: 'Faculty Directory',
      description: 'Find contact information and profiles of our faculty members',
      purpose: 'Enables students, parents, and staff to connect with faculty for academic support, research, and collaboration.',
      details: 'The Faculty Directory lists all teaching and research staff by department, with detailed profiles including qualifications, research interests, office hours, and contact information. Search and filter options make it easy to find the right faculty member.',
      icon: Users,
      color: 'bg-indigo-500',
      links: [
        { name: 'Faculty Profiles', url: '/faculty-directory', info: 'Browse detailed profiles of faculty members, including their qualifications and research interests.' },
        { name: 'Department Contacts', url: '/faculty-directory', info: 'Find contact information for academic departments and administrative offices.' },
        { name: 'Office Hours', url: '/faculty-directory', info: 'View faculty office hours for academic advising and student meetings.' },
        { name: 'Research Areas', url: '/faculty-directory', info: 'Explore faculty research specializations and ongoing projects.' }
      ]
    },
    {
      title: 'Library',
      description: 'Access library resources, catalogs, and digital collections',
      purpose: 'Provides access to physical and digital academic resources, research tools, and study spaces.',
      details: 'The Library section features a searchable catalog, e-resources, digital journals, and information about borrowing, study rooms, and library services. Students and staff can reserve materials, access online databases, and check library hours.',
      icon: BookOpen,
      color: 'bg-yellow-500',
      links: [
        { name: 'Library Catalog', url: '/library', info: 'Search for books, journals, and media available in the university library.' },
        { name: 'Digital Resources', url: '/library', info: 'Access e-books, online journals, and academic databases from anywhere.' },
        { name: 'Study Spaces', url: '/library', info: 'Reserve group or individual study rooms and check availability.' },
        { name: 'Library Hours', url: '/library', info: 'View current library opening hours and holiday schedules.' }
      ]
    },
    {
      title: 'Career Services',
      description: 'Career guidance, job placement, and professional development',
      purpose: 'Supports students and alumni in career planning, job search, and professional growth.',
      details: 'Career Services offers job and internship listings, resume and interview workshops, career counseling, and networking events with industry partners. Alumni can access lifelong career support and participate in mentorship programs.',
      icon: Briefcase,
      color: 'bg-red-500',
      links: [
        { name: 'Job Placement', url: '/career-services', info: 'Find job and internship opportunities posted by the university and partner companies.' },
        { name: 'Career Counseling', url: '/career-services', info: 'Book appointments for personalized career advice and planning.' },
        { name: 'Resume Building', url: '/career-services', info: 'Access tools and workshops to create and improve your resume and cover letters.' },
        { name: 'Industry Partnerships', url: '/career-services', info: 'Learn about collaborations with industry for placements, projects, and events.' }
      ]
    }
  ];

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const handleLinkClick = (url: string) => {
    if (url.startsWith('/')) {
      navigate(url);
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Home Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <button 
              onClick={() => navigate('/')}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              title="Return to Home"
            >
              <ExternalLink className="h-8 w-8 text-white" />
            </button>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Easy access to essential university services, resources, and information
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickLinks.map((section, index) => {
            const Icon = section.icon;
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setExpandedIndex(isExpanded ? null : index); }}
                aria-expanded={isExpanded}
                aria-controls={`quick-link-details-${index}`}
              >
                {/* Card Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${section.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <span className="ml-4">
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                  </span>
                </div>
                {/* Expanded Content */}
                {isExpanded && (
                  <div id={`quick-link-details-${index}`} className="p-6 animate-fade-in">
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-1"><span className="font-semibold">Purpose:</span> {section.purpose}</p>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mb-4"><span className="font-semibold">Details:</span> {section.details}</p>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <button
                            onClick={() => handleLinkClick(link.url)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group w-full text-left"
                          >
                            <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                              {link.name}
                            </span>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                          </button>
                          {/* Show info if present */}
                          {link.info && (
                            <div className="ml-2 mt-1 text-xs text-gray-500 dark:text-gray-400 pl-2 border-l border-gray-200 dark:border-gray-700">
                              {link.info}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Resources */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Emergency Contacts */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-4">🚨 Emergency Contacts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Campus Security:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">+1 (555) 911-0000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Medical Emergency:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">+1 (555) 911-1111</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">IT Support:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            {/* Important Announcements */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-4">📢 Important Announcements</h3>
              <div className="space-y-3">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Semester Registration Open</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Deadline: January 31, 2025</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Library Maintenance</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">January 25, 2025 - Closed</p>
                </div>
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Career Fair 2025</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">February 15-16, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Map */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Building className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Campus Information</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📍 Campus Locations</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Main Campus - Academic Buildings</li>
                  <li>• Student Center - Dining & Recreation</li>
                  <li>• Library Complex - Study & Research</li>
                  <li>• Residence Halls - Student Housing</li>
                  <li>• Sports Complex - Athletics</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🚌 Transportation</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Campus Shuttle Service</li>
                  <li>• Public Transit Connections</li>
                  <li>• Parking Information</li>
                  <li>• Bike Sharing Program</li>
                  <li>• Accessibility Services</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🏢 Key Buildings</h4>
                <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                  <li>• Administration Building</li>
                  <li>• Engineering Complex</li>
                  <li>• Science Laboratories</li>
                  <li>• Computer Center</li>
                  <li>• Auditorium & Conference Halls</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need Help?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="mailto:support@campuscore.edu"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📧 Email Support
              </a>
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                📞 Call Support
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                💬 Live Chat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;