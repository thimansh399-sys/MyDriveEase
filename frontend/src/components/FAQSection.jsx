import { useState } from 'react';

const FAQS = [
  {
    q: 'How do I book a driver?',
    a: 'Simply enter your pickup and drop locations, select your service type, and click Book a Driver.'
  },
  {
    q: 'Are your drivers verified?',
    a: 'Yes, all drivers are background-checked, trained, and verified for your safety.'
  },
  {
    q: 'How do I contact support?',
    a: 'Use the in-app chat below or email us at support@driveease.com.'
  },
  {
    q: 'Can I book a driver for outstation trips?',
    a: 'Yes, you can book for both local and outstation rides.'
  }
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="w-full max-w-3xl mx-auto mt-20 px-4 md:px-0" aria-label="Frequently Asked Questions">
      <h2 className="text-3xl font-extrabold text-center text-white mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-[#111827] border border-[#19e68c] rounded-xl p-5">
            <button
              className="w-full text-left text-lg font-bold text-[#19e68c] focus:outline-none focus:ring-2 focus:ring-[#19e68c]"
              aria-expanded={open === i}
              aria-controls={`faq-panel-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
            </button>
            <div
              id={`faq-panel-${i}`}
              className={`mt-2 text-white transition-all ${open === i ? 'max-h-40' : 'max-h-0 overflow-hidden'}`}
              aria-hidden={open !== i}
            >
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
