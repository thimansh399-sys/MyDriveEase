import { useEffect, useState } from 'react';
import {
  Car,
  CheckCircle2,
  CircleOff,
  Clock3,
  IndianRupee,
  Pencil,
  Plus,
  Trash2,
  Users,
} from 'lucide-react';
import api from '../../utils/api';

const emptyForm = {
  carType: 'sedan',
  brand: '',
  model: '',
  plateNumber: '',
  seats: 4,
  serviceCity: '',
  perKmRate: 12,
  hourlyRate: 120,
  fullDayRate: 2500,
  driverName: '',
  driverPhone: '',
  status: 'available',
};

const carTypes = [
  'hatchback',
  'sedan',
  'suv',
  'innova',
  'tempo',
  'driver-only',
];

const statusStyles = {
  available: 'border-green-400/30 bg-green-500/15 text-green-200',
  busy: 'border-amber-400/30 bg-amber-500/15 text-amber-100',
  offline: 'border-slate-400/25 bg-slate-500/15 text-slate-200',
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-400">
      {label}
    </span>
    {children}
  </label>
);

const StatTile = ({ icon: Icon, label, value, tone = 'text-white' }) => (
  <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-400">{label}</p>
      <Icon size={18} className={tone} />
    </div>
    <p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p>
  </div>
);

