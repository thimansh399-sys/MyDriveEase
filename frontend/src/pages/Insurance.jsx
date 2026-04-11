import React, { useState } from 'react';
import api from '../utils/api';

export default function Insurance() {
  const [buying, setBuying] = useState(false);
  const [success, setSuccess] = useState(null);
  const handleBuy = async () => {
    setBuying(true);
    setSuccess(null);
    try {
      await api.post('/insurance/buy', { plan: 'Monthly Safety Plan' });
      setSuccess('Insurance purchased!');
    } catch {
      setSuccess('Failed to buy insurance.');
    } finally {
      setBuying(false);
    }
  };
  const handleSOS = () => alert('SOS sent to support!');
  const handleAmbulance = () => alert('Ambulance is being called!');
  return (
    <div className="min-h-screen bg-[#0a1019] text-white p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Insurance & Safety Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[#111827] rounded-2xl p-6 shadow border border-[#19e68c]">
          <h2 className="text-lg font-bold mb-2 text-[#19e68c]">Per Ride Insurance</h2>
          <div>Coverage: ₹2,00,000</div>
          <div>Charges: ₹49/ride</div>
          <div>Validity: 1 ride</div>
        </div>
        <div className="bg-[#111827] rounded-2xl p-6 shadow border border-[#19e68c]">
          <h2 className="text-lg font-bold mb-2 text-[#19e68c]">Monthly Safety Plan</h2>
          <div>Coverage: ₹5,00,000</div>
          <div>Charges: ₹499/month</div>
          <div>Validity: 30 days</div>
        </div>
        <div className="bg-[#111827] rounded-2xl p-6 shadow border border-[#19e68c]">
          <h2 className="text-lg font-bold mb-2 text-[#19e68c]">Family Safety Plan</h2>
          <div>Coverage: ₹10,00,000</div>
          <div>Charges: ₹999/month</div>
          <div>Validity: 30 days</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <button className="bg-[#19e68c] text-black py-2 rounded font-bold" onClick={handleBuy} disabled={buying}>{buying ? 'Processing...' : 'Buy Insurance'}</button>
        <button className="bg-red-500 text-white py-2 rounded font-bold" onClick={handleSOS}>SOS</button>
        <button className="bg-blue-500 text-white py-2 rounded font-bold" onClick={handleAmbulance}>Call Ambulance</button>
        {success && <div className={`mt-2 text-sm ${success.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{success}</div>}
      </div>
      <div className="bg-[#111827] rounded-2xl p-4 shadow border border-[#19e68c]">
        <div className="font-bold text-[#19e68c] mb-1">Support: Krishna Pandey</div>
        <div>📞 <a href="tel:+917836887228" className="underline">+91-7836887228</a></div>
      </div>
    </div>
  );
}
