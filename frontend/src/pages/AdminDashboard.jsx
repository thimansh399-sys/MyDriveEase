// PDF export dependencies
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import React, { useState, useEffect, useRef } from 'react';
// Notification bell icon (inline SVG)
const BellIcon = ({ hasNew }) => (
  <span className="relative">
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-[#19e68c]">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
    {hasNew && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>}
  </span>
);
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import api from '../utils/api';

const statLabels = [
  { key: 'bookings', label: 'Bookings' },
  { key: 'drivers', label: 'Drivers' },
  { key: 'registrations', label: 'Registrations' },
  { key: 'kyc', label: 'KYC Verify' },
  { key: 'customers', label: 'Customers' },
  { key: 'enquiries', label: 'Enquiries' },
  { key: 'liveDrivers', label: 'Live Drivers' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'settings', label: 'Settings' },
];

const chartLabels = [
  { key: 'ridesPerDay', label: 'Rides per Day' },
  { key: 'revenuePerDay', label: 'Revenue per Day' },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef();
  const [charts, setCharts] = useState({ ridesPerDay: [], revenuePerDay: [] });
  const [selectedChart, setSelectedChart] = useState('ridesPerDay');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Detail modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalPage, setModalPage] = useState(1);
  const [modalTotal, setModalTotal] = useState(0);
  const [modalSearch, setModalSearch] = useState('');
  // Audit log modal
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditData, setAuditData] = useState([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditPage, setAuditPage] = useState(1);
  const [auditSearch, setAuditSearch] = useState('');
  // Fetch audit logs
  const openAuditModal = async () => {
    setAuditOpen(true);
    setAuditLoading(true);
    setAuditPage(1);
    setAuditSearch('');
    try {
      const res = await api.get(`/admin/audit-logs?page=1&search=`);
      setAuditData(res.data.items || []);
    } catch {
      setAuditData([]);
    } finally {
      setAuditLoading(false);
    }
  };

  const fetchAuditPage = async (page, search) => {
    setAuditLoading(true);
    try {
      const res = await api.get(`/admin/audit-logs?page=${page}&search=${search || ''}`);
      setAuditData(res.data.items || []);
    } catch {
      setAuditData([]);
    } finally {
      setAuditLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/admin/dashboard');
        setStats(res.data.stats || {});
        setCharts(res.data.charts || { ridesPerDay: [], revenuePerDay: [] });
      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  // Real-time notifications
  useEffect(() => {
    let interval;
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/admin/notifications');
        setNotifications(res.data || []);
      } catch {
        setNotifications([]);
      }
    };
    fetchNotifications();
    interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch detail data for modal
  const openModal = async (type) => {
    setModalType(type);
    setModalOpen(true);
    setModalLoading(true);
    setModalPage(1);
    setModalSearch('');
    try {
      const res = await api.get(`/admin/${type}?page=1&search=`);
      setModalData(res.data.items || []);
      setModalTotal(res.data.total || 0);
    } catch {
      setModalData([]);
      setModalTotal(0);
    } finally {
      setModalLoading(false);
    }
  };

  // Pagination/search for modal
  const fetchModalPage = async (page, search) => {
    setModalLoading(true);
    try {
      const res = await api.get(`/admin/${modalType}?page=${page}&search=${search || ''}`);
      setModalData(res.data.items || []);
      setModalTotal(res.data.total || 0);
    } catch {
      setModalData([]);
      setModalTotal(0);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1019] py-8 px-2 sm:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white text-center flex-1">Admin Dashboard</h1>
        <div className="relative ml-4" ref={notifRef}>
          <button onClick={() => setNotifOpen((v) => !v)} className="focus:outline-none">
            <BellIcon hasNew={notifications.some(n => !n.read)} />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-[#19e68c] rounded-2xl shadow-xl z-50">
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#19e68c] mb-2">Notifications</h3>
                {notifications.length === 0 ? (
                  <div className="text-gray-400">No notifications</div>
                ) : (
                  <ul className="divide-y divide-[#222c37] max-h-64 overflow-y-auto">
                    {notifications.map((n, i) => (
                      <li key={i} className={`py-2 text-white ${!n.read ? 'font-bold' : ''}`}>
                        <span>{n.message}</span>
                        <span className="block text-xs text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {error && <div className="text-red-400 text-center mb-4">{error}</div>}
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 rounded-xl bg-[#19e68c] text-black font-bold mr-2"
          onClick={openAuditModal}
        >View Audit Logs</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
              {/* Audit Log Modal */}
              <Modal
                isOpen={auditOpen}
                onRequestClose={() => setAuditOpen(false)}
                contentLabel="Audit Logs"
                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
                overlayClassName=""
                ariaHideApp={false}
              >
                <div className="bg-[#111827] rounded-2xl shadow-xl border border-[#19e68c] p-6 w-full max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#19e68c]">Audit Logs</h2>
                    <button onClick={() => setAuditOpen(false)} className="text-white text-2xl">&times;</button>
                  </div>
                  <div className="flex gap-2 mb-4">
                    <input
                      className="flex-1 px-3 py-2 rounded-xl border border-[#19e68c] bg-[#222c37] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19e68c]"
                      placeholder="Search..."
                      value={auditSearch}
                      onChange={e => {
                        setAuditSearch(e.target.value);
                        fetchAuditPage(1, e.target.value);
                      }}
                    />
                  </div>
                  {auditLoading ? (
                    <div className="text-[#19e68c]">Loading...</div>
                  ) : (
                    <div className="overflow-x-auto max-h-96">
                      <table className="min-w-full text-sm text-left">
                        <thead>
                          <tr>
                            {auditData[0] && Object.keys(auditData[0]).map((k) => (
                              <th key={k} className="px-2 py-1 text-[#19e68c] font-semibold">{k}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {auditData.map((row, i) => (
                            <tr key={i} className="border-b border-[#222c37]">
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="px-2 py-1 text-white truncate max-w-[160px]">{String(v)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <button
                      className="px-3 py-1 rounded bg-[#19e68c] text-black font-bold disabled:opacity-50"
                      disabled={auditPage <= 1}
                      onClick={() => {
                        setAuditPage(p => p - 1);
                        fetchAuditPage(auditPage - 1, auditSearch);
                      }}
                    >Prev</button>
                    <span className="text-white">Page {auditPage}</span>
                    <button
                      className="px-3 py-1 rounded bg-[#19e68c] text-black font-bold disabled:opacity-50"
                      disabled={auditData.length === 0 || auditData.length < 10}
                      onClick={() => {
                        setAuditPage(p => p + 1);
                        fetchAuditPage(auditPage + 1, auditSearch);
                      }}
                    >Next</button>
                  </div>
                </div>
              </Modal>
        {statLabels.map((stat, i) => (
          <motion.div
            key={stat.key}
            className="bg-[#111827] rounded-2xl p-4 flex flex-col items-center shadow border border-[#19e68c] cursor-pointer hover:scale-105 transition-transform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            onClick={() => openModal(stat.key)}
          >
            <span className="text-[#19e68c] text-lg font-semibold mb-1">{stat.label}</span>
            <span className="text-2xl font-bold text-white">{stats[stat.key] ?? 0}</span>
          </motion.div>
        ))}
      </div>
      <div className="bg-[#111827] rounded-2xl p-6 shadow border border-[#19e68c] max-w-2xl mx-auto">
        <div className="flex gap-4 mb-4 justify-center">
          {chartLabels.map((chart) => (
            <button
              key={chart.key}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#19e68c] ${selectedChart === chart.key ? 'bg-[#19e68c] text-black' : 'bg-[#222c37] text-[#19e68c]'}`}
              onClick={() => setSelectedChart(chart.key)}
            >
              {chart.label}
            </button>
          ))}
        </div>
        <div className="w-full h-64 flex items-center justify-center">
          {/* Bar chart for selected data */}
          <div className="flex items-end h-full w-full gap-2">
            {(charts[selectedChart] || []).map((val, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div
                  className="bg-[#19e68c] rounded-t-lg"
                  style={{ height: `${val * 2}px`, minWidth: '18px', width: '100%' }}
                  title={val}
                ></div>
                <span className="text-xs text-white mt-1">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Detail View"
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
        overlayClassName=""
        ariaHideApp={false}
      >
        <div className="bg-[#111827] rounded-2xl shadow-xl border border-[#19e68c] p-6 w-full max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#19e68c]">{statLabels.find(s => s.key === modalType)?.label} Details</h2>
            <button onClick={() => setModalOpen(false)} className="text-white text-2xl">&times;</button>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              className="flex-1 px-3 py-2 rounded-xl border border-[#19e68c] bg-[#222c37] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#19e68c]"
              placeholder="Search..."
              value={modalSearch}
              onChange={e => {
                setModalSearch(e.target.value);
                fetchModalPage(1, e.target.value);
              }}
            />
            <button
              className="px-3 py-2 rounded-xl bg-[#19e68c] text-black font-bold"
              onClick={() => {
                if (!modalData.length) return;
                const keys = Object.keys(modalData[0]);
                const csv = [keys.join(",")].concat(modalData.map(row => keys.map(k => `"${String(row[k]).replace(/"/g, '""')}"`).join(","))).join("\n");
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${modalType}-export.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >Export CSV</button>
            <button
              className="px-3 py-2 rounded-xl bg-[#19e68c] text-black font-bold"
              onClick={async () => {
                const table = document.getElementById('modal-table');
                if (!table) return;
                const canvas = await html2canvas(table);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'landscape' });
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'PNG', 10, 10, pageWidth - 20, pageHeight - 20);
                pdf.save(`${modalType}-export.pdf`);
              }}
            >Export PDF</button>
          </div>
          {modalLoading ? (
            <div className="text-[#19e68c]">Loading...</div>
          ) : (
            <div className="overflow-x-auto max-h-96">
              <table id="modal-table" className="min-w-full text-sm text-left">
                <thead>
                  <tr>
                    {modalData[0] && Object.keys(modalData[0]).map((k) => (
                      <th key={k} className="px-2 py-1 text-[#19e68c] font-semibold">{k}</th>
                    ))}
                    {(modalType === 'registrations' || modalType === 'kyc') && <th className="px-2 py-1 text-[#19e68c] font-semibold">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {modalData.map((row, i) => (
                    <tr key={i} className="border-b border-[#222c37]">
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-2 py-1 text-white truncate max-w-[160px]">{String(v)}</td>
                      ))}
                      {(modalType === 'registrations' || modalType === 'kyc') && (
                        <td className="px-2 py-1">
                          {row.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                className="px-2 py-1 rounded bg-green-500 text-white font-bold"
                                onClick={async () => {
                                  await api.post(`/admin/${modalType}/approve`, { id: row._id });
                                  fetchModalPage(modalPage, modalSearch);
                                }}
                              >Approve</button>
                              <button
                                className="px-2 py-1 rounded bg-red-500 text-white font-bold"
                                onClick={async () => {
                                  await api.post(`/admin/${modalType}/reject`, { id: row._id });
                                  fetchModalPage(modalPage, modalSearch);
                                }}
                              >Reject</button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">{row.status}</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-3 py-1 rounded bg-[#19e68c] text-black font-bold disabled:opacity-50"
              disabled={modalPage <= 1}
              onClick={() => {
                setModalPage(p => p - 1);
                fetchModalPage(modalPage - 1, modalSearch);
              }}
            >Prev</button>
            <span className="text-white">Page {modalPage}</span>
            <button
              className="px-3 py-1 rounded bg-[#19e68c] text-black font-bold disabled:opacity-50"
              disabled={modalData.length === 0 || modalData.length < 10}
              onClick={() => {
                setModalPage(p => p + 1);
                fetchModalPage(modalPage + 1, modalSearch);
              }}
            >Next</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
