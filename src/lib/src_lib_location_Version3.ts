// helper for fetching countries and cities
export async function fetchCountries(): Promise<string[]> {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all');
    const data = await res.json();
    // map to common names and sort
    const names = data.map((c: any) => c.name.common).sort((a: string, b: string) => a.localeCompare(b));
    return names;
  } catch (e) {
    console.error('fetchCountries error', e);
    return [];
  }
}

// For cities, use countriesnow API (public)
export async function fetchCitiesForCountry(country: string): Promise<string[]> {
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country })
    });
    const json = await res.json();
    if (json.error || !json.data) return [];
    return json.data.sort((a: string, b: string) => a.localeCompare(b));
  } catch (e) {
    console.error('fetchCitiesForCountry error', e);
    return [];
  }
}