import React from 'react';
import { Link } from 'react-router-dom';

const Faqs = () => {
  const faqs = [
    {
      q: 'How does DriveEase work?',
      a: 'Enter pickup/destination, choose ride type, book instantly with verified drivers.'
    },
    {
      q: 'Are drivers background verified?',
      a: 'Yes, all drivers undergo thorough background checks and training.'
    },
    {
      q: 'What payment methods are accepted?',
      a: 'UPI, cards, wallets. Transparent pricing with no hidden fees.'
    },
    {
      q: 'Is my ride insured?',
      a: 'Yes, all rides include insurance coverage for peace of mind.'
    },
    {
      q: 'Can I track my driver?',
      a: 'Real-time GPS tracking shows exact driver location and ETA.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101924] to-[#1a3a2c] text-white py-16 px-6 md:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#0d2233]/50 p-8 rounded-2xl border border-primary/30 backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">{faq.q}</h3>
              <p className="text-gray-200 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link to="/" className="inline-block bg-primary text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-400 transition-all">
            Book Your Ride Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Faqs;

