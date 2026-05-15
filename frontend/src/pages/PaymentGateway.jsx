import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Clipboard, IndianRupee, ReceiptText, Upload } from 'lucide-react';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';

const PAYMENT_DETAILS = {
  name: 'HIMANSHU SINGH',
  account: '9014030768',
  ifsc: 'KKBK0005033',
  bank: 'KOTAK BANK',
  upi: '7007515654@kotak',
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const PaymentGateway = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [history, setHistory] = useState([]);
  const [reference, setReference] = useState('');
  const [file, setFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(Boolean(bookingId));
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const amount = booking?.fare?.total || payment?.amount || 0;
  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: PAYMENT_DETAILS.upi,
      pn: PAYMENT_DETAILS.name,
      am: String(amount || ''),
      cu: 'INR',
      tn: bookingId ? `DriveEase booking ${bookingId}` : 'DriveEase ride payment',
    });
    return `upi://pay?${params.toString()}`;
  }, [amount, bookingId]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (bookingId) {
          const res = await api.get(`/payments/booking/${bookingId}`);
          setBooking(res.data.booking);
          setPayment(res.data.payment);
          setReference(res.data.payment?.reference || '');
        }

        const historyRes = await api.get('/payments/my');
        setHistory(historyRes.data || []);
      } catch {
        setMessage('Payment details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!bookingId) {
      setMessage('Open payment from a booking to submit proof.');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const screenshotData = file ? await fileToDataUrl(file) : '';
      const res = await api.post('/payments/upload', {
        bookingId,
        reference,
        screenshotData,
        screenshotName: file?.name || '',
      });

      setPayment(res.data.payment);
      setFile(null);
      setMessage('Payment proof submitted. Admin will verify it soon.');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to submit payment proof.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1019] via-[#0f172a] to-[#1e293b] px-4 py-8 text-white">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-green-400/20 bg-[#101624] p-6 shadow-2xl shadow-black/20">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-500/15 text-green-300">
              <IndianRupee size={30} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-green-300">DriveEase Payment</p>
              <h1 className="text-3xl font-black">Secure ride payment</h1>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-slate-900 p-6 text-slate-300">Loading payment details...</div>
          ) : (
            <>
              <div className="rounded-3xl border border-green-400/20 bg-green-500/10 p-6 text-center">
                <p className="text-sm font-bold uppercase tracking-wide text-green-200">Amount to pay</p>
                <p className="mt-2 text-5xl font-black text-white">{formatCurrency(amount || 0)}</p>
                <p className="mt-3 text-sm text-slate-300">
                  {bookingId ? `Booking ID: ${bookingId}` : 'Select a booking from My Rides to auto-fill amount.'}
                </p>
                {payment?.status && (
                  <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm font-bold text-blue-100">
                    <CheckCircle2 size={16} />
                    {payment.status}
                  </span>
                )}
              </div>

              {booking && (
                <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
                  <p className="font-bold text-white">{booking.pickup?.address}</p>
                  <p className="my-2 text-xs font-bold uppercase tracking-wide text-slate-500">to</p>
                  <p className="font-bold text-white">{booking.drop?.address}</p>
                  <p className="mt-3 text-sm text-slate-400">Ride status: {booking.status}</p>
                </div>
              )}

              <div className="mt-5 rounded-2xl border border-slate-700 bg-slate-950/50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">UPI ID</p>
                    <p className="mt-1 text-xl font-black text-green-300">{PAYMENT_DETAILS.upi}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(PAYMENT_DETAILS.upi)}
                    className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 py-3 font-bold text-black"
                  >
                    <Clipboard size={17} />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-[190px_1fr]">
                <div className="rounded-2xl bg-white p-4">
                  <QRCodeSVG value={upiUrl} size={158} bgColor="#ffffff" fgColor="#0f172a" includeMargin />
                </div>
                <div className="rounded-2xl border border-slate-700 bg-slate-950/50 p-5 text-sm">
                  <p className="font-bold text-white">Bank transfer</p>
                  <p className="mt-3 text-slate-300">Name: {PAYMENT_DETAILS.name}</p>
                  <p className="text-slate-300">Account: {PAYMENT_DETAILS.account}</p>
                  <p className="text-slate-300">IFSC: {PAYMENT_DETAILS.ifsc}</p>
                  <p className="text-slate-300">Bank: {PAYMENT_DETAILS.bank}</p>
                </div>
              </div>
            </>
          )}
        </section>

        <section className="space-y-6">
          <form onSubmit={handleUpload} className="rounded-3xl border border-slate-700 bg-[#101624] p-6 shadow-2xl shadow-black/20">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-300">
                <Upload />
              </div>
              <div>
                <h2 className="text-2xl font-black">Submit payment proof</h2>
                <p className="text-sm text-slate-400">Add UPI reference or screenshot after payment.</p>
              </div>
            </div>

            <label className="mb-4 block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Reference / UTR</span>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter payment reference"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-green-400"
              />
            </label>

            <label className="mb-5 block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Screenshot</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white"
              />
            </label>

            {message && (
              <div className="mb-5 rounded-2xl border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm font-bold text-green-200">
                {message}
              </div>
            )}

            <button
              disabled={uploading || !bookingId}
              className="w-full rounded-2xl bg-green-500 px-5 py-4 font-black text-black transition hover:bg-green-400 disabled:opacity-50"
            >
              {uploading ? 'Submitting...' : 'Submit Proof'}
            </button>
          </form>

          <div className="rounded-3xl border border-slate-700 bg-[#101624] p-6">
            <div className="mb-5 flex items-center gap-3">
              <ReceiptText className="text-green-300" />
              <h2 className="text-2xl font-black">Payment history</h2>
            </div>

            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-white">{formatCurrency(item.amount || 0)}</p>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-100">{item.status}</span>
                  </div>
                  <p className="mt-2 truncate text-sm text-slate-400">
                    {item.bookingId?.pickup?.address || 'Booking'} to {item.bookingId?.drop?.address || 'destination'}
                  </p>
                </div>
              ))}

              {history.length === 0 && (
                <div className="rounded-2xl bg-slate-950/60 p-5 text-sm text-slate-300">
                  No payment records yet.
                </div>
              )}
            </div>

            <Link to="/my-rides" className="mt-5 inline-block text-sm font-bold text-green-300 hover:text-green-200">
              Back to My Rides
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentGateway;
