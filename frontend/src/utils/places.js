export const INDIA_CENTER = { address: 'India', lat: 22.9734, lng: 78.6569 };

export function mapIndiaSuggestion(item) {
  return {
    address: item.display_name,
    lat: Number(item.lat),
    lng: Number(item.lon),
  };
}

export async function searchIndiaLocations(query, limit = 8) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=in&limit=${limit}&q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch India locations');
  }

  const data = await response.json();
  return data.map(mapIndiaSuggestion);
}

export async function resolveIndiaLocation(query) {
  const results = await searchIndiaLocations(query, 1);
  return results[0] || null;
}