export const PRICING_PLAN_KEY = 'driveease_selected_plan';

export const CUSTOMER_PLANS = [
  {
    id: 'basic',
    name: 'BASIC',
    price: 0,
    discountRate: 0,
    priority: 'Standard',
    driverQuality: 'Normal drivers',
    quoteExample: 250,
  },
  {
    id: 'smart',
    name: 'SMART',
    price: 99,
    discountRate: 0.08,
    priority: 'Priority',
    driverQuality: '4+ rated drivers',
    quoteExample: 230,
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    price: 299,
    discountRate: 0.15,
    priority: 'Fastest pickup',
    driverQuality: '4.5+ verified drivers',
    quoteExample: 210,
  },
];

export const DRIVER_PLANS = [
  {
    id: 'driver-basic',
    name: 'STARTER',
    price: 0,
    subtitle: 'New drivers ke liye',
    benefits: ['Normal request visibility', 'Standard payout tracking', 'Basic support'],
    earningNote: 'Standard earnings',
  },
  {
    id: 'driver-pro',
    name: 'PRO DRIVER',
    price: 149,
    subtitle: 'Active drivers ke liye',
    benefits: ['Better request visibility', 'Priority support', 'Weekly performance tips'],
    earningNote: 'More ride opportunities',
    popular: true,
  },
  {
    id: 'driver-elite',
    name: 'ELITE DRIVER',
    price: 299,
    subtitle: 'Top-rated drivers ke liye',
    benefits: ['Premium customer requests', 'Fast support lane', 'Earnings insights'],
    earningNote: 'Premium request access',
  },
];

export const FLEET_PLANS = [
  {
    id: 'fleet-basic',
    name: 'FLEET BASIC',
    price: 0,
    subtitle: 'Small partners ke liye',
    benefits: ['Standard lead access', 'Cab management', 'Basic profile'],
    profitNote: 'Standard lead flow',
  },
  {
    id: 'fleet-growth',
    name: 'FLEET GROWTH',
    price: 499,
    subtitle: 'Growing travel teams ke liye',
    benefits: ['Higher lead visibility', 'Fleet readiness insights', 'Priority partner support'],
    profitNote: 'More conversion chances',
    popular: true,
  },
  {
    id: 'fleet-pro',
    name: 'FLEET PRO',
    price: 999,
    subtitle: 'High-volume operators ke liye',
    benefits: ['Top lead visibility', 'Premium booking routing', 'Operations support'],
    profitNote: 'Best lead priority',
  },
];

export const getSelectedCustomerPlan = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(PRICING_PLAN_KEY));
    return CUSTOMER_PLANS.find((plan) => plan.id === stored?.id) || CUSTOMER_PLANS[0];
  } catch {
    return CUSTOMER_PLANS[0];
  }
};

export const saveSelectedPlan = (plan) => {
  localStorage.setItem(
    PRICING_PLAN_KEY,
    JSON.stringify({
      id: plan.id,
      name: plan.name,
      discountRate: plan.discountRate || 0,
      selectedAt: new Date().toISOString(),
    })
  );
};

export const applyCustomerPlanToFare = (rawFare, plan = getSelectedCustomerPlan()) => {
  const subtotal = Number(rawFare || 0);
  const discount = Math.round(subtotal * Number(plan.discountRate || 0));
  const total = Math.max(0, subtotal - discount);

  return {
    subtotal,
    discount,
    total,
    planId: plan.id,
    planName: plan.name,
    discountRate: plan.discountRate || 0,
  };
};