export default function FleetVehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/fleet/vehicles');
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load cabs');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: ['seats', 'perKmRate', 'hourlyRate', 'fullDayRate'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await api.put(`/fleet/vehicles/${editingId}`, form);
      } else {
        await api.post('/fleet/vehicles', form);
      }

      resetForm();
      fetchVehicles();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save cab');
    } finally {
      setLoading(false);
    }
  };

  const editVehicle = (vehicle) => {
    setEditingId(vehicle._id);
    setForm({
      carType: vehicle.carType || 'sedan',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      plateNumber: vehicle.plateNumber || '',
      seats: vehicle.seats || 4,
      serviceCity: vehicle.serviceCity || '',
      perKmRate: vehicle.perKmRate || 12,
      hourlyRate: vehicle.hourlyRate || 120,
      fullDayRate: vehicle.fullDayRate || 2500,
      driverName: vehicle.driverName || '',
      driverPhone: vehicle.driverPhone || '',
      status: vehicle.status || 'available',
    });
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/fleet/vehicles/${id}/status`, { status });
      fetchVehicles();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm('Delete this cab?')) return;

    try {
      await api.delete(`/fleet/vehicles/${id}`);
      fetchVehicles();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete cab');
    }
  };

  const availableCount = vehicles.filter((vehicle) => vehicle.status === 'available').length;
  const busyCount = vehicles.filter((vehicle) => vehicle.status === 'busy').length;
  const offlineCount = vehicles.filter((vehicle) => vehicle.status === 'offline').length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-green-400">
            Fleet inventory
          </p>
          <h1 className="text-4xl font-bold">My Cabs</h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Add vehicles, rates, driver details, and live availability for matching booking requests.
          </p>
        </div>
        <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-[620px] xl:grid-cols-4">
          <StatTile icon={Car} label="Total cabs" value={vehicles.length} />
          <StatTile icon={CheckCircle2} label="Available" value={availableCount} tone="text-green-400" />
          <StatTile icon={Clock3} label="Busy" value={busyCount} tone="text-amber-300" />
          <StatTile icon={CircleOff} label="Offline" value={offlineCount} tone="text-slate-300" />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/15 px-5 py-4 font-bold text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6 shadow-2xl shadow-black/20">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {editingId ? 'Edit cab details' : 'Add a cab'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Complete the essentials first; driver details can be updated anytime.
            </p>
          </div>
          <span className={`w-fit rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles[form.status]}`}>
            {form.status}
          </span>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 text-sm font-bold text-slate-200">Vehicle details</p>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Cab type">
                <select name="carType" value={form.carType} onChange={handleChange} className="fleet-input">
                  {carTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </Field>
              <Field label="Plate number">
                <input name="plateNumber" value={form.plateNumber} onChange={handleChange} placeholder="DL 01 AB 1234" className="fleet-input" required />
              </Field>
              <Field label="Brand">
                <input name="brand" value={form.brand} onChange={handleChange} placeholder="Toyota" className="fleet-input" />
              </Field>
              <Field label="Model">
                <input name="model" value={form.model} onChange={handleChange} placeholder="Innova Crysta" className="fleet-input" />
              </Field>
              <Field label="Seats">
                <input name="seats" type="number" min="1" value={form.seats} onChange={handleChange} placeholder="4" className="fleet-input" />
              </Field>
              <Field label="Service city">
                <input name="serviceCity" value={form.serviceCity} onChange={handleChange} placeholder="Delhi" className="fleet-input" />
              </Field>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-bold text-slate-200">Rates and driver</p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <Field label="Per km rate">
                <input name="perKmRate" type="number" min="0" value={form.perKmRate} onChange={handleChange} placeholder="12" className="fleet-input" />
              </Field>
              <Field label="Hourly rate">
                <input name="hourlyRate" type="number" min="0" value={form.hourlyRate} onChange={handleChange} placeholder="120" className="fleet-input" />
              </Field>
              <Field label="Full day rate">
                <input name="fullDayRate" type="number" min="0" value={form.fullDayRate} onChange={handleChange} placeholder="2500" className="fleet-input" />
              </Field>
              <Field label="Status">
                <select name="status" value={form.status} onChange={handleChange} className="fleet-input">
                  <option value="available">available</option>
                  <option value="busy">busy</option>
                  <option value="offline">offline</option>
                </select>
              </Field>
              <Field label="Driver name">
                <input name="driverName" value={form.driverName} onChange={handleChange} placeholder="Driver name" className="fleet-input" />
              </Field>
              <Field label="Driver phone">
                <input name="driverPhone" value={form.driverPhone} onChange={handleChange} placeholder="9876543210" className="fleet-input" />
              </Field>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-black transition hover:bg-green-400 disabled:opacity-60">
            <Plus size={18} />
            {loading ? 'Saving...' : editingId ? 'Update cab' : 'Add cab'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-bold transition hover:bg-slate-700">
              Cancel
            </button>
          )}
        </div>
      </form>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Cab inventory</h2>
          <p className="mt-1 text-sm text-slate-400">
            Update status quickly when a vehicle becomes available or goes offline.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="rounded-3xl border border-slate-700/70 bg-[#111827] p-6 shadow-xl shadow-black/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-300">
                      {vehicle.carType}
                    </span>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusStyles[vehicle.status] || statusStyles.offline}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold">
                    {[vehicle.brand, vehicle.model].filter(Boolean).join(' ') || 'Cab'}
                  </h3>
                  <p className="mt-2 text-slate-400">{vehicle.plateNumber} | {vehicle.seats || 4} seats</p>
                  <p className="mt-1 text-slate-400">City: {vehicle.serviceCity || 'All'}</p>
                </div>
                <select value={vehicle.status} onChange={(e) => updateStatus(vehicle._id, e.target.value)} className="fleet-input max-w-[150px]">
                  <option value="available">available</option>
                  <option value="busy">busy</option>
                  <option value="offline">offline</option>
                </select>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-slate-800/80 p-3">
                  <IndianRupee size={16} className="mx-auto mb-1 text-green-300" />
                  <p className="text-xs text-slate-400">Per km</p>
                  <p className="font-bold">Rs {vehicle.perKmRate}</p>
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-3">
                  <Clock3 size={16} className="mx-auto mb-1 text-blue-300" />
                  <p className="text-xs text-slate-400">Hourly</p>
                  <p className="font-bold">Rs {vehicle.hourlyRate}</p>
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-3">
                  <Users size={16} className="mx-auto mb-1 text-amber-200" />
                  <p className="text-xs text-slate-400">Full day</p>
                  <p className="font-bold">Rs {vehicle.fullDayRate}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-700/60 bg-slate-900/60 p-4 text-sm text-slate-300">
                <span className="font-bold text-white">Driver:</span> {vehicle.driverName || 'Not assigned'} {vehicle.driverPhone ? `| ${vehicle.driverPhone}` : ''}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => editVehicle(vehicle)} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 font-bold transition hover:bg-blue-400">
                  <Pencil size={16} />
                  Edit
                </button>
                <button onClick={() => deleteVehicle(vehicle._id)} className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 font-bold transition hover:bg-red-400">
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {vehicles.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-600 bg-[#111827] p-10 text-center text-slate-300 xl:col-span-2">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/15 text-green-300">
                <Car size={28} />
              </div>
              <h3 className="text-xl font-bold text-white">No cabs added yet</h3>
              <p className="mx-auto mt-2 max-w-md text-slate-400">
                Add your first cab above so matching customer bookings can appear in your travel partner panel.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
