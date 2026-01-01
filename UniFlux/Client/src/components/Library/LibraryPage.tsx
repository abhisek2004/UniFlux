import React from 'react';

const LibraryPage: React.FC = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">📚 Library</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Purpose</h2>
      <p>Provides access to physical and digital academic resources, research tools, and study spaces.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Overview</h2>
      <p>Search the library catalog, access e-resources, manage your loans, and find information about library services and hours.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Search Catalog</h2>
      <p>Find books, journals, and media available in the university library.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">e-Resources</h2>
      <p>Access digital resources including e-books, online journals, and academic databases.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Library Services</h2>
      <p>Learn about borrowing, study rooms, and other library services.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">My Loans</h2>
      <p>View and manage your current and past library loans.</p>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Library Hours</h2>
      <p>Check the current library opening hours and holiday schedules.</p>
    </section>
  </div>
);

export default LibraryPage; 