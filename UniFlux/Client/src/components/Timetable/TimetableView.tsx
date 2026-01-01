import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, User, BookOpen, Download, Printer as Print } from 'lucide-react';
import { sampleTimetable } from '../../data/sampleData';

const TimetableView: React.FC = () => {
  const { currentUser, subjects, teachers } = useApp();
  const [selectedSemester, setSelectedSemester] = useState(5);
  const [viewType, setViewType] = useState<'student' | 'teacher'>('student');

  // Sample timetables for different semesters
  const semesterTimetables = {
    1: [
      {
        day: 'Monday',
        timeSlots: [
          { time: '9:00-10:00', subjectCode: 'MA101', subjectName: 'Mathematics I', teacherName: 'Dr. Sharma' },
          { time: '10:00-11:00', subjectCode: 'PH101', subjectName: 'Physics I', teacherName: 'Dr. Gupta' },
          { time: '11:00-12:00', subjectCode: 'CH101', subjectName: 'Chemistry I', teacherName: 'Dr. Verma' },
          { time: '1:00-2:00', subjectCode: 'EG101', subjectName: 'Engineering Graphics', teacherName: 'Prof. Singh' },
          { time: '2:00-3:00', subjectCode: 'CS101', subjectName: 'Programming Fundamentals', teacherName: 'Dr. Kumar' }
        ]
      },
      // Add more days for semester 1...
    ],
    2: [
      {
        day: 'Monday',
        timeSlots: [
          { time: '9:00-10:00', subjectCode: 'MA201', subjectName: 'Mathematics II', teacherName: 'Dr. Sharma' },
          { time: '10:00-11:00', subjectCode: 'PH201', subjectName: 'Physics II', teacherName: 'Dr. Gupta' },
          { time: '11:00-12:00', subjectCode: 'CS201', subjectName: 'Data Structures', teacherName: 'Dr. Patel' },
          { time: '1:00-2:00', subjectCode: 'EC201', subjectName: 'Digital Electronics', teacherName: 'Prof. Jain' },
          { time: '2:00-3:00', subjectCode: 'CS202', subjectName: 'Object Oriented Programming', teacherName: 'Dr. Kumar' }
        ]
      },
      // Add more days for semester 2...
    ],
    3: [
      {
        day: 'Monday',
        timeSlots: [
          { time: '9:00-10:00', subjectCode: 'CS301', subjectName: 'Algorithms', teacherName: 'Dr. Agarwal' },
          { time: '10:00-11:00', subjectCode: 'CS302', subjectName: 'Computer Organization', teacherName: 'Prof. Mishra' },
          { time: '11:00-12:00', subjectCode: 'MA301', subjectName: 'Discrete Mathematics', teacherName: 'Dr. Sharma' },
          { time: '1:00-2:00', subjectCode: 'CS303', subjectName: 'Database Systems', teacherName: 'Dr. Rathi' },
          { time: '2:00-3:00', subjectCode: 'CS304', subjectName: 'Software Engineering', teacherName: 'Prof. Joshi' }
        ]
      },
      // Add more days for semester 3...
    ],
    4: [
      {
        day: 'Monday',
        timeSlots: [
          { time: '9:00-10:00', subjectCode: 'CS401', subjectName: 'Theory of Computation', teacherName: 'Dr. Agarwal' },
          { time: '10:00-11:00', subjectCode: 'CS402', subjectName: 'Computer Networks', teacherName: 'Prof. Raj' },
          { time: '11:00-12:00', subjectCode: 'CS403', subjectName: 'Compiler Design', teacherName: 'Dr. Singh' },
          { time: '1:00-2:00', subjectCode: 'CS404', subjectName: 'Web Technologies', teacherName: 'Prof. Bhatia' },
          { time: '2:00-3:00', subjectCode: 'CS405', subjectName: 'Mobile Computing', teacherName: 'Dr. Gupta' }
        ]
      },
      // Add more days for semester 4...
    ],
    5: sampleTimetable, // Use existing semester 5 data
    6: [
      {
        day: 'Monday',
        timeSlots: [
          { time: '9:00-10:00', subjectCode: 'CS601', subjectName: 'Machine Learning', teacherName: 'Dr. Kumar' },
          { time: '10:00-11:00', subjectCode: 'CS602', subjectName: 'Cloud Computing', teacherName: 'Prof. Sharma' },
          { time: '11:00-12:00', subjectCode: 'CS603', subjectName: 'Information Security', teacherName: 'Dr. Patel' },
          { time: '1:00-2:00', subjectCode: 'CS604', subjectName: 'Big Data Analytics', teacherName: 'Prof. Agarwal' },
          { time: '2:00-3:00', subjectCode: 'CS605', subjectName: 'Blockchain Technology', teacherName: 'Dr. Singh' }
        ]
      },
      // Add more days for semester 6...
    ],
    7: [
      {
        day: 'Monday',
        timeSlots: [
          { time: '9:00-10:00', subjectCode: 'CS701', subjectName: 'Advanced AI', teacherName: 'Dr. Kumar' },
          { time: '10:00-11:00', subjectCode: 'CS702', subjectName: 'Distributed Systems', teacherName: 'Prof. Sharma' },
          { time: '11:00-12:00', subjectCode: 'CS703', subjectName: 'Computer Vision', teacherName: 'Dr. Patel' },
          { time: '1:00-2:00', subjectCode: 'CS704', subjectName: 'Natural Language Processing', teacherName: 'Prof. Agarwal' },
          { time: '2:00-3:00', subjectCode: 'CS705', subjectName: 'Project Work I', teacherName: 'Dr. Singh' }
        ]
      },
      // Add more days for semester 7...
    ],
    8: [
      {
        day: 'Monday',
        timeSlots: [
          { time: '9:00-10:00', subjectCode: 'CS801', subjectName: 'Advanced Algorithms', teacherName: 'Dr. Kumar' },
          { time: '10:00-11:00', subjectCode: 'CS802', subjectName: 'High Performance Computing', teacherName: 'Prof. Sharma' },
          { time: '11:00-12:00', subjectCode: 'CS803', subjectName: 'Research Methodology', teacherName: 'Dr. Patel' },
          { time: '1:00-2:00', subjectCode: 'CS804', subjectName: 'Project Work II', teacherName: 'Prof. Agarwal' },
          { time: '2:00-3:00', subjectCode: 'CS805', subjectName: 'Seminar', teacherName: 'Dr. Singh' }
        ]
      },
      // Add more days for semester 8...
    ]
  };

  // Filter timetable based on user role and selections
  const getTimetableData = () => {
    const selectedTimetable = semesterTimetables[selectedSemester as keyof typeof semesterTimetables] || sampleTimetable;
    
    if (currentUser?.role === 'student') {
      return selectedTimetable;
    } else if (currentUser?.role === 'teacher') {
      // Filter to show only classes where the teacher is assigned
      return selectedTimetable.map(day => ({
        ...day,
        timeSlots: day.timeSlots.filter(slot => {
          const subject = subjects.find(s => s.code === slot.subjectCode);
          return subject?.teacherId === currentUser.id;
        })
      })).filter(day => day.timeSlots.length > 0);
    }
    return selectedTimetable;
  };

  const timetableData = getTimetableData();

  const getTimeSlotColor = (subjectCode: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200'
    ];
    const index = subjectCode.charCodeAt(subjectCode.length - 1) % colors.length;
    return colors[index];
  };

  const printTimetable = () => {
    window.print();
  };

  const exportTimetable = () => {
    // Implementation for exporting timetable
    console.log('Exporting timetable...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Class Timetable</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentUser?.role === 'student' 
              ? `Your class schedule for Semester ${currentUser.semester}`
              : 'Your teaching schedule'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={printTimetable}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors no-print"
          >
            <Print className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button
            onClick={exportTimetable}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors no-print"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {(currentUser?.role === 'hod' || currentUser?.role === 'superadmin') && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                View Type
              </label>
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value as 'student' | 'teacher')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="student">Student View</option>
                <option value="teacher">Teacher View</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weekly Schedule
            </h3>
            {currentUser?.role === 'student' && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Semester {currentUser.semester} • {currentUser.department} Department
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24">
                  Day
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  9:00-10:00
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  10:00-11:00
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  11:00-12:00
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  12:00-1:00
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  1:00-2:00
                </th>
                <th className="px-4 py-4 text-center text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  2:00-3:00
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {timetableData.map((day, dayIndex) => (
                <tr key={dayIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {day.day}
                    </div>
                  </td>
                  {/* Time slots */}
                  {['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '1:00-2:00', '2:00-3:00'].map((timeSlot, slotIndex) => {
                    const slot = day.timeSlots.find(s => s.time === timeSlot);
                    
                    if (timeSlot === '12:00-1:00') {
                      return (
                        <td key={slotIndex} className="px-4 py-4 text-center">
                          <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-3 border-2 border-dashed border-gray-300 dark:border-gray-500">
                            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              LUNCH BREAK
                            </div>
                          </div>
                        </td>
                      );
                    }
                    
                    return (
                      <td key={slotIndex} className="px-4 py-4 text-center">
                        {slot ? (
                          <div className={`rounded-lg p-3 border-2 ${getTimeSlotColor(slot.subjectCode)}`}>
                            <div className="text-sm font-bold">
                              {slot.subjectCode}
                            </div>
                            <div className="text-xs mt-1">
                              {slot.subjectName}
                            </div>
                            <div className="flex items-center justify-center mt-2 text-xs">
                              <User className="h-3 w-3 mr-1" />
                              {slot.teacherName}
                            </div>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-400">
                            <span className="text-xs">Free</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subject Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map(subject => (
            <div key={subject.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className={`w-4 h-4 rounded ${getTimeSlotColor(subject.code).split(' ')[0]}`}></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {subject.code} - {subject.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {subject.teacherName} • {subject.credits} Credits
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Subjects</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{subjects.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Classes per Day</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Working Days</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Credits</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {subjects.reduce((sum, s) => sum + s.credits, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimetableView;