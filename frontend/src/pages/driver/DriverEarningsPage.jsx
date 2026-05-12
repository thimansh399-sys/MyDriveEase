import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function DriverEarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        // Using same driver/me which includes earnings fields.
        const res = await api.get('/drivers/me');
        if (mounted) setData(res.data);
      } catch {
        if (mounted) setData(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const earningsToday = data?.earningsToday || 0;
  const totalEarnings = data?.earnings || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold text-green-300">Earnings</h1>
      <p className="text-gray-300 mt-1">Your current earnings summary.</p>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="bg-[#0f172a] border border-green-400/20 rounded-2xl p-5">
          <div className="text-gray-300 font-semibold">Today's Earnings</div>
          <div className="text-4xl font-extrabold text-green-300 mt-2">₹{earningsToday}</div>
        </div>

        <div className="bg-[#0f172a] border border-green-400/20 rounded-2xl p-5">
          <div className="text-gray-300 font-semibold">Total Earnings</div>
          <div className="text-4xl font-extrabold text-green-300 mt-2">₹{totalEarnings}</div>
        </div>
      </div>

      <div className="mt-6 bg-[#0f172a] border border-green-400/20 rounded-2xl p-5">
        <div className="text-white font-bold">Withdraw (Demo)</div>
        <p className="text-gray-300 text-sm mt-1">
          Withdrawal UI can be connected later.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <input
            type="number"
            min="1"
            placeholder="Withdraw amount"
            className="px-4 py-3 rounded-xl bg-[#16202b] border border-green-400/20 text-white w-full md:w-64"
          />
          <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-green-300 to-emerald-500 text-black font-bold shadow hover:brightness-110 transition">
            Withdraw
          </button>
        </div>
      </div>

      {loading && <div className="mt-4 text-gray-400">Loading...</div>}
    </div>
  );
}

