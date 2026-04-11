import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Testimonials from '../components/Testimonials';
import FAQSection from '../components/FAQSection';
import SupportChat from '../components/SupportChat';
import { motion } from 'framer-motion';

const SERVICE_TYPES = [
  { label: 'Driver Only', value: 'driver' },
  { label: 'Driver + Car', value: 'driver_car' },
];

const GuestHome = () => {
  const [serviceType, setServiceType] = useState('driver');
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [liveDrivers, setLiveDrivers] = useState([]);
  const [totalDrivers, setTotalDrivers] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch live drivers and total drivers with auto-refresh
  useEffect(() => {
    let interval;
    const fetchLiveDrivers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/liveDrivers');
        setLiveDrivers(res.data.slice(0, 5));
        setTotalDrivers(res.data.length);
      } catch {
        setLiveDrivers([]);
        setTotalDrivers(0);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveDrivers();
    interval = setInterval(fetchLiveDrivers, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a1019] flex flex-col" role="main">
      {/* Navbar */}
      {/* Remove duplicate static nav: use only the main Navbar component if present */}

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between px-2 sm:px-4 md:px-8 lg:px-16 py-6 md:py-12 gap-8 md:gap-12 bg-[#0a1019] flex-1" aria-label="Homepage content">
        {/* LEFT: Content & Booking Card */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 max-w-xl w-full">
          <motion.h1
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-2 text-center md:text-left"
            style={{ lineHeight: 1.15 }}
          >
            Book a Professional Driver Anytime, Anywhere
          </motion.h1>
          <motion.p
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-[#19e68c] mb-4 text-center md:text-left"
          >
            Choose <span className="font-bold text-white">Driver Only</span> or <span className="font-bold text-white">Driver with Car</span>. Verified, trained, and trusted across India.
          </motion.p>

          {/* Booking Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-[#111827]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col gap-3 md:gap-4 border border-[#222c37] max-w-md w-full"
            style={{ boxShadow: '0 8px 32px 0 rgba(16, 230, 140, 0.08)' }}
          >
            {/* Service Type Toggle */}
            <div className="flex gap-2 mb-2 flex-wrap">
              {SERVICE_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setServiceType(type.value)}
                  className={`px-4 py-2 rounded-full font-semibold border transition-all duration-200 ${serviceType === type.value ? 'bg-[#19e68c] text-black border-[#19e68c]' : 'bg-[#222c37] text-white border-[#333]'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-2 md:gap-3">
              <input type="text" placeholder="Pickup Location" value={pickup} onChange={e => setPickup(e.target.value)} className="px-4 py-3 rounded-xl border border-[#222c37] bg-[#222c37] text-white focus:outline-none focus:ring-2 focus:ring-[#19e68c] font-medium placeholder-gray-400" />
              <input type="text" placeholder="Drop Location" value={drop} onChange={e => setDrop(e.target.value)} className="px-4 py-3 rounded-xl border border-[#222c37] bg-[#222c37] text-white focus:outline-none focus:ring-2 focus:ring-[#19e68c] font-medium placeholder-gray-400" />
              <div className="flex gap-2">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-[#222c37] bg-[#222c37] text-white focus:outline-none font-medium" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-[#222c37] bg-[#222c37] text-white focus:outline-none font-medium" />
              </div>
            </div>
            <button
              className="mt-3 bg-[#19e68c] text-black py-3 rounded-xl font-bold text-base md:text-lg shadow hover:bg-[#16a34a] transition-all focus:outline-none focus:ring-2 focus:ring-[#19e68c] active:scale-95"
              aria-label="Book a Driver"
              onClick={() => navigate('/book')}
            >
              Book a Driver
            </button>
            <button className="mt-2 bg-[#222c37] border border-[#19e68c] text-[#19e68c] py-3 rounded-xl font-bold text-base md:text-lg shadow hover:bg-[#19e68c]/10 transition-all focus:outline-none focus:ring-2 focus:ring-[#19e68c] active:scale-95" aria-label="View Plans">View Plans</button>
          </motion.div>

          {/* Trust Strip with live stats */}
          <div className="flex flex-wrap gap-4 mt-8 items-center">
            <div className="flex items-center gap-2 bg-[#222c37] rounded-xl px-4 py-2 font-semibold text-[#19e68c] shadow-sm">
              <span className="text-yellow-400 text-xl">⭐</span> 4.8 Rating
            </div>
            <div className="flex items-center gap-2 bg-[#222c37] rounded-xl px-4 py-2 font-semibold text-[#19e68c] shadow-sm">
              <span className="text-green-400 text-xl">🚗</span> {totalDrivers}+ Drivers
            </div>
            <div className="flex items-center gap-2 bg-[#222c37] rounded-xl px-4 py-2 font-semibold text-[#19e68c] shadow-sm">
              <span className="text-blue-400 text-xl">👥</span> {totalDrivers * 2}+ Customers
            </div>
            <div className="flex items-center gap-2 bg-[#222c37] rounded-xl px-4 py-2 font-semibold text-[#19e68c] shadow-sm">
              <span className="text-green-400 text-xl">✅</span> Verified Drivers
            </div>
          </div>

          {/* Live Drivers Preview */}
          <div className="mt-6">
            <h3 className="text-lg font-bold text-white mb-2">Live Drivers Nearby</h3>
            {loading ? (
              <div className="text-[#19e68c]">Loading drivers...</div>
            ) : liveDrivers.length === 0 ? (
              <div className="text-gray-400">No live drivers right now.</div>
            ) : (
              <div className="flex gap-4 flex-wrap">
                {liveDrivers.map(driver => (
                  <div key={driver._id} className="bg-[#111827] rounded-xl p-4 flex flex-col items-center border border-[#19e68c] min-w-[120px]">
                    <img src={driver.photo || '/driver-avatar.png'} alt={driver.name} className="w-14 h-14 rounded-full mb-2 object-cover border-2 border-[#19e68c]" />
                    <div className="font-bold text-white">{driver.name}</div>
                    <div className="text-xs text-[#19e68c]">{driver.city}</div>
                    <div className="text-xs text-gray-400">{driver.type}</div>
                    <div className={`text-xs font-bold mt-1 ${driver.online ? 'text-green-400' : 'text-gray-400'}`}>{driver.online ? 'Online' : 'Offline'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Hero Image */}
        <div className="flex-1 flex items-center justify-center relative min-h-[220px] md:min-h-[420px] w-full">
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.04 }}
            className="w-full h-[220px] md:h-[420px] max-w-xl rounded-2xl glass-card bg-[#111827] border border-[#e5e5e5] shadow-2xl flex items-center justify-center overflow-hidden relative group"
            style={{ boxShadow: '0 8px 32px 0 rgba(16, 42, 67, 0.12)' }}
          >
            <img
              src="/driver-car-hero.jpg"
              alt="Driver standing near car"
              className="object-cover rounded-2xl w-full h-full max-h-[420px] shadow-xl border-2 border-[#1e2d3a] group-hover:scale-105 transition-transform duration-500"
              style={{ aspectRatio: '4/3', width: '100%', height: '100%' }}
              draggable="false"
            />
            {/* Gradient overlay */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'linear-gradient(120deg, #111827cc 10%, #0000 80%)', pointerEvents: 'none' }}
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 0.4 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </main>
        {/* Feature Cards Section */}
        <section className="w-full max-w-6xl mx-auto mt-10 md:mt-16 px-2 sm:px-4 md:px-0">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white mb-6 md:mb-8"
          >
            Why Choose <span className="text-[#19e68c]">DriveEase</span>?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card bg-[#111827] rounded-2xl shadow-xl p-4 md:p-6 flex flex-col items-center border border-[#19e68c] hover:scale-105 transition-transform"
            >
              <span className="text-4xl mb-3 text-[#19e68c]">🛡️</span>
              <h3 className="font-bold text-lg mb-2 text-white">Verified & Trusted Drivers</h3>
              <p className="text-[#19e68c] text-center">All drivers are background-checked, trained, and verified for your safety and peace of mind.</p>
            </motion.div>
            {/* Feature Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card bg-[#111827] rounded-2xl shadow-xl p-6 flex flex-col items-center border border-[#19e68c] hover:scale-105 transition-transform"
            >
              <span className="text-4xl mb-3 text-[#19e68c]">⚡</span>
              <h3 className="font-bold text-lg mb-2 text-white">Instant Booking</h3>
              <p className="text-[#19e68c] text-center">Book a driver in seconds with our seamless, easy-to-use platform—anytime, anywhere.</p>
            </motion.div>
            {/* Feature Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="glass-card bg-[#111827] rounded-2xl shadow-xl p-6 flex flex-col items-center border border-[#19e68c] hover:scale-105 transition-transform"
            >
              <span className="text-4xl mb-3 text-[#19e68c]">💎</span>
              <h3 className="font-bold text-lg mb-2 text-white">Premium Experience</h3>
              <p className="text-[#19e68c] text-center">Enjoy a glassmorphism-inspired, modern interface and premium service at every step of your journey.</p>
            </motion.div>
            {/* Feature Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
              className="glass-card bg-[#111827] rounded-2xl shadow-xl p-6 flex flex-col items-center border border-[#19e68c] hover:scale-105 transition-transform"
            >
              <span className="text-4xl mb-3 text-[#19e68c]">🌐</span>
              <h3 className="font-bold text-lg mb-2 text-white">Pan-India Coverage</h3>
              <p className="text-[#19e68c] text-center">Wherever you are in India, DriveEase connects you to the best drivers in your city and beyond.</p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <Testimonials />

        {/* FAQ Section */}
        <FAQSection />

        {/* Support Chat */}
        <SupportChat />
    </div>
  );
};

export default GuestHome;