export const colors = {
  bg: '#07111f',
  bg2: '#0c1828',
  panel: '#101d2d',
  muted: '#8da0b9',
  text: '#f6fff9',
  green: '#20e68a',
  greenDark: '#10b86b',
  blue: '#2489ff',
  amber: '#f5b942',
  border: 'rgba(255,255,255,0.10)',
};

export const savedPlaces = [
  { label: 'Home', address: 'Vikas Nagar, Lucknow', eta: '2 min pickup' },
  { label: 'Office', address: 'Gomti Nagar, Lucknow', eta: '12 min ride' },
  { label: 'Airport', address: 'Chaudhary Charan Singh Airport', eta: '32 min ride' },
];

export const rideOptions = [
  { id: 'quick', name: 'Quick Driver', time: '3 min', price: 249, desc: 'Verified driver for city rides' },
  { id: 'hourly', name: 'Hourly Driver', time: '5 min', price: 599, desc: '2h, 4h, 8h flexible packages' },
  { id: 'premium', name: 'Premium Drive', time: '7 min', price: 999, desc: 'Top rated driver for long trips' },
];

export const driver = {
  name: 'Amit Verma',
  rating: '4.9',
  rides: '1,284',
  car: 'White Swift Dzire',
  plate: 'UP32 AB 4581',
  phone: '+91 70075 15654',
};

export const routeStops = {
  pickup: 'Current Location',
  drop: 'Hazratganj, Lucknow',
  distance: '8.4 km',
  duration: '24 min',
};
