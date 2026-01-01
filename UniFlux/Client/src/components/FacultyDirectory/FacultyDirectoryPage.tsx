import React from 'react';

const FacultyDirectoryPage: React.FC = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">👨‍🏫 Faculty Directory</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Purpose</h2>
      <p>Enables students, parents, and staff to connect with faculty for academic support, research, and collaboration.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Overview</h2>
      <p>Find faculty members by department, view detailed profiles, and get in touch for academic or research queries.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Faculty List</h2>
      <p>Browse a complete list of teaching and research staff.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Departments</h2>
      <p>View faculty grouped by academic department or specialization.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Faculty Profiles</h2>
      <p>See qualifications, research interests, and achievements of each faculty member.</p>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Contact Faculty</h2>
      <p>Find email addresses, office hours, and contact forms for faculty communication.</p>
    </section>
  </div>
);

export default FacultyDirectoryPage; 