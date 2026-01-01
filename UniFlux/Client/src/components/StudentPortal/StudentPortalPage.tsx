import React from 'react';

const StudentPortalPage: React.FC = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">🎒 Student Portal</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Purpose</h2>
      <p>Centralizes all student academic, administrative, and campus life resources in one secure dashboard.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Overview</h2>
      <p>Access your courses, grades, attendance, notices, resources, and manage your profile all in one place.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">My Courses</h2>
      <p>View and manage your current and past course enrollments.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Grades & Transcripts</h2>
      <p>Check your grades, download transcripts, and track your academic progress.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Attendance</h2>
      <p>Monitor your attendance records and receive notifications for low attendance.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Notices & Announcements</h2>
      <p>Stay updated with the latest campus news, events, and important announcements.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Resources</h2>
      <p>Access study materials, e-books, and other academic resources.</p>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
      <p>Update your personal information, change your password, and manage account settings.</p>
    </section>
  </div>
);

export default StudentPortalPage; 