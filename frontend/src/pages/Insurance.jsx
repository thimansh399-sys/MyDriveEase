      {/* Driver Coverage Section */}
      <div className="w-full flex flex-col items-center justify-center pb-0">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center tracking-tight">
          <span className="text-white">Driver </span><span className="text-[#19e68c]">Coverage</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><rect x="4" y="16" width="28" height="12" rx="6" fill="#19e68c" opacity="0.15"/><rect x="10" y="20" width="16" height="6" rx="3" fill="#19e68c"/><rect x="14" y="24" width="2" height="2" rx="1" fill="#fff"/><rect x="20" y="24" width="2" height="2" rx="1" fill="#fff"/></svg>
            <div className="font-bold text-white mb-1">₹3 Lakh Driver Cover</div>
            <div className="text-[#a7f3d0] text-center">Accidental cover for driver during the ride</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><path d="M10 26l8-16 8 16H10z" fill="#a7f3d0" opacity="0.15"/><path d="M10 26l8-16 8 16H10z" fill="#a7f3d0"/></svg>
            <div className="font-bold text-white mb-1">Vehicle Damage</div>
            <div className="text-[#a7f3d0] text-center">Covers repair cost for ride-related vehicle damage</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><rect x="8" y="8" width="20" height="20" rx="6" fill="#a7f3d0" opacity="0.15"/><rect x="13" y="13" width="10" height="10" rx="5" fill="#a7f3d0"/></svg>
            <div className="font-bold text-white mb-1">₹50K Medical</div>
            <div className="text-[#a7f3d0] text-center">Up to ₹50,000 medical expenses for the driver</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] md:col-span-3">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><rect x="6" y="20" width="24" height="8" rx="4" fill="#19e68c" opacity="0.15"/><rect x="12" y="24" width="12" height="4" rx="2" fill="#19e68c"/></svg>
            <div className="font-bold text-white mb-1">Towing Assist</div>
            <div className="text-[#a7f3d0] text-center">Free towing up to 25 km in case of breakdown</div>
          </div>
        </div>
      </div>
import React, { useState } from 'react';

