import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  Building2,
  CalendarDays,
  CheckSquare,
  ChevronDown,
  CircleDollarSign,
  Download,
  Gauge,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  UserRound,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';
import api from '../utils/api';

const getMenuSections = (pendingPayments = 0) => [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: Gauge, key: 'dashboard' },
      { label: 'Leads', icon: Target, key: 'leads' },
      { label: 'Contacts', icon: Users, key: 'contacts' },
      { label: 'Companies', icon: Building2, key: 'companies' },
      { label: 'Deals', icon: CircleDollarSign, key: 'deals' },
      { label: 'Activities', icon: Activity, key: 'activities' },
      { label: 'Tasks', icon: CheckSquare, key: 'tasks' },
      { label: 'KYC', icon: ShieldCheck, key: 'kyc' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { label: 'Email', icon: Mail, badge: pendingPayments ? String(pendingPayments) : '', key: 'activities' },
      { label: 'SMS', icon: MessageCircle, key: 'activities' },
      { label: 'Calls', icon: Phone, key: 'activities' },
      { label: 'WhatsApp', icon: MessageCircle, key: 'activities' },
    ],
  },
  {
    title: 'Automation',
    items: [
      { label: 'Workflows', icon: Workflow, key: 'tasks' },
      { label: 'Pipelines', icon: SlidersHorizontal, key: 'leads' },
      { label: 'Triggers', icon: Zap, key: 'tasks' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { label: 'Analytics', icon: Activity, key: 'reports' },
      { label: 'Reports', icon: ShieldCheck, key: 'reports' },
    ],
  },
];

const chartColors = ['#00d46a', '#1487ff', '#f4b521', '#7b4dff', '#7a8497', '#ff654d'];

const formatNumber = (value = 0) => new Intl.NumberFormat('en-IN').format(Number(value || 0));

