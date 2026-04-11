import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';


const PAYMENT_DETAILS = {
  name: 'HIMANSHU SINGH',
  account: '7836887228',
  ifsc: 'KKBK0005033',
  bank: 'KOTAK BANK',
  upi: '7836887228@okaxis',
};
const upiUrl = `upi://pay?pa=${PAYMENT_DETAILS.upi}&pn=${encodeURIComponent(PAYMENT_DETAILS.name)}&cu=INR`;

const PaymentGateway = () => {
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch payment history with auto-refresh
  useEffect(() => {
    let interval;
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/payments/my');
        setHistory(res.data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
    interval = setInterval(fetchHistory, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('screenshot', file);
      await api.post('/payments/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Screenshot uploaded!');
      setFile(null);
    } catch {
      setSuccess('Failed to upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1019] via-[#0f172a] to-[#1e293b] flex flex-col items-center py-8 px-2">
      {/* Hero Section */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="16" rx="8" fill="#19e68c" opacity="0.15"/><rect x="8" y="12" width="16" height="8" rx="4" fill="#19e68c"/></svg>
          <span className="text-3xl md:text-4xl font-extrabold text-white"><span className="text-[#19e68c]">DriveEase</span> Payment</span>
        </div>
        <div className="text-[#a7f3d0] text-lg mb-6 text-center">Secure & fast payment for your ride</div>
      </div>
      {/* Amount Card */}
      <div className="w-full max-w-xl mx-auto bg-[#101624] rounded-2xl border border-[#19e68c] shadow-xl p-8 flex flex-col items-center mb-8">
        <div className="text-[#a7f3d0] font-semibold mb-2 tracking-wide">AMOUNT TO PAY</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#19e68c] text-3xl font-extrabold">₹</span>
          <span className="text-3xl font-extrabold text-white">0</span>
        </div>
        <input type="text" className="w-full mt-2 px-4 py-2 rounded-lg bg-[#181f2a] border border-[#232c3a] text-white text-center font-semibold focus:outline-none focus:border-[#19e68c]" placeholder="Enter Booking ID / Reference" />
      </div>
      {/* Payment Methods */}
      <div className="w-full max-w-xl mx-auto flex flex-row gap-4 mb-8">
        <div className="flex-1 bg-[#101624] rounded-2xl border-2 border-[#19e68c] p-4 flex flex-col items-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#19e68c] text-[#0a1019] text-xs font-bold px-3 py-1 rounded-full shadow tracking-wide border-2 border-white/20">Recommended</div>
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28" className="mb-2"><rect x="4" y="8" width="20" height="12" rx="6" fill="#19e68c" opacity="0.15"/><rect x="8" y="12" width="12" height="4" rx="2" fill="#19e68c"/></svg>
          <div className="font-bold text-white">UPI</div>
        </div>
        <div className="flex-1 bg-[#101624] rounded-2xl border-2 border-[#232c3a] p-4 flex flex-col items-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#19e68c] text-[#0a1019] text-xs font-bold px-3 py-1 rounded-full shadow tracking-wide border-2 border-white/20">Fastest</div>
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="4" y="4" width="20" height="20" rx="10" fill="#a7f3d0" opacity="0.15"/><rect x="8" y="8" width="12" height="12" rx="6" fill="#a7f3d0"/></svg>
          <div className="font-bold text-white">Scan QR</div>
        </div>
        <div className="flex-1 bg-[#101624] rounded-2xl border-2 border-[#232c3a] p-4 flex flex-col items-center">
          <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="4" y="8" width="20" height="12" rx="6" fill="#a7f3d0" opacity="0.15"/><rect x="8" y="12" width="12" height="4" rx="2" fill="#a7f3d0"/></svg>
          <div className="font-bold text-white">Bank Transfer</div>
        </div>
      </div>
      {/* UPI ID Section */}
      <div className="w-full max-w-xl mx-auto bg-[#101624] rounded-2xl border border-[#232c3a] shadow p-6 flex flex-col items-center mb-8">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <div className="text-[#a7f3d0] text-xs font-semibold">UPI ID</div>
            <div className="text-[#19e68c] font-extrabold text-lg md:text-xl">{PAYMENT_DETAILS.upi}</div>
          </div>
          <button
            className="bg-[#19e68c] text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#16a34a] transition"
            onClick={() => handleCopy(PAYMENT_DETAILS.upi)}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="w-full flex flex-row gap-2 justify-center mb-2">
          <a href={upiUrl} className="flex-1 bg-[#232c3a] rounded-lg p-3 flex flex-col items-center hover:bg-[#19e68c]/10 transition">
            <span className="text-[#19e68c] font-bold">G</span>
          </a>
          <a href={upiUrl} className="flex-1 bg-[#232c3a] rounded-lg p-3 flex flex-col items-center hover:bg-[#19e68c]/10 transition">
            <span className="text-[#a259ff] font-bold">P</span>
          </a>
          <a href={upiUrl} className="flex-1 bg-[#232c3a] rounded-lg p-3 flex flex-col items-center hover:bg-[#19e68c]/10 transition">
            <span className="text-[#19e68c] font-bold">₹</span>
          </a>
          <a href={upiUrl} className="flex-1 bg-[#232c3a] rounded-lg p-3 flex flex-col items-center hover:bg-[#19e68c]/10 transition">
            <span className="text-[#0a1019] font-bold">U</span>
          </a>
        </div>
      </div>
      {/* QR Code Section */}
      <div className="w-full max-w-xl mx-auto bg-[#101624] rounded-2xl border border-[#232c3a] shadow p-6 flex flex-col items-center mb-8">
        <span className="text-[#19e68c] font-semibold mb-2">Scan to Pay (UPI QR)</span>
        <QRCodeSVG value={upiUrl} size={160} bgColor="#111827" fgColor="#19e68c" includeMargin={true} />
      </div>
      {/* Bank Details Section */}
      <div className="w-full max-w-xl mx-auto bg-[#101624] rounded-2xl border border-[#232c3a] shadow p-6 flex flex-col items-center mb-8">
        <div className="w-full flex flex-col gap-2">
          <div className="text-[#a7f3d0] text-xs font-semibold">Account Name</div>
          <div className="text-white font-bold">{PAYMENT_DETAILS.name}</div>
          <div className="text-[#a7f3d0] text-xs font-semibold mt-2">Account Number</div>
          <div className="text-white font-bold">{PAYMENT_DETAILS.account}</div>
          <div className="text-[#a7f3d0] text-xs font-semibold mt-2">IFSC</div>
          <div className="text-white font-bold">{PAYMENT_DETAILS.ifsc}</div>
          <div className="text-[#a7f3d0] text-xs font-semibold mt-2">Bank</div>
          <div className="text-white font-bold">{PAYMENT_DETAILS.bank}</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
