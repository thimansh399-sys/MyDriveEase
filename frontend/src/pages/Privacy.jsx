import React from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101924] to-[#1a3a2c] text-white py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <div className="bg-[#0d2233]/50 p-12 rounded-3xl border border-primary/30 backdrop-blur-sm prose prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>Personal info (name, phone, email), location data during rides, payment details, device info.</p>
          
          <h2>2. How We Use Your Data</h2>
          <p>Process bookings, driver matching, payments, service improvement, communication, legal compliance.</p>
          
          <h2>3. Data Sharing</h2>
          <p>Shared with drivers for pickup, payment processors, authorities if legally required. Never sold to third parties.</p>
          
          <h2>4. Location Data</h2>
          <p>Collected only during active rides and bookings. Stored temporarily for service quality. Not shared beyond necessary parties.</p>
          
          <h2>5. Your Rights</h2>
          <p>Access, correct, delete your data. Contact support@driveease.com. Opt-out of marketing anytime.</p>
          
          <h2>6. Security</h2>
          <p>Data encrypted in transit and at rest. Regular security audits. Access limited to authorized personnel.</p>
          
          <h2>7. Cookies</h2>
          <p>Use essential cookies for functionality, analytics cookies (opt-out available).</p>
          
          <h2>8. Changes to Policy</h2>
          <p>Updates posted here. Continued use constitutes acceptance.</p>
        </div>
        <div className="text-center mt-12">
          <p className="text-gray-400 mb-6">Last updated: December 2024</p>
          <Link to="/" className="inline-block bg-primary text-black px-8 py-4 rounded-2xl font-bold hover:bg-green-400 transition-all">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

