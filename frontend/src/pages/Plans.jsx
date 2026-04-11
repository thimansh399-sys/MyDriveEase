
import React, { useState } from 'react';
import api from '../utils/api';


const PLANS = [
  {
    name: 'BASIC',
    price: 0,
    per: 'month',
    highlight: false,
    color: 'from-[#232c3a] to-[#232c3a]',
    dot: 'bg-[#19e68c]',
    subtitle: 'Best for normal users',
    features: [
      { label: 'Standard pricing per ride', type: 'yes' },
      { label: 'Normal driver allocation', type: 'yes' },
      { label: 'Limited offers', type: 'yes' },
      { label: 'Priority booking', type: 'no' },
      { label: 'Ride discounts', type: 'no' },
    ],
    details: [
      { label: 'Booking Quote', value: '₹250', color: 'text-[#19e68c]' },
      { label: 'Priority Badge', value: 'Standard', color: 'text-white' },
      { label: 'Driver Quality', value: 'Normal drivers', color: 'text-[#19e68c]' },
    ],
    cta: 'Continue Free',
    usecase: 'First-time users / casual riders',
    ctaColor: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'SMART',
    price: 99,
    per: 'month',
    highlight: true,
    color: 'from-[#19e68c] to-[#128c7e]',
    dot: 'bg-[#19e68c]',
    subtitle: 'Most users ke liye perfect',
    features: [
      { label: 'Faster driver allocation', type: 'yes' },
      { label: '5–10% discount per ride', type: 'yes' },
      { label: 'Better rated drivers', type: 'yes' },
      { label: 'Priority support', type: 'yes' },
      { label: 'Weekly coupons', type: 'yes' },
    ],
    details: [
      { label: 'Booking Quote', value: '₹230', color: 'text-[#19e68c]' },
      { label: 'Priority Badge', value: 'Priority', color: 'text-[#19e68c]' },
      { label: 'Driver Quality', value: '4++ drivers', color: 'text-[#19e68c]' },
    ],
    cta: 'Choose SMART',
    usecase: 'Daily riders who want savings + faster pickups',
    ctaColor: 'bg-[#19e68c] hover:bg-[#128c7e] text-black',
    badge: 'MOST POPULAR',
  },
  {
    name: 'PREMIUM / ELITE',
    price: 299,
    per: 'month',
    highlight: false,
    color: 'from-[#a6642f] to-[#e09e3e]',
    dot: 'bg-[#e09e3e]',
    subtitle: 'High-value customers ke liye',
    features: [
      { label: 'Instant driver matching (top priority)', type: 'yes' },
      { label: '10–15% discount on rides', type: 'yes' },
      { label: 'Top-rated drivers only', type: 'yes' },
      { label: 'Premium live tracking + premium support', type: 'yes' },
      { label: 'Free cancellation (limited)', type: 'yes' },
      { label: 'Corporate use friendly', type: 'yes' },
    ],
    details: [
      { label: 'Booking Quote', value: '₹210', color: 'text-[#e09e3e]' },
      { label: 'Priority Badge', value: '🔥 Fastest Pickup', color: 'text-[#e09e3e]' },
      { label: 'Driver Quality', value: '4.5++ verified drivers', color: 'text-[#e09e3e]' },
    ],
    cta: 'Choose PREMIUM',
    usecase: 'Power users, business travel, corporate teams',
    ctaColor: 'bg-[#e09e3e] hover:bg-[#a6642f] text-white',
  },
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
    <div className="min-h-screen bg-gradient-to-br from-[#0a1019] via-[#0f172a] to-[#1e293b] text-white p-0 max-w-full">
      {/* Hero Section */}
      <div className="w-full px-4 pt-10 pb-2 md:pt-16 md:pb-6 flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1019] via-[#0f172a] to-[#1e293b]">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-center tracking-tight text-white drop-shadow-lg">Choose the right plan for you</h1>
        <div className="text-lg md:text-xl text-[#a7f3d0] mb-8 text-center font-medium">Faster allocation, better drivers, and smarter pricing from BASIC to ELITE.</div>
      </div>
      {/* Plans Cards */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-stretch mb-14 max-w-7xl mx-auto px-2">
        {PLANS.map((plan, idx) => (
          <div
            key={plan.name}
            className={`relative flex-1 flex flex-col rounded-2xl shadow-xl border border-white/10 bg-gradient-to-br ${plan.color} p-8 min-w-[320px] max-w-[400px] mx-auto ${plan.highlight ? 'scale-105 z-10 shadow-2xl border-4 border-[#19e68c]/80' : ''}`}
            style={{ boxShadow: plan.highlight ? '0 8px 32px 0 #19e68c55, 0 2px 8px 0 #fff2 inset' : '0 4px 16px 0 #232c3a44' }}
          >
            {/* Highlight badge */}
            {plan.badge && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#19e68c] text-[#0a1019] text-xs font-bold px-4 py-1 rounded-full shadow-lg tracking-wide border-2 border-white/40">{plan.badge}</div>
            )}
            {/* Dot */}
            <div className={`absolute top-6 left-6 w-3 h-3 rounded-full ${plan.dot} border-2 border-white/40`} />
            <div className="mb-2 mt-2 text-xl font-extrabold tracking-wide">{plan.name}</div>
            <div className="mb-2 text-sm text-[#a7f3d0] font-medium">{plan.subtitle}</div>
            <div className="flex items-end gap-2 mb-4 mt-2">
              <span className="text-4xl font-black text-white">₹{plan.price}</span>
              <span className="text-base font-semibold text-[#a7f3d0]">/ {plan.per}</span>
            </div>
            {/* Details grid */}
            <div className="rounded-xl bg-[#101624]/80 border border-white/10 p-4 mb-4">
              {plan.details.map((d, i) => (
                <div key={d.label} className="flex justify-between items-center text-sm mb-1">
                  <span className="font-medium text-white/80">{d.label}</span>
                  <span className={`font-bold ${d.color}`}>{d.value}</span>
                </div>
              ))}
            </div>
            {/* Features */}
            <ul className="flex-1 mb-4 space-y-2">
              {plan.features.map((f, i) => (
                <li key={f.label} className="flex items-center gap-2 text-base font-medium">
                  {f.type === 'yes' ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#19e68c] text-[#0a1019] font-bold text-lg">✓</span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#e53e3e] text-white font-bold text-lg">✗</span>
                  )}
                  <span className={f.type === 'no' ? 'opacity-60 line-through' : ''}>{f.label}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-[#a7f3d0] mb-4 mt-2">Use case: <span className="font-semibold text-white/90">{plan.usecase}</span></div>
            <button
              className={`w-full py-3 rounded-xl font-extrabold text-lg mt-auto shadow-lg transition-all duration-200 ${plan.ctaColor}`}
              onClick={() => alert(`Selected plan: ${plan.name}`)}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
