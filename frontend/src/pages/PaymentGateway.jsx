import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { QRCodeSVG } from 'qrcode.react';

const PAYMENT_DETAILS = {
  name: 'HIMANSHU SINGH',
  account: '9014030768',
  ifsc: 'KKBK0005033',
  bank: 'KOTAK BANK',
  upi: '9014030768@kotak',
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
    <div className="min-h-screen bg-[#0a1019] flex flex-col items-center justify-center py-8 px-2 sm:px-8">
      <div className="bg-[#111827] rounded-2xl shadow-xl border border-[#19e68c] p-6 w-full max-w-md flex flex-col items-center">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">Payment Gateway</h1>
        <div className="mb-4 flex flex-col gap-1 w-full">
          <span className="text-[#19e68c] font-semibold">Account Name:</span>
          <span className="text-white">{PAYMENT_DETAILS.name}</span>
          <span className="text-[#19e68c] font-semibold mt-2">Account No:</span>
          <span className="text-white">{PAYMENT_DETAILS.account}</span>
          <span className="text-[#19e68c] font-semibold mt-2">IFSC:</span>
          <span className="text-white">{PAYMENT_DETAILS.ifsc}</span>
          <span className="text-[#19e68c] font-semibold mt-2">Bank:</span>
          <span className="text-white">{PAYMENT_DETAILS.bank}</span>
          <span className="text-[#19e68c] font-semibold mt-2">UPI ID:</span>
          <span className="text-white flex items-center gap-2">
            {PAYMENT_DETAILS.upi}
            <button
              className="ml-2 px-2 py-1 bg-[#19e68c] text-black rounded text-xs font-semibold hover:bg-[#16a34a] transition"
              onClick={() => handleCopy(PAYMENT_DETAILS.upi)}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </span>
        </div>
        <div className="my-6 flex flex-col items-center">
          <span className="text-[#19e68c] font-semibold mb-2">Scan to Pay (UPI QR)</span>
          <QRCodeSVG value={upiUrl} size={160} bgColor="#111827" fgColor="#19e68c" includeMargin={true} />
        </div>
        <a
          href={upiUrl}
          className="w-full mt-4 bg-[#19e68c] text-black py-3 rounded-xl font-bold text-base shadow hover:bg-[#16a34a] transition-all text-center"
        >
          Pay via UPI App
        </a>
        {/* Upload Screenshot */}
        <form onSubmit={handleUpload} className="w-full mt-6 flex flex-col gap-2 items-center">
          <label className="text-[#19e68c] font-semibold">Upload Payment Screenshot</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="text-white" />
          <button type="submit" className="bg-[#19e68c] text-black py-2 px-4 rounded font-bold mt-2" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
          {success && <div className={`mt-2 text-sm ${success.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>{success}</div>}
        </form>
        {/* Payment History */}
        <div className="w-full mt-8">
          <h2 className="text-lg font-bold text-white mb-2">Payment History</h2>
          {loading ? (
            <div className="text-[#19e68c]">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-gray-400">No payments yet.</div>
          ) : (
            <ul className="divide-y divide-[#222c37]">
              {history.map((p) => (
                <li key={p._id} className="py-2 flex flex-col">
                  <span className="text-white font-semibold">₹{p.amount}</span>
                  <span className="text-xs text-[#19e68c]">{new Date(p.date).toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{p.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
