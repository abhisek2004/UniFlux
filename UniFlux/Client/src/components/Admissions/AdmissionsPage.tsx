import React from 'react';

const AdmissionsPage: React.FC = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">🎓 Admissions</h1>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Purpose</h2>
      <p>Guides prospective students through the process of joining the university, from inquiry to enrollment.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Overview</h2>
      <p>Find all the information you need to apply to CampusCore University, including eligibility, application steps, fees, scholarships, and support contacts.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Admission Requirements</h2>
      <ul className="list-disc ml-6">
        <li>Completed application form</li>
        <li>Academic transcripts</li>
        <li>Proof of identity</li>
        <li>Standardized test scores (if applicable)</li>
        <li>Letters of recommendation</li>
      </ul>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Application Process</h2>
      <ol className="list-decimal ml-6">
        <li>Review requirements and gather documents</li>
        <li>Complete the online application form</li>
        <li>Pay the application fee</li>
        <li>Submit supporting documents</li>
        <li>Track your application status online</li>
      </ol>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Fee Structure</h2>
      <p>See the <a href="#" className="text-blue-600 underline">full fee structure</a> for tuition, hostel, and other charges. Payment plans and financial aid are available.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Scholarships</h2>
      <p>Merit-based and need-based scholarships are available. <a href="#" className="text-blue-600 underline">Learn more and apply</a>.</p>
    </section>
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2">FAQs</h2>
      <ul className="list-disc ml-6">
        <li>How do I apply for a scholarship?</li>
        <li>What documents are required?</li>
        <li>How can I check my application status?</li>
      </ul>
    </section>
    <section>
      <h2 className="text-xl font-semibold mb-2">Contact Admissions</h2>
      <p>Email: admissions@campuscore.edu | Phone: +1 (555) 234-5678</p>
    </section>
  </div>
);

export default AdmissionsPage; 