const formatMoney = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return 'NA';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatAgo = (value) => {
  if (!value) return 'NA';
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(0, Math.floor(diff / 60000));
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const initialsFor = (value = 'NA') =>
  String(value)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'NA';

const normalizeLabel = (value = '') =>
  String(value)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const sparkPointsFromValues = (values = []) => {
  const safeValues = values.length ? values : [0];
  const max = Math.max(...safeValues, 1);
  const width = 126;
  const step = safeValues.length > 1 ? width / (safeValues.length - 1) : width;
  return safeValues
    .map((value, index) => {
      const y = 30 - (Number(value || 0) / max) * 24;
      return `${Math.round(index * step)},${Math.max(4, Math.round(y))}`;
    })
    .join(' ');
};

const toneClasses = {
  emerald: 'bg-emerald-500/15 text-emerald-300 ring-emerald-400/25',
  violet: 'bg-violet-500/15 text-violet-300 ring-violet-400/25',
  sky: 'bg-sky-500/15 text-sky-300 ring-sky-400/25',
  amber: 'bg-amber-500/15 text-amber-300 ring-amber-400/25',
};

const badgeTone = {
  emerald: 'bg-emerald-500/15 text-emerald-300',
  sky: 'bg-sky-500/15 text-sky-300',
  amber: 'bg-amber-500/15 text-amber-300',
  violet: 'bg-violet-500/15 text-violet-300',
};

const Sparkline = ({ points, tone }) => (
  <svg viewBox="0 0 126 34" className="h-10 w-28" aria-hidden="true">
    <path d={`M${points}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={tone} />
    <path d={`M${points} V34 H0 Z`} fill="currentColor" className={`${tone} opacity-10`} />
  </svg>
);

const Panel = ({ className = '', children }) => (
  <section className={`rounded-lg border border-white/10 bg-[#0c1828]/86 shadow-[0_16px_40px_rgba(0,0,0,0.24)] ${className}`}>
    {children}
  </section>
);

const PanelHeader = ({ title, action = 'View All' }) => (
  <div className="flex items-center justify-between gap-3 px-5 py-4">
    <h2 className="text-sm font-extrabold text-white">{title}</h2>
    <button type="button" className="text-xs font-extrabold text-emerald-300 hover:text-emerald-200">
      {action}
    </button>
  </div>
);

const Sidebar = ({ activeView, onViewChange, pendingPayments = 0 }) => (
  <aside className="hidden w-[228px] shrink-0 border-r border-white/10 bg-[#07111f]/95 lg:block">
    <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-[#041009] shadow-[0_0_30px_rgba(0,212,106,0.35)]">
        <MessageCircle size={20} strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-black leading-none text-white">Drive<span className="text-emerald-300">Ease</span></p>
        <p className="text-xs font-extrabold text-emerald-300">CRM</p>
      </div>
    </div>

    <nav className="space-y-5 px-3 py-4">
      {getMenuSections(pendingPayments).map((section) => (
        <div key={section.title}>
          <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">{section.title}</p>
          <div className="space-y-1">
            {section.items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onViewChange(item.key || 'dashboard')}
                className={`flex h-9 w-full items-center justify-between rounded-md px-3 text-left text-xs font-bold transition ${
                  activeView === (item.key || 'dashboard')
                    ? 'border border-emerald-400/35 bg-emerald-500/16 text-white shadow-[inset_0_0_18px_rgba(0,212,106,0.12)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={16} />
                  {item.label}
                </span>
                {item.badge && <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] text-white">{item.badge}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>

    <div className="absolute bottom-4 left-3 w-[204px]">
      <button type="button" className="flex h-9 w-full items-center gap-3 rounded-md border border-emerald-400/25 px-3 text-xs font-bold text-emerald-300">
        <MessageCircle size={15} />
        Help & Support
      </button>
    </div>
  </aside>
);

const MetricCard = ({ metric }) => {
  const Icon = metric.icon;
  const toneText = {
    emerald: 'text-emerald-300',
    violet: 'text-violet-300',
    sky: 'text-sky-300',
    amber: 'text-amber-300',
  }[metric.tone];

  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <span className={`grid h-14 w-14 place-items-center rounded-lg ring-1 ${toneClasses[metric.tone]}`}>
            <Icon size={25} strokeWidth={2.4} />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-400">{metric.label}</p>
            <p className="mt-2 text-2xl font-black text-white">{metric.value}</p>
          </div>
        </div>
        <Sparkline points={metric.points} tone={toneText} />
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-400">
        <span className="font-extrabold text-emerald-300">{metric.context}</span>
      </p>
    </Panel>
  );
};

const SalesPipeline = ({ stages, conversionRate }) => {
  return (
    <Panel className="min-h-[330px]">
      <PanelHeader title="Sales Pipeline" action="This Month" />
      <div className="grid gap-5 px-5 pb-5 md:grid-cols-[1fr_145px] lg:grid-cols-1 xl:grid-cols-[1fr_145px]">
        <div className="space-y-2">
          {stages.map((stage) => (
            <div key={stage.label} className="grid grid-cols-[1fr_104px] items-center gap-4">
              <div
                className={`${stage.color} flex h-11 items-center justify-center rounded-[7px] text-sm font-black text-white shadow-lg`}
                style={{ width: `${stage.widthPercent}%`, clipPath: 'polygon(7% 0, 93% 0, 86% 100%, 14% 100%)' }}
              >
                {stage.value}
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-300">{stage.label}</p>
                <p className="mt-1 font-black text-emerald-300">{stage.percent}%</p>
              </div>
            </div>
          ))}
          {!stages.length && (
            <div className="rounded-lg border border-white/10 bg-[#071421] p-5 text-sm font-semibold text-slate-400">
              Backend se abhi koi pipeline data nahi aaya.
            </div>
          )}
        </div>

        <div className="rounded-lg border border-white/10 bg-[#071421] p-4">
          <p className="text-xs font-semibold text-slate-400">Conversion Rate</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-2xl font-black text-white">{conversionRate}%</p>
            <div className="grid h-12 w-12 place-items-center rounded-full" style={{ background: 'conic-gradient(#00d46a 0 76%, rgba(255,255,255,0.08) 76% 100%)' }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#071421] text-emerald-300">
                <Target size={16} />
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-400">Completed bookings / total bookings</p>
        </div>
      </div>
    </Panel>
  );
};

const LeadsChart = ({ series }) => {
  const values = series.map((item) => item.value);
  const labels = series.map((item) => item.label);
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = values.length > 1 ? (517 / (values.length - 1)) * index : 0;
      const y = 184 - (Number(value || 0) / max) * 150;
      return `${Math.round(x)},${Math.round(y)}`;
    })
    .join(' ');
  return (
    <Panel>
      <PanelHeader title="Bookings Overview" action="Last 7 Days" />
      <div className="px-5 pb-5">
        <svg viewBox="0 0 560 220" className="h-[214px] w-full">
          <defs>
            <linearGradient id="leadFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00d46a" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#00d46a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((row) => (
            <line key={`h-${row}`} x1="38" x2="535" y1={28 + row * 38} y2={28 + row * 38} stroke="rgba(255,255,255,0.06)" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((col) => (
            <line key={`v-${col}`} x1={38 + col * 80} x2={38 + col * 80} y1="24" y2="184" stroke="rgba(255,255,255,0.04)" />
          ))}
          <path d={`M${points} L517,184 L0,184 Z`} transform="translate(38 0)" fill="url(#leadFill)" />
          <path d={`M${points}`} transform="translate(38 0)" fill="none" stroke="#00d46a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="320" cy="57" r="5" fill="#dfffee" />
          <text x="0" y="34" fill="#8da0b9" fontSize="11">{max}</text>
          <text x="0" y="72" fill="#8da0b9" fontSize="11">{Math.round(max * 0.75)}</text>
          <text x="0" y="110" fill="#8da0b9" fontSize="11">{Math.round(max * 0.5)}</text>
          <text x="0" y="148" fill="#8da0b9" fontSize="11">{Math.round(max * 0.25)}</text>
          <text x="0" y="187" fill="#8da0b9" fontSize="11">0</text>
          {labels.map((label, index) => (
            <text key={label} x={28 + index * 80} y="211" fill="#8da0b9" fontSize="11">{label}</text>
          ))}
        </svg>
      </div>
    </Panel>
  );
};

const Donut = ({ center, size = 'h-36 w-36', gradient }) => (
  <div className={`grid ${size} place-items-center rounded-full`} style={{ background: gradient }}>
    <div className="grid h-[58%] w-[58%] place-items-center rounded-full bg-[#091522] text-center">
      {center}
    </div>
  </div>
);

const DataTable = ({ columns, emptyText, rows }) => (
  <Panel>
    <div className="overflow-x-auto px-5 pb-5">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="border-b border-white/10 px-3 py-3 font-black">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, rowIndex) => (
            <tr key={row.id || row._id || rowIndex} className="align-top hover:bg-white/[0.03]">
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-3 font-semibold text-slate-300">
                  {column.render ? column.render(row) : row[column.key] || 'NA'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && (
        <div className="rounded-lg border border-dashed border-white/10 bg-[#071421] p-8 text-center text-sm font-bold text-slate-500">
          {emptyText}
        </div>
      )}
    </div>
  </Panel>
);

const StatusBadge = ({ children, tone = 'sky' }) => (
  <span className={`inline-flex rounded-md px-2 py-1 text-[11px] font-black ${badgeTone[tone] || badgeTone.sky}`}>
    {children}
  </span>
);

export default function AdminDashboard() {
  const [crm, setCrm] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [actionLoading, setActionLoading] = useState('');

  const fetchCrm = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/admin/crm', {
        params: { search, limit: 120 },
      });
      setCrm(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'CRM data load nahi ho paya.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchCrm, 250);

    return () => clearTimeout(timeout);
  }, [search]);

  const summary = crm?.summary || {};
  const bookings = crm?.bookings || [];
  const statusBreakdown = crm?.statusBreakdown || [];
  const directories = crm?.directories || {};
  const generatedAt = crm?.generatedAt;
  const kycSummary = crm?.kyc?.summary || {};
  const kycItems = crm?.kyc?.items || [];

  const dailySeries = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        label: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        value: 0,
      };
    });

    bookings.forEach((booking) => {
      const key = new Date(booking.createdAt).toISOString().slice(0, 10);
      const item = days.find((day) => day.key === key);
      if (item) item.value += 1;
    });

    return days;
  }, [bookings]);

  const metricSpark = sparkPointsFromValues(dailySeries.map((item) => item.value));

  const metrics = useMemo(
    () => [
      {
        label: 'Total Bookings',
        value: formatNumber(summary.totalBookings),
        context: `${formatNumber(summary.activeBookings)} active bookings`,
        icon: Users,
        tone: 'emerald',
        points: metricSpark,
      },
      {
        label: 'Total Customers',
        value: formatNumber(summary.customers),
        context: `${formatNumber((directories.customers || []).length)} in directory`,
        icon: UserRound,
        tone: 'violet',
        points: metricSpark,
      },
      {
        label: 'Total Partners',
        value: formatNumber((summary.drivers || 0) + (summary.fleets || 0)),
        context: `${formatNumber(summary.vehicles)} vehicles registered`,
        icon: Building2,
        tone: 'sky',
        points: metricSpark,
      },
      {
        label: 'Total Revenue',
        value: formatMoney(summary.totalRevenue),
        context: `${formatNumber(summary.pendingPayments)} payment proofs pending`,
        icon: CircleDollarSign,
        tone: 'amber',
        points: metricSpark,
      },
    ],
    [directories.customers, metricSpark, summary]
  );

  const pipelineStages = useMemo(() => {
    const total = statusBreakdown.reduce((sum, item) => sum + Number(item.count || 0), 0);
    const colors = ['bg-emerald-500', 'bg-emerald-600', 'bg-amber-500', 'bg-sky-600', 'bg-violet-600', 'bg-rose-500'];

    return statusBreakdown
      .filter((item) => Number(item.count || 0) > 0)
      .slice(0, 6)
      .map((item, index) => {
        const percent = total ? Math.round((Number(item.count || 0) / total) * 100) : 0;
        return {
          label: normalizeLabel(item.label || item.key),
          value: formatNumber(item.count),
          percent,
          color: colors[index % colors.length],
          widthPercent: Math.max(36, percent),
        };
      });
  }, [statusBreakdown]);

  const conversionRate = summary.totalBookings
    ? Math.round((Number(summary.completedBookings || 0) / Number(summary.totalBookings || 1)) * 100)
    : 0;

  const activities = useMemo(
    () =>
      bookings.slice(0, 5).map((booking) => ({
        icon: booking.dispatchTarget === 'fleet' ? Building2 : Phone,
        title: `${normalizeLabel(booking.status)} booking`,
        note: `${booking.customer?.name || 'Customer'} | ${booking.pickup?.address || 'Pickup'} to ${booking.drop?.address || 'Drop'}`,
        time: formatAgo(booking.updatedAt || booking.createdAt),
        status: normalizeLabel(booking.status),
        tone: booking.status === 'completed' ? 'emerald' : booking.status === 'cancelled' ? 'amber' : 'sky',
      })),
    [bookings]
  );

  const deals = useMemo(
    () =>
      [...bookings]
        .sort((a, b) => Number(b.fare?.total || 0) - Number(a.fare?.total || 0))
        .slice(0, 5)
        .map((booking) => {
          const customerName = booking.customer?.name || booking.fleet?.companyName || 'Booking';
          return {
            initials: initialsFor(customerName),
            title: `${normalizeLabel(booking.carType || booking.tripType || 'Ride')} Booking`,
            company: customerName,
            value: formatMoney(booking.fare?.total),
            stage: normalizeLabel(booking.status),
            tone: booking.status === 'completed' ? 'emerald' : booking.status === 'cancelled' ? 'amber' : 'sky',
          };
        }),
    [bookings]
  );

  const sourceItems = useMemo(() => {
    const totals = bookings.reduce((acc, booking) => {
      const key = normalizeLabel(booking.dispatchTarget || 'Direct');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const total = bookings.length || 1;

    return Object.entries(totals).map(([label, count], index) => ({
      label,
      value: `${Math.round((count / total) * 100)}%`,
      count,
      color: chartColors[index % chartColors.length],
    }));
  }, [bookings]);

  const taskItems = useMemo(
    () =>
      statusBreakdown
        .filter((item) => Number(item.count || 0) > 0)
        .slice(0, 4)
        .map((item, index) => ({
          label: normalizeLabel(item.label || item.key),
          value: item.count,
          color: chartColors[index % chartColors.length],
        })),
    [statusBreakdown]
  );

  const sourceGradient = sourceItems.length
    ? `conic-gradient(${sourceItems
        .reduce(
          (parts, item) => {
            const start = parts.cursor;
            const percent = bookings.length ? (Number(item.count || 0) / bookings.length) * 100 : 0;
            const end = start + percent;
            parts.items.push(`${item.color} ${start}% ${end}%`);
            parts.cursor = end;
            return parts;
          },
          { cursor: 0, items: [] }
        )
        .items.join(', ')})`
    : 'conic-gradient(rgba(255,255,255,0.08) 0 100%)';

  const taskTotal = taskItems.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const taskGradient = taskItems.length
    ? `conic-gradient(${taskItems
        .reduce(
          (parts, item) => {
            const start = parts.cursor;
            const end = start + (taskTotal ? (Number(item.value || 0) / taskTotal) * 100 : 0);
            parts.items.push(`${item.color} ${start}% ${end}%`);
            parts.cursor = end;
            return parts;
          },
          { cursor: 0, items: [] }
        )
        .items.join(', ')})`
    : 'conic-gradient(rgba(255,255,255,0.08) 0 100%)';

  const handleKycAction = async (item, action) => {
    const entityMap = {
      customer: 'customer',
      driver: 'driver',
      'travel partner': 'travel-partner',
    };
    const entity = entityMap[item.type];
    if (!entity) return;

    setActionLoading(`${item.type}-${item.id}-${action}`);
    setError('');
    try {
      await api.post(`/admin/kyc/${entity}/${item.id}/${action}`);
      await fetchCrm();
      setActiveView('kyc');
    } catch (err) {
      setError(err.response?.data?.message || 'KYC action failed.');
    } finally {
      setActionLoading('');
    }
  };

  const bookingColumns = [
    { key: 'id', label: 'Booking', render: (row) => `#${String(row._id).slice(-6).toUpperCase()}` },
    { key: 'customer', label: 'Customer', render: (row) => row.customer?.name || 'NA' },
    { key: 'route', label: 'Route', render: (row) => `${row.pickup?.address || 'Pickup'} -> ${row.drop?.address || 'Drop'}` },
    { key: 'supply', label: 'Supply', render: (row) => normalizeLabel(row.dispatchTarget || 'NA') },
    { key: 'fare', label: 'Fare', render: (row) => formatMoney(row.fare?.total) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={row.status === 'completed' ? 'emerald' : 'sky'}>{normalizeLabel(row.status)}</StatusBadge> },
  ];

  const customerColumns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'kycStatus', label: 'KYC', render: (row) => <StatusBadge tone={row.kycStatus === 'verified' ? 'emerald' : 'amber'}>{normalizeLabel(row.kycStatus)}</StatusBadge> },
    { key: 'aadhaarNumber', label: 'Aadhaar' },
    { key: 'createdAt', label: 'Joined', render: (row) => formatDate(row.createdAt) },
  ];

  const companyColumns = [
    { key: 'name', label: 'Company' },
    { key: 'ownerName', label: 'Owner' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'kycStatus', label: 'KYC', render: (row) => <StatusBadge tone={row.kycStatus === 'verified' ? 'emerald' : 'amber'}>{normalizeLabel(row.kycStatus)}</StatusBadge> },
    { key: 'cars', label: 'Cars', render: (row) => `${row.availableCars || 0}/${row.totalCars || 0}` },
  ];

  const driverColumns = [
    { key: 'name', label: 'Driver' },
    { key: 'phone', label: 'Phone' },
    { key: 'city', label: 'City' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={row.status === 'online' ? 'emerald' : 'sky'}>{normalizeLabel(row.status)}</StatusBadge> },
    { key: 'licenseNumber', label: 'License' },
    { key: 'totalRides', label: 'Rides' },
  ];

  const kycColumns = [
    { key: 'type', label: 'Type', render: (row) => normalizeLabel(row.type) },
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={row.status === 'verified' ? 'emerald' : row.status === 'rejected' ? 'amber' : 'sky'}>{normalizeLabel(row.status)}</StatusBadge> },
    { key: 'score', label: 'Score', render: (row) => `${row.score}%` },
    { key: 'missing', label: 'Missing', render: (row) => row.missing?.length ? row.missing.join(', ') : 'Complete' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleKycAction(row, 'approve')}
            disabled={row.status === 'verified' || Boolean(actionLoading)}
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-black text-[#041009] disabled:cursor-not-allowed disabled:opacity-45"
          >
            {actionLoading === `${row.type}-${row.id}-approve` ? 'Approving' : 'Approve'}
          </button>
          <button
            type="button"
            onClick={() => handleKycAction(row, 'reject')}
            disabled={row.status === 'rejected' || Boolean(actionLoading)}
            className="rounded-md bg-rose-500 px-3 py-1.5 text-xs font-black text-white disabled:cursor-not-allowed disabled:opacity-45"
          >
            {actionLoading === `${row.type}-${row.id}-reject` ? 'Rejecting' : 'Reject'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050c16] text-slate-100">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_-10%,rgba(0,212,106,0.18),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(20,135,255,0.16),transparent_24%),linear-gradient(180deg,#08111f_0%,#050c16_100%)]" />
      <div className="relative flex min-h-screen">
        <Sidebar activeView={activeView} onViewChange={setActiveView} pendingPayments={summary.pendingPayments} />

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/10 bg-[#07111f]/90 px-4 backdrop-blur md:px-6">
            <button type="button" className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 lg:hidden">
              <Menu size={20} />
            </button>
            <button type="button" className="hidden h-10 w-10 place-items-center rounded-lg text-slate-400 hover:bg-white/5 md:grid">
              <Menu size={20} />
            </button>

            <label className="relative min-w-0 flex-1 md:max-w-[480px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-10 w-full rounded-lg border border-white/10 bg-[#071421] pl-10 pr-14 text-sm font-semibold text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
                placeholder="Search customers, bookings, routes..."
              />
              <span className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-white/10 px-2 py-1 text-[10px] font-bold text-slate-500 sm:block">Ctrl K</span>
            </label>

            <button type="button" className="hidden h-10 items-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-extrabold text-[#041009] shadow-[0_12px_34px_rgba(0,212,106,0.25)] hover:bg-emerald-400 sm:inline-flex">
              <Plus size={17} />
              Add New
            </button>

            <button type="button" className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#07111f]" />
            </button>
            <button type="button" className="hidden h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 md:grid">
              <Mail size={18} />
            </button>
            <button type="button" className="hidden h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300 md:grid">
              <Settings size={18} />
            </button>

            <button type="button" className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-white/5">
              <img src="/VINI.jpg" alt="Himanshu Singh" className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-400/30" />
              <span className="hidden text-left xl:block">
                <span className="block text-xs font-extrabold text-white">Himanshu Singh</span>
                <span className="block text-[11px] font-semibold text-slate-400">Admin</span>
              </span>
              <ChevronDown className="hidden text-slate-500 xl:block" size={15} />
            </button>
          </header>

          <div className="px-4 py-6 md:px-6">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-2xl font-black text-white md:text-3xl">
                  {activeView === 'dashboard' ? 'Welcome back, Himanshu!' : normalizeLabel(activeView)}
                </h1>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  {activeView === 'kyc'
                    ? 'New registrations aur verification queue backend se live aa rahi hai.'
                    : "Here's what's happening with your business today."}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className="inline-flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-[#0c1828] px-4 text-sm font-extrabold text-slate-200">
                  Last sync: {generatedAt ? formatDate(generatedAt) : 'Loading'}
                  <CalendarDays size={16} />
                </button>
                <button type="button" className="inline-flex h-11 items-center gap-2 rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-4 text-sm font-extrabold text-emerald-300">
                  <Download size={16} />
                  Export Report
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200">
                {error}
              </div>
            )}

            {loading && !crm && (
              <div className="mb-4 rounded-lg border border-white/10 bg-[#0c1828] px-4 py-3 text-sm font-bold text-slate-300">
                Backend se CRM data load ho raha hai...
              </div>
            )}

            <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
              {['dashboard', 'leads', 'contacts', 'companies', 'kyc', 'deals', 'activities', 'tasks', 'reports'].map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
                  className={`h-10 shrink-0 rounded-lg px-4 text-xs font-black ${
                    activeView === view ? 'bg-emerald-500 text-[#041009]' : 'border border-white/10 bg-[#0c1828] text-slate-300'
                  }`}
                >
                  {normalizeLabel(view)}
                </button>
              ))}
            </div>

            {activeView === 'dashboard' && (
              <>
            <section className="mb-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </section>

            <section className="mb-4 grid gap-4 xl:grid-cols-[1.05fr_1.1fr_1.15fr]">
              <SalesPipeline stages={pipelineStages} conversionRate={conversionRate} />

              <Panel className="min-h-[330px]">
                <PanelHeader title="Recent Activities" />
                <div className="space-y-3 px-5 pb-5">
                  {activities.map((item, index) => (
                    <div key={`${item.title}-${item.time}-${index}`} className="grid grid-cols-[44px_1fr_auto] items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-full ${badgeTone[item.tone]}`}>
                        <item.icon size={17} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-white">{item.title}</p>
                        <p className="truncate text-xs font-semibold text-slate-400">{item.note}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-slate-400">{item.time}</p>
                        <span className={`mt-1 inline-flex rounded-md px-2 py-1 text-[10px] font-extrabold ${badgeTone[item.tone]}`}>{item.status}</span>
                      </div>
                    </div>
                  ))}
                  {!activities.length && (
                    <div className="rounded-lg border border-white/10 bg-[#071421] p-5 text-sm font-semibold text-slate-400">
                      Backend se abhi recent activity data nahi aaya.
                    </div>
                  )}
                </div>
              </Panel>

              <Panel className="min-h-[330px]">
                <PanelHeader title="Top Deals" />
                <div className="space-y-2 px-5 pb-5">
                  {deals.map((deal, index) => (
                    <div key={`${deal.title}-${deal.company}-${index}`} className="grid grid-cols-[42px_1fr_auto] items-center gap-3 rounded-lg p-2 transition hover:bg-white/[0.03]">
                      <span className={`grid h-10 w-10 place-items-center rounded-md text-sm font-black ring-1 ${toneClasses[deal.tone]}`}>{deal.initials}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-extrabold text-white">{deal.title}</p>
                        <p className="truncate text-xs font-semibold text-slate-400">{deal.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-white">{deal.value}</p>
                        <span className={`mt-1 inline-flex rounded-md px-2 py-1 text-[10px] font-extrabold ${badgeTone[deal.tone]}`}>{deal.stage}</span>
                      </div>
                    </div>
                  ))}
                  {!deals.length && (
                    <div className="rounded-lg border border-white/10 bg-[#071421] p-5 text-sm font-semibold text-slate-400">
                      Backend se abhi deal/booking value data nahi aaya.
                    </div>
                  )}
                </div>
              </Panel>
            </section>

            <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr_1fr]">
              <LeadsChart series={dailySeries} />

              <Panel>
                <PanelHeader title="Bookings by Supply" action="" />
                <div className="grid gap-5 px-5 pb-5 sm:grid-cols-[150px_1fr] xl:grid-cols-1 2xl:grid-cols-[150px_1fr]">
                  <Donut
                    gradient={sourceGradient}
                    center={<span className="text-xs font-black text-slate-400">Bookings</span>}
                  />
                  <div className="space-y-3 self-center">
                    {sourceItems.map((item) => (
                      <div key={item.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs font-bold">
                        <span className="flex items-center gap-2 text-slate-300"><i className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.label}</span>
                        <span className="text-slate-200">{item.value}</span>
                        <span className="text-slate-500">({item.count})</span>
                      </div>
                    ))}
                    {!sourceItems.length && (
                      <p className="text-xs font-bold text-slate-500">No backend supply data.</p>
                    )}
                  </div>
                </div>
              </Panel>

              <Panel>
                <PanelHeader title="Status Overview" />
                <div className="grid gap-5 px-5 pb-5 sm:grid-cols-[160px_1fr] xl:grid-cols-1 2xl:grid-cols-[160px_1fr]">
                  <Donut
                    size="h-40 w-40"
                    gradient={taskGradient}
                    center={<><span className="text-xs font-semibold text-slate-400">Total</span><span className="block text-2xl font-black text-white">{formatNumber(taskTotal)}</span></>}
                  />
                  <div className="space-y-4 self-center">
                    {taskItems.map((item) => (
                      <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4 text-sm">
                        <span className="flex items-center gap-2 font-semibold text-slate-300"><i className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.label}</span>
                        <span className="font-black text-white">{item.value}</span>
                      </div>
                    ))}
                    {!taskItems.length && (
                      <p className="text-sm font-bold text-slate-500">No backend status data.</p>
                    )}
                  </div>
                </div>
              </Panel>
            </section>
              </>
            )}

            {activeView === 'leads' && (
              <div className="space-y-4">
                <SalesPipeline stages={pipelineStages} conversionRate={conversionRate} />
                <DataTable columns={bookingColumns} rows={bookings} emptyText="Backend se abhi bookings/leads data nahi aaya." />
              </div>
            )}

            {activeView === 'contacts' && (
              <DataTable columns={customerColumns} rows={directories.customers || []} emptyText="Backend se abhi contacts data nahi aaya." />
            )}

            {activeView === 'companies' && (
              <div className="space-y-4">
                <DataTable columns={companyColumns} rows={directories.travelPartners || []} emptyText="Backend se abhi travel partners data nahi aaya." />
                <DataTable columns={driverColumns} rows={directories.drivers || []} emptyText="Backend se abhi driver data nahi aaya." />
              </div>
            )}

            {activeView === 'kyc' && (
              <div className="space-y-4">
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    ['Verified', kycSummary.verified, 'emerald'],
                    ['Submitted', kycSummary.submitted, 'sky'],
                    ['Pending', kycSummary.pending, 'amber'],
                    ['Rejected', kycSummary.rejected, 'amber'],
                  ].map(([label, value, tone]) => (
                    <Panel key={label} className="p-4">
                      <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
                      <p className={`mt-2 text-3xl font-black ${tone === 'emerald' ? 'text-emerald-300' : tone === 'sky' ? 'text-sky-300' : 'text-amber-300'}`}>
                        {formatNumber(value)}
                      </p>
                    </Panel>
                  ))}
                </section>
                <Panel>
                  <PanelHeader title="New Registration KYC Queue" action={`${formatNumber(kycSummary.total)} records`} />
                  <DataTable columns={kycColumns} rows={kycItems} emptyText="New registration KYC queue empty hai." />
                </Panel>
              </div>
            )}

            {activeView === 'deals' && (
              <DataTable
                columns={[
                  { key: 'title', label: 'Deal', render: (row) => row.title },
                  { key: 'company', label: 'Customer', render: (row) => row.company },
                  { key: 'value', label: 'Value', render: (row) => row.value },
                  { key: 'stage', label: 'Stage', render: (row) => <StatusBadge tone={row.tone}>{row.stage}</StatusBadge> },
                ]}
                rows={deals}
                emptyText="Backend se abhi deal data nahi aaya."
              />
            )}

            {activeView === 'activities' && (
              <DataTable
                columns={[
                  { key: 'title', label: 'Activity' },
                  { key: 'note', label: 'Details' },
                  { key: 'time', label: 'Time' },
                  { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={row.tone}>{row.status}</StatusBadge> },
                ]}
                rows={activities}
                emptyText="Backend se abhi activity data nahi aaya."
              />
            )}

            {activeView === 'tasks' && (
              <DataTable
                columns={[
                  { key: 'label', label: 'Task / Status' },
                  { key: 'value', label: 'Count' },
                ]}
                rows={taskItems}
                emptyText="Backend se abhi task/status data nahi aaya."
              />
            )}

            {activeView === 'reports' && (
              <section className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr_1fr]">
                <LeadsChart series={dailySeries} />
                <Panel>
                  <PanelHeader title="Bookings by Supply" action="" />
                  <div className="grid gap-5 px-5 pb-5 sm:grid-cols-[150px_1fr]">
                    <Donut gradient={sourceGradient} center={<span className="text-xs font-black text-slate-400">Bookings</span>} />
                    <div className="space-y-3 self-center">
                      {sourceItems.map((item) => (
                        <div key={item.label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs font-bold">
                          <span className="flex items-center gap-2 text-slate-300"><i className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.label}</span>
                          <span className="text-slate-200">{item.value}</span>
                          <span className="text-slate-500">({item.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
                <Panel>
                  <PanelHeader title="Status Overview" />
                  <div className="grid gap-5 px-5 pb-5 sm:grid-cols-[160px_1fr]">
                    <Donut size="h-40 w-40" gradient={taskGradient} center={<><span className="text-xs font-semibold text-slate-400">Total</span><span className="block text-2xl font-black text-white">{formatNumber(taskTotal)}</span></>} />
                    <div className="space-y-4 self-center">
                      {taskItems.map((item) => (
                        <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-4 text-sm">
                          <span className="flex items-center gap-2 font-semibold text-slate-300"><i className="h-2 w-2 rounded-full" style={{ background: item.color }} />{item.label}</span>
                          <span className="font-black text-white">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
