import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Building2, Car, CheckCircle2, Crown, Gauge, IndianRupee, ShieldCheck, Truck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  CUSTOMER_PLANS,
  DRIVER_PLANS,
  FLEET_PLANS,
  applyCustomerPlanToFare,
  saveSelectedPlan,
} from '../utils/pricingPlans';

const roles = [
  { id: 'customer', label: 'Customer', icon: UserRound },
  { id: 'driver', label: 'Driver', icon: Car },
  { id: 'fleet', label: 'Travel Partner', icon: Building2 },
];

const roleCopy = {
  customer: {
    title: 'Customer Ride Plans',
    subtitle: 'Plan select karte hi ride quote me discount and priority apply hoga.',
  },
  driver: {
    title: 'Driver Growth Plans',
    subtitle: 'Drivers ke liye request visibility, support, aur earning tools.',
  },
  fleet: {
    title: 'Travel Partner Plans',
    subtitle: 'Fleet owners ke liye lead priority, conversion, aur operations support.',
  },
};

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const initialRole = user?.role === 'fleet' ? 'fleet' : user?.role === 'driver' ? 'driver' : 'customer';
  const [activeRole, setActiveRole] = useState(initialRole);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const activePlans = activeRole === 'driver' ? DRIVER_PLANS : activeRole === 'fleet' ? FLEET_PLANS : CUSTOMER_PLANS;
  const exampleFare = useMemo(() => applyCustomerPlanToFare(250, selectedPlan || CUSTOMER_PLANS[0]), [selectedPlan]);

  const selectPlan = (plan) => {
    setSelectedPlan(plan);

    if (activeRole === 'customer') {
      saveSelectedPlan(plan);
      navigate('/book');
      return;
    }

    if (activeRole === 'driver') {
      navigate('/driver/dashboard');
      return;
    }

    navigate('/fleet/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#111827] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <section className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-extrabold text-emerald-300">
            <Crown size={18} />
            DriveEase Pricing
          </div>
          <h1 className="mt-5 text-4xl font-black md:text-6xl">Plans for every DriveEase user</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base font-semibold text-slate-300">
            Customer, driver, aur travel partner ke liye alag pricing. Customer plan ride fare me directly apply hota hai.
          </p>
        </section>

        <section className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 rounded-lg border border-slate-700 bg-[#172233] p-2">
          {roles.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveRole(id)}
              className={`flex h-12 items-center justify-center gap-2 rounded-lg text-sm font-black transition ${
                activeRole === id ? 'bg-emerald-500 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon size={17} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-emerald-300">{roles.find((role) => role.id === activeRole)?.label}</p>
              <h2 className="mt-1 text-3xl font-black">{roleCopy[activeRole].title}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-400">{roleCopy[activeRole].subtitle}</p>
            </div>

            {activeRole === 'customer' && (
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-100">
                Example quote: Rs {exampleFare.subtotal} - Rs {exampleFare.discount} = Rs {exampleFare.total}
              </div>
            )}
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {activePlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} role={activeRole} onSelect={() => selectPlan(plan)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function PlanCard({ plan, role, onSelect }) {
  const customer = role === 'customer';
  const example = customer ? applyCustomerPlanToFare(250, plan) : null;
  const premium = plan.id.includes('premium') || plan.id.includes('elite') || plan.id.includes('pro');
  const popular = plan.popular || plan.id === 'smart';

  return (
    <div className={`relative rounded-lg border p-6 shadow-2xl shadow-black/20 ${
      popular
        ? 'border-emerald-400 bg-gradient-to-br from-emerald-500 to-[#128c7e] text-slate-950'
        : premium
        ? 'border-amber-400/30 bg-gradient-to-br from-[#8b5a2b] to-[#d79535]'
        : 'border-slate-700 bg-[#172233]'
    }`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-white/40 bg-emerald-300 px-4 py-1 text-xs font-black text-slate-950">
          MOST POPULAR
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-2xl font-black">{plan.name}</p>
          <p className={`mt-2 text-sm font-bold ${popular ? 'text-slate-800' : 'text-emerald-200'}`}>{plan.subtitle || 'Best matched plan'}</p>
        </div>
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${popular ? 'bg-slate-950/15' : 'bg-emerald-500/10 text-emerald-300'}`}>
          {role === 'customer' ? <ShieldCheck size={22} /> : role === 'driver' ? <Gauge size={22} /> : <Truck size={22} />}
        </span>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-black">Rs {plan.price}</span>
        <span className={`pb-2 text-sm font-black ${popular ? 'text-slate-800' : 'text-emerald-200'}`}>/ month</span>
      </div>

      {customer ? (
        <div className={`mt-6 rounded-lg p-4 ${popular ? 'bg-slate-950/20' : 'bg-slate-950/70'}`}>
          <Info label="Booking Quote" value={`Rs ${example.total}`} />
          <Info label="Ride Discount" value={plan.discountRate ? `${Math.round(plan.discountRate * 100)}%` : 'No discount'} />
          <Info label="Priority Badge" value={plan.priority} />
          <Info label="Driver Quality" value={plan.driverQuality} />
        </div>
      ) : (
        <div className={`mt-6 rounded-lg p-4 ${popular ? 'bg-slate-950/20' : 'bg-slate-950/70'}`}>
          <Info label={role === 'driver' ? 'Earning Impact' : 'Profit Impact'} value={plan.earningNote || plan.profitNote} />
          <Info label="Support" value={popular ? 'Priority' : 'Standard'} />
        </div>
      )}

      <ul className="mt-6 space-y-3">
        {(plan.benefits || [
          plan.discountRate ? `${Math.round(plan.discountRate * 100)}% discount per ride` : 'Standard pricing per ride',
          plan.priority,
          plan.driverQuality,
        ]).map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm font-bold">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSelect}
        className={`mt-8 h-12 w-full rounded-lg text-sm font-black shadow-lg transition ${
          popular ? 'bg-slate-950 text-white hover:bg-slate-800' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
        }`}
      >
        {customer ? `Choose ${plan.name}` : role === 'driver' ? 'Use Driver Plan' : 'Use Partner Plan'}
      </button>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between gap-3 py-1 text-sm font-bold">
      <span className="opacity-80">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
