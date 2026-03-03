import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Calendar, ClipboardCheck, Award, Bell, MessageSquare, TrendingUp, Clock, Search } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import DashboardSummary from './DashboardSummary';
import { sampleTimetable } from '../../data/sampleData';

type ResultStatusKey = 'top' | 'track' | 'attention';

const DAY_PRIORITY: Record<string, number> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  .reduce((acc, day, index) => {
    acc[day] = index;
    return acc;
  }, {} as Record<string, number>);

const parseSlotStartMinutes = (range: string) => {
  const [start] = range.split('-');
  const [hours, minutes] = start.split(':').map(Number);
  return hours * 60 + (minutes || 0);
};

const getResultStatusMeta = (score: number): { label: string; key: ResultStatusKey; badgeClass: string } => {
  if (score >= 85) {
    return {
      label: 'Top Performer',
      key: 'top',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
    };
  }

  if (score >= 70) {
    return {
      label: 'On Track',
      key: 'track',
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    };
  }

  return {
    label: 'Needs Attention',
    key: 'attention',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  };
};

const StudentDashboard: React.FC = () => {
  const { currentUser, attendance, marks, subjects, notices, grievances } = useApp();

  // Calculate student-specific data
  const studentAttendance = attendance.filter(a => a.studentId === currentUser?.id);
  const studentMarks = marks.filter(m => m.studentId === currentUser?.id);

  const totalClasses = studentAttendance.length;
  const presentClasses = studentAttendance.filter(a => a.status === 'present').length;
  const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  const avgMarks = studentMarks.length > 0
    ? studentMarks.reduce((sum, m) => sum + m.totalMarks, 0) / studentMarks.length
    : 0;

  const currentSemester = currentUser?.semester || 5;
  const currentCGPA = studentMarks.length > 0
    ? studentMarks.reduce((sum, m) => sum + (m.totalMarks / 10), 0) / studentMarks.length
    : 0;

  // Subject-wise performance
  const subjectPerformance = subjects.map(subject => {
    const subjectMark = studentMarks.find(m => m.subjectId === subject.id);
    const subjectAttendance = studentAttendance.filter(a => a.subjectId === subject.id);
    const subjectAttendancePercentage = subjectAttendance.length > 0
      ? Math.round((subjectAttendance.filter(a => a.status === 'present').length / subjectAttendance.length) * 100)
      : 0;

    return {
      name: subject.code,
      marks: subjectMark?.totalMarks || 0,
      attendance: subjectAttendancePercentage
    };
  });

  // Grade distribution
  const gradeDistribution = [
    { name: 'A+', value: studentMarks.filter(m => m.grade === 'A+').length, color: '#10B981' },
    { name: 'A', value: studentMarks.filter(m => m.grade === 'A').length, color: '#3B82F6' },
    { name: 'B+', value: studentMarks.filter(m => m.grade === 'B+').length, color: '#8B5CF6' },
    { name: 'B', value: studentMarks.filter(m => m.grade === 'B').length, color: '#F59E0B' },
    { name: 'C', value: studentMarks.filter(m => m.grade === 'C').length, color: '#EF4444' }
  ].filter(grade => grade.value > 0);

  const stats = [
    { title: 'Current CGPA', value: currentCGPA.toFixed(2), icon: Award, color: 'bg-green-500', change: '+0.2 from last sem' },
    { title: 'Attendance', value: `${attendancePercentage}%`, icon: ClipboardCheck, color: 'bg-blue-500', change: attendancePercentage >= 75 ? 'Good' : 'Needs Improvement' },
    { title: 'Average Marks', value: avgMarks.toFixed(1), icon: TrendingUp, color: 'bg-purple-500', change: avgMarks >= 80 ? 'Excellent' : avgMarks >= 60 ? 'Good' : 'Needs Focus' },
    { title: 'Current Semester', value: currentSemester.toString(), icon: BookOpen, color: 'bg-indigo-500', change: 'Active' }
  ];

  const recentNotices = notices.slice(0, 3);
  const myGrievances = grievances.filter(g => g.studentId === currentUser?.id);
  const pendingGrievancesCount = myGrievances.filter(g => g.status !== 'resolved').length;

  const [resultsSearch, setResultsSearch] = useState('');
  const [resultsSubjectFilter, setResultsSubjectFilter] = useState<'all' | string>('all');
  const [resultsSemesterFilter, setResultsSemesterFilter] = useState<'all' | number>('all');
  const [resultsStatusFilter, setResultsStatusFilter] = useState<'all' | ResultStatusKey>('all');
  const [scheduleSearch, setScheduleSearch] = useState('');
  const [scheduleDayFilter, setScheduleDayFilter] = useState<'All' | string>('All');

  const subjectFilterOptions = useMemo(() => {
    const unique = new Map<string, { code: string; name: string }>();
    subjects.forEach(subject => {
      unique.set(subject.code, { code: subject.code, name: subject.name });
    });
    return Array.from(unique.values());
  }, [subjects]);

  const semesterFilterOptions = useMemo(() => {
    return Array.from(new Set(studentMarks.map(mark => mark.semester))).sort((a, b) => a - b);
  }, [studentMarks]);

  const enrichedMarks = useMemo(() => {
    return studentMarks.map(mark => {
      const subject = subjects.find(s => s.id === mark.subjectId);
      const subjectMeta = subject
        ? { code: subject.code, name: subject.name }
        : { code: 'GEN', name: 'General Subject' };
      return {
        ...mark,
        subjectMeta,
        status: getResultStatusMeta(mark.totalMarks),
      };
    });
  }, [studentMarks, subjects]);

  const filteredResults = useMemo(() => {
    const query = resultsSearch.trim().toLowerCase();
    return enrichedMarks.filter(mark => {
      const matchesSearch =
        !query ||
        mark.subjectMeta.name.toLowerCase().includes(query) ||
        mark.subjectMeta.code.toLowerCase().includes(query);
      const matchesSubject = resultsSubjectFilter === 'all' || mark.subjectMeta.code === resultsSubjectFilter;
      const matchesSemester = resultsSemesterFilter === 'all' || mark.semester === resultsSemesterFilter;
      const matchesStatus = resultsStatusFilter === 'all' || mark.status.key === resultsStatusFilter;
      return matchesSearch && matchesSubject && matchesSemester && matchesStatus;
    });
  }, [enrichedMarks, resultsSearch, resultsSubjectFilter, resultsSemesterFilter, resultsStatusFilter]);

  const visibleResults = filteredResults.slice(0, 6);

  const scheduleDayOptions = useMemo(
    () => ['All', ...Array.from(new Set(sampleTimetable.map(day => day.day)))],
    []
  );

  const flattenedSchedule = useMemo(() => {
    return sampleTimetable
      .flatMap(day =>
        day.timeSlots.map(slot => ({
          ...slot,
          day: day.day,
        }))
      )
      .sort((a, b) => {
        const dayDiff = (DAY_PRIORITY[a.day] ?? 999) - (DAY_PRIORITY[b.day] ?? 999);
        if (dayDiff !== 0) {
          return dayDiff;
        }
        return parseSlotStartMinutes(a.time) - parseSlotStartMinutes(b.time);
      });
  }, []);

  const filteredSchedule = useMemo(() => {
    const query = scheduleSearch.trim().toLowerCase();
    return flattenedSchedule.filter(slot => {
      const matchesDay = scheduleDayFilter === 'All' || slot.day === scheduleDayFilter;
      const matchesSearch =
        !query ||
        slot.subjectName.toLowerCase().includes(query) ||
        slot.subjectCode.toLowerCase().includes(query) ||
        slot.teacherName.toLowerCase().includes(query);
      return matchesDay && matchesSearch;
    });
  }, [flattenedSchedule, scheduleDayFilter, scheduleSearch]);

  const limitedSchedule = filteredSchedule.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {currentUser?.name}!</h1>
        <p className="opacity-90">Here's your academic progress and updates for Semester {currentSemester}.</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Roll: {currentUser?.rollNumber}</span>
          </div>
          <div className="bg-white/20 rounded-lg px-3 py-1">
            <span className="text-sm">Department: {currentUser?.department}</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Widgets */}
      <DashboardSummary
        nextClass={{
          subject: "Mathematics II",
          time: "Tomorrow at 9:00 AM",
          room: "Room 302"
        }}
        attendanceStatus={{
          percentage: attendancePercentage,
          status: attendancePercentage >= 75 ? 'Good' : attendancePercentage >= 60 ? 'Fair' : 'Low'
        }}
        recentNotice={notices[0]?.title}
        pendingGrievances={pendingGrievancesCount}
      />

      {/* Filters & Navigation Aids */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Search results</label>
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={resultsSearch}
                  onChange={(event) => setResultsSearch(event.target.value)}
                  placeholder="Find a subject, code, or grade"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-[420px]">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <select
                  value={resultsSubjectFilter}
                  onChange={(event) => setResultsSubjectFilter(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All subjects</option>
                  {subjectFilterOptions.map((subject) => (
                    <option key={subject.code} value={subject.code}>
                      {subject.code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
                <select
                  value={resultsSemesterFilter}
                  onChange={(event) =>
                    setResultsSemesterFilter(event.target.value === 'all' ? 'all' : Number(event.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All</option>
                  {semesterFilterOptions.map((semester) => (
                    <option key={semester} value={semester}>
                      Sem {semester}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={resultsStatusFilter}
                  onChange={(event) => setResultsStatusFilter(event.target.value as ResultStatusKey | 'all')}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="top">Top performer</option>
                  <option value="track">On track</option>
                  <option value="attention">Needs attention</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            {visibleResults.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-300">
                    <th className="py-3 pr-6 font-medium">Subject</th>
                    <th className="py-3 pr-6 font-medium">Marks</th>
                    <th className="py-3 pr-6 font-medium">Grade</th>
                    <th className="py-3 pr-6 font-medium">Semester</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {visibleResults.map((mark) => (
                    <tr key={`${mark.subjectId}-${mark.semester}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 pr-6">
                        <p className="font-semibold text-gray-900 dark:text-white">{mark.subjectMeta.code}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{mark.subjectMeta.name}</p>
                      </td>
                      <td className="py-3 pr-6">
                        <p className="font-semibold text-gray-900 dark:text-white">{mark.totalMarks}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {mark.internalMarks} + {mark.externalMarks}
                        </p>
                      </td>
                      <td className="py-3 pr-6 text-gray-900 dark:text-white">{mark.grade}</td>
                      <td className="py-3 pr-6 text-gray-900 dark:text-white">Sem {mark.semester}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${mark.status.badgeClass}`}>
                          {mark.status.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No results match the selected filters.</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming classes</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quickly scan your next few sessions</p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{filteredSchedule.length} results</span>
          </div>

          <div className="mt-4 space-y-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={scheduleSearch}
                onChange={(event) => setScheduleSearch(event.target.value)}
                placeholder="Search subject, code, or faculty"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by day</label>
              <select
                value={scheduleDayFilter}
                onChange={(event) => setScheduleDayFilter(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                {scheduleDayOptions.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 space-y-3 max-h-80 overflow-y-auto pr-1">
            {limitedSchedule.length > 0 ? (
              limitedSchedule.map((slot, index) => (
                <div
                  key={`${slot.day}-${slot.time}-${slot.subjectCode}-${index}`}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{slot.day}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                      {slot.time}
                    </span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-gray-900 dark:text-white">{slot.subjectName}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{slot.subjectCode}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {slot.teacherName}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No classes match the selected filters.</p>
            )}
          </div>
        </div>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="marks" fill="#3B82F6" name="Marks" />
              <Bar dataKey="attendance" fill="#10B981" name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grade Distribution</h3>
          {gradeDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>No grades available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Notices */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Notices</h3>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentNotices.map(notice => (
              <div key={notice.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notice.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notice.content.substring(0, 80)}...</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${notice.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      notice.priority === 'important' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {notice.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Grievances */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Grievances</h3>
            <MessageSquare className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {myGrievances.length > 0 ? (
              myGrievances.slice(0, 3).map(grievance => (
                <div key={grievance.id} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{grievance.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{grievance.description.substring(0, 60)}...</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${grievance.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        grievance.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                      }`}>
                      {grievance.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No grievances submitted</p>
            )}
          </div>
        </div>
      </div>

      {/* Academic Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Mid-term Exams</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Feb 15 - Feb 25</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Assignment Due</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Jan 30, 2025</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="h-10 w-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Award className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Result Declaration</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Mar 10, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;