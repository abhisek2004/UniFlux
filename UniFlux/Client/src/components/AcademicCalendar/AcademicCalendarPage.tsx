import React from 'react';

const academicYear = '2024-2025';
const importantDates = [
  { date: '2024-08-01', event: 'Semester 1 Begins' },
  { date: '2024-09-15', event: 'Last Date for Course Registration' },
  { date: '2024-12-20', event: 'Semester 1 Exams Start' },
  { date: '2024-12-31', event: 'Semester 1 Ends' },
  { date: '2025-01-10', event: 'Semester 2 Begins' },
  { date: '2025-04-15', event: 'Semester 2 Exams Start' },
  { date: '2025-04-30', event: 'Academic Year Ends' },
];
const holidays = [
  { date: '2024-08-15', name: 'Independence Day' },
  { date: '2024-10-02', name: 'Gandhi Jayanti' },
  { date: '2024-12-25', name: 'Christmas' },
  { date: '2025-01-26', name: 'Republic Day' },
  { date: '2025-03-29', name: 'Holi' },
];
const universityInfo = {
  name: 'CampusCore University',
  address: '123 University Avenue, Education City, EC 12345',
  contact: '+1 (555) 123-4567',
  email: 'info@campuscore.edu',
};

const AcademicCalendarPage: React.FC = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">📅 Academic Calendar ({academicYear})</h1>
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Important Dates</h2>
      <ul className="list-disc ml-6">
        {importantDates.map((item, idx) => (
          <li key={idx} className="mb-1">
            <span className="font-medium">{item.date}:</span> {item.event}
          </li>
        ))}
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Holidays</h2>
      <ul className="list-disc ml-6">
        {holidays.map((item, idx) => (
          <li key={idx} className="mb-1">
            <span className="font-medium">{item.date}:</span> {item.name}
          </li>
        ))}
      </ul>
    </section>
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-2">University Information</h2>
      <div className="text-gray-700 dark:text-gray-300">
        <div><span className="font-medium">Name:</span> {universityInfo.name}</div>
        <div><span className="font-medium">Address:</span> {universityInfo.address}</div>
        <div><span className="font-medium">Contact:</span> {universityInfo.contact}</div>
        <div><span className="font-medium">Email:</span> {universityInfo.email}</div>
      </div>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Why Check the Academic Calendar?</h2>
      <p className="text-gray-700 dark:text-gray-300">The Academic Calendar helps students, faculty, and staff stay informed about all key dates, plan ahead, and avoid missing important deadlines or events. Always refer to the official calendar for the most up-to-date information.</p>
    </section>
  </div>
);

export default AcademicCalendarPage; 