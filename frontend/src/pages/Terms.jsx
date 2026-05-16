import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101924] to-[#1a3a2c] text-white py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Terms & Conditions
        </h1>
        <div className="bg-[#0d2233]/50 p-12 rounded-3xl border border-primary/30 backdrop-blur-sm prose prose-invert max-w-none">
          <h2>1. Service Overview</h2>
          <p>DriveEase provides verified professional drivers for one-way, hourly, and outstation trips. We connect users with background-checked drivers.</p>
          
          <h2>2. Booking & Cancellation</h2>
          <p>Bookings are instant. Cancellation within 15 minutes is free. After 15 minutes, standard cancellation fees apply based on ride type.</p>
          
          <h2>3. Payments</h2>
          <p>Transparent pricing. Payments via UPI, cards, or wallets. All fares displayed upfront with no hidden charges.</p>
          
          <h2>4. Driver Conduct</h2>
          <p>Drivers must follow traffic rules, maintain vehicle cleanliness, and provide courteous service. Report issues to support@driveease.com.</p>
          
          <h2>5. User Responsibilities</h2>
          <p>Provide accurate pickup locations. No smoking, no pets without prior approval. Respect driver and vehicle.</p>
          
          <h2>6. Liability</h2>
          <p>Rides include insurance coverage up to ₹5 lakhs. DriveEase not liable for personal belongings left in vehicle.</p>
          
          <h2>7. Governing Law</h2>
          <p>Subject to laws of India. Disputes resolved in courts of [City] jurisdiction.</p>
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

export default Terms;

