import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const PLANS = [
  { name: 'Daily Plan', price: 299, duration: '1 Day', features: ['Unlimited Rides', 'Anytime Booking'] },
  { name: 'Monthly Plan', price: 3999, duration: '30 Days', features: ['Unlimited Rides', 'Priority Support'] },
  { name: 'Family Plan', price: 4999, duration: '30 Days', features: ['Up to 4 Members', 'Unlimited Rides'] },
  { name: 'Senior Plan', price: 1999, duration: '30 Days', features: ['For Seniors', 'Priority Drivers'] },
  { name: 'Weekend Plan', price: 999, duration: '4 Days', features: ['Fri-Sun', 'Unlimited Rides'] },
  { name: 'Driver + Car Plan', price: 5999, duration: '30 Days', features: ['Car Included', 'Unlimited Rides'] },
];

export default function Plans() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', requirement: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      await api.post('/subscriptions', form);
      setSuccess('Subscription submitted!');
      setForm({ name: '', phone: '', city: '', requirement: '' });
    } catch {
      setSuccess('Failed to submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0a1019] text-white p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Plans & Subscriptions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {PLANS.map(plan => (
          <div key={plan.name} className="bg-[#111827] rounded-2xl p-6 shadow border border-[#19e68c]">
            <h2 className="text-xl font-bold mb-2 text-[#19e68c]">{plan.name}</h2>
            <div className="mb-2">₹{plan.price} / {plan.duration}</div>
            <ul className="mb-2 list-disc ml-5">
              {plan.features.map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="bg-[#111827] rounded-2xl p-6 shadow border border-[#19e68c] flex flex-col gap-4 max-w-md mx-auto">
        <h2 className="text-lg font-bold mb-2 text-[#19e68c]">Subscribe Now</h2>
        <input name="name" required placeholder="Name" className="px-4 py-2 rounded bg-[#222c37] text-white" value={form.name} onChange={handleChange} />
        <input name="phone" required placeholder="Phone" className="px-4 py-2 rounded bg-[#222c37] text-white" value={form.phone} onChange={handleChange} />
        <input name="city" required placeholder="City" className="px-4 py-2 rounded bg-[#222c37] text-white" value={form.city} onChange={handleChange} />
        <input name="requirement" placeholder="Requirement" className="px-4 py-2 rounded bg-[#222c37] text-white" value={form.requirement} onChange={handleChange} />
        <button type="submit" className="bg-[#19e68c] text-black py-2 rounded font-bold mt-2" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
        {success && <div className={`mt-2 text-sm ${success.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{success}</div>}
      </form>
    </div>
  );
}