export default function Insurance() {
  const [activeTab, setActiveTab] = useState('passenger');
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1019] via-[#0f172a] to-[#1e293b] text-white p-0 w-full">
      {/* Hero Section */}
      <div className="w-full px-4 pt-14 pb-2 flex flex-col items-center justify-center">
        <div className="mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[#0a1e16] border border-[#19e68c] text-[#19e68c] font-bold tracking-wide text-xs md:text-sm">RIDE PROTECTION</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-center tracking-tight drop-shadow-lg">
          <span className="text-[#19e68c]">₹5 Lakh</span> <span className="text-white">Accidental Cover</span>
        </h1>
        <div className="text-xl md:text-2xl mb-2 text-center font-bold">
          Only <span className="text-[#19e68c]">₹29</span>–<span className="text-[#19e68c]">₹49</span> per ride
        </div>
        <div className="text-base md:text-lg text-[#a7f3d0] mb-8 text-center font-medium max-w-2xl">
          Smart pricing based on distance & ride type. The safest way to ride.
        </div>
        {/* Stat Cards */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8 w-full max-w-2xl">
          <div className="flex-1 min-w-[120px] bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <div className="text-2xl font-extrabold text-[#19e68c] mb-1">₹5L</div>
            <div className="text-base text-[#a7f3d0]">Passenger Cover</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <div className="text-2xl font-extrabold text-[#19e68c] mb-1">₹3L</div>
            <div className="text-base text-[#a7f3d0]">Driver Cover</div>
          </div>
          <div className="flex-1 min-w-[120px] bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <div className="text-2xl font-extrabold text-[#19e68c] mb-1">₹29</div>
            <div className="text-base text-[#a7f3d0]">Starting At</div>
          </div>
        </div>
        {/* Toggle Buttons */}
        <div className="flex gap-4 mb-10">
          <button
            className={`px-6 py-2 rounded-xl font-bold border-2 transition-all duration-200 ${activeTab === 'passenger' ? 'bg-[#0a1e16] border-[#19e68c] text-[#19e68c]' : 'bg-[#101624] border-[#232c3a] text-white'}`}
            onClick={() => setActiveTab('passenger')}
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#19e68c]" /> Passenger Insurance
            </span>
          </button>
          <button
            className={`px-6 py-2 rounded-xl font-bold border-2 transition-all duration-200 ${activeTab === 'driver' ? 'bg-[#0a1e16] border-[#19e68c] text-[#19e68c]' : 'bg-[#101624] border-[#232c3a] text-white'}`}
            onClick={() => setActiveTab('driver')}
          >
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-[#e09e3e]" /> Driver Insurance
            </span>
          </button>
        </div>
      </div>
      {/* Smart Pricing Section */}
      <div className="w-full flex flex-col items-center justify-center pb-0">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center tracking-tight">
          <span className="text-white">Smart </span><span className="text-[#19e68c]">Pricing</span>
        </h2>
        <div className="text-base md:text-lg text-[#a7f3d0] text-center font-medium max-w-2xl mb-8">
          Price adjusts automatically based on ride distance, time & type
        </div>
        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch w-full max-w-5xl mb-16">
          <div className="flex-1 bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] min-w-[220px]">
            <div className="mb-2"><span className="inline-block px-3 py-1 rounded-full bg-[#0a1e16] text-[#19e68c] font-bold text-xs">SHORT RIDE</span></div>
            <div className="text-3xl font-extrabold text-white mb-1">₹29</div>
            <div className="text-base text-[#a7f3d0] mb-2">Up to 10 km</div>
            <div className="text-sm font-bold text-[#19e68c] bg-[#0a1e16] rounded px-3 py-1">₹5L cover</div>
          </div>
          <div className="flex-1 bg-[#101624] rounded-2xl p-6 flex flex-col items-center border-2 border-[#19e68c] min-w-[220px] shadow-lg">
            <div className="mb-2"><span className="inline-block px-3 py-1 rounded-full bg-[#19e68c] text-[#0a1019] font-bold text-xs">BEST VALUE</span></div>
            <div className="text-3xl font-extrabold text-white mb-1">₹35–₹39</div>
            <div className="text-base text-[#a7f3d0] mb-2">10–50 km / Night rides</div>
            <div className="text-sm font-bold text-[#19e68c] bg-[#0a1e16] rounded px-3 py-1">₹5L cover</div>
          </div>
          <div className="flex-1 bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] min-w-[220px]">
            <div className="mb-2"><span className="inline-block px-3 py-1 rounded-full bg-[#0a1e16] text-[#19e68c] font-bold text-xs">OUTSTATION</span></div>
            <div className="text-3xl font-extrabold text-white mb-1">₹45–₹49</div>
            <div className="text-base text-[#a7f3d0] mb-2">50+ km / Premium rides</div>
            <div className="text-sm font-bold text-[#19e68c] bg-[#0a1e16] rounded px-3 py-1">₹5L cover</div>
          </div>
          <div className="flex-1 bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] min-w-[220px]">
            <div className="mb-2"><span className="inline-block px-3 py-1 rounded-full bg-[#101624] text-[#3b82f6] font-bold text-xs">DRIVER</span></div>
            <div className="text-3xl font-extrabold text-white mb-1">₹29</div>
            <div className="text-base text-[#a7f3d0] mb-2">All rides — flat rate</div>
            <div className="text-sm font-bold text-[#3b82f6] bg-[#0a1e16] rounded px-3 py-1">₹3L cover</div>
          </div>
        </div>
      </div>

      {/* Passenger Coverage Section */}
      <div className="w-full flex flex-col items-center justify-center pb-0">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center tracking-tight">
          <span className="text-white">Passenger </span><span className="text-[#19e68c]">Coverage</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16">
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><circle cx="18" cy="18" r="16" fill="#19e68c" opacity="0.15"/><path d="M18 10l7 4v4c0 5-3 8-7 8s-7-3-7-8v-4l7-4z" fill="#19e68c" stroke="#19e68c" strokeWidth="1.5"/></svg>
            <div className="font-bold text-white mb-1">₹5 Lakh Accident Cover</div>
            <div className="text-[#a7f3d0] text-center">Full accidental damage cover for passenger & co-passengers</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><rect x="8" y="8" width="20" height="20" rx="6" fill="#a7f3d0" opacity="0.15"/><rect x="13" y="13" width="10" height="10" rx="5" fill="#a7f3d0"/></svg>
            <div className="font-bold text-white mb-1">Medical Emergency</div>
            <div className="text-[#a7f3d0] text-center">Up to ₹1 lakh medical expenses covered instantly</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><rect x="6" y="16" width="24" height="8" rx="4" fill="#19e68c" opacity="0.15"/><rect x="12" y="20" width="12" height="4" rx="2" fill="#19e68c"/></svg>
            <div className="font-bold text-white mb-1">Free Ambulance</div>
            <div className="text-[#a7f3d0] text-center">Ambulance dispatch within minutes — zero cost</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><path d="M18 6l6 10H12l6-10z" fill="#e09e3e" opacity="0.15"/><path d="M18 6l6 10H12l6-10z" fill="#e09e3e"/></svg>
            <div className="font-bold text-white mb-1">Third-Party Liability</div>
            <div className="text-[#a7f3d0] text-center">Legal & financial protection against third-party claims</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><circle cx="18" cy="18" r="16" fill="#19e68c" opacity="0.15"/><path d="M18 12v12" stroke="#19e68c" strokeWidth="2"/><path d="M12 18h12" stroke="#19e68c" strokeWidth="2"/></svg>
            <div className="font-bold text-white mb-1">24/7 Helpline</div>
            <div className="text-[#a7f3d0] text-center">One-call emergency assistance, anytime anywhere</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a]">
            <svg width="36" height="36" fill="none" viewBox="0 0 36 36" className="mb-2"><path d="M18 6v24" stroke="#e09e3e" strokeWidth="2"/><path d="M12 18h12" stroke="#e09e3e" strokeWidth="2"/></svg>
            <div className="font-bold text-white mb-1">Instant Claim</div>
            <div className="text-[#a7f3d0] text-center">File claims in-app — settlement within 48 hours</div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full flex flex-col items-center justify-center pb-0">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center tracking-tight">
          <span className="text-white">How It </span><span className="text-[#19e68c]">Works</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mb-16 justify-center items-stretch">
          <div className="flex-1 bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] min-w-[220px]">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#232c3a] text-[#19e68c] font-bold mb-2">1</div>
            <div className="font-bold text-white mb-1">Book a Ride</div>
            <div className="text-[#a7f3d0] text-center">Book your ride as usual through DriveEase</div>
          </div>
          <div className="flex-1 bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] min-w-[220px]">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#232c3a] text-[#19e68c] font-bold mb-2">2</div>
            <div className="font-bold text-white mb-1">Smart Suggestion</div>
            <div className="text-[#a7f3d0] text-center">We analyze time, distance & route to suggest the best cover</div>
          </div>
          <div className="flex-1 bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] min-w-[220px]">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#232c3a] text-[#19e68c] font-bold mb-2">3</div>
            <div className="font-bold text-white mb-1">₹5L Cover Active</div>
            <div className="text-[#a7f3d0] text-center">One tap — ₹29 to ₹49. Instant protection.</div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full flex flex-col items-center justify-center pb-0">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-center tracking-tight">
          <span className="text-white">Frequently </span><span className="text-[#19e68c]">Asked</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mb-10">
          <div className="bg-[#101624] rounded-2xl p-6 border border-[#232c3a]">
            <div className="font-bold text-[#19e68c] mb-1">₹5 lakh accidental cover only ₹49?</div>
            <div className="text-[#a7f3d0]">Yes! Starting from ₹29 for short rides, up to ₹49 for outstation — covers accident damage, medical & more.</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 border border-[#232c3a]">
            <div className="font-bold text-[#19e68c] mb-1">Why does price change?</div>
            <div className="text-[#a7f3d0]">Smart pricing — short city rides are ₹29, night/long-distance go up to ₹49. Always fair.</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 border border-[#232c3a]">
            <div className="font-bold text-[#19e68c] mb-1">Is there driver insurance too?</div>
            <div className="text-[#a7f3d0]">Yes! Drivers get ₹3 lakh cover + vehicle damage + towing at flat ₹29/ride.</div>
          </div>
          <div className="bg-[#101624] rounded-2xl p-6 border border-[#232c3a]">
            <div className="font-bold text-[#19e68c] mb-1">How do I claim?</div>
            <div className="text-[#a7f3d0]">In-app claim filing or call our 24/7 helpline. Settlement within 48 hours.</div>
          </div>
        </div>
        {/* Emergency Helpline */}
        <div className="w-full max-w-md mx-auto bg-[#101624] rounded-2xl p-6 flex flex-col items-center border border-[#232c3a] mb-16">
          <div className="flex items-center gap-2 mb-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M14 2C7.373 2 2 7.373 2 14s5.373 12 12 12 12-5.373 12-12S20.627 2 14 2zm0 22c-5.523 0-10-4.477-10-10S8.477 4 14 4s10 4.477 10 10-4.477 10-10 10zm-1-7h2v2h-2v-2zm0-8h2v6h-2V9z" fill="#e53e3e"/></svg>
            <span className="font-bold text-lg text-white">Emergency Helpline</span>
          </div>
          <a href="tel:+917836887228" className="text-[#19e68c] font-extrabold text-xl underline">+91-7836887228</a>
        </div>
      </div>
    </div>
  );
}
