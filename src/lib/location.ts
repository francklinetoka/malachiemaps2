// helper for fetching countries and cities (used by search & admin forms)
// Uses restcountries.com for countries and countriesnow.space for cities.
// Falls back to a small static list if external APIs fail.
export async function fetchCountries(): Promise<string[]> {
  try {
    // L'endpoint '/all' de restcountries.com récupère TOUS les pays.
    const res = await fetch("https://restcountries.com/v3.1/all");
    if (!res.ok) {
      // Si la réponse n'est pas 200 OK (e.g., 404, 500, etc.), lever une erreur.
      throw new Error(`restcountries fetch failed with status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Extrait le nom commun et trie
    const names = data
      .map((c: any) => c?.name?.common)
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));
      
    return names; // Retourne tous les pays du monde
    
  } catch (err) {
    console.error("fetchCountries error, using extended fallback list", err);
    // Fallback étendu : pour maintenir l'UX en cas d'échec de l'API externe.
    return [
      "Afghanistan",
      "Afrique du Sud",
      "Allemagne",
      "Brésil",
      "Cameroun",
      "Canada",
      "Chine",
      "Espagne",
      "États-Unis",
      "France",
      "Inde",
      "Kenya",
      "Nigeria",
      "Portugal",
      "République Démocratique du Congo",
      "République du Congo",
      "Royaume-Uni",
      "Russie",
      "Sénégal",
    ].sort((a: string, b: string) => a.localeCompare(b)); // S'assurer que le fallback est trié
  }
}

// NOTE: fetchCitiesForCountry n'a pas besoin d'être modifié,
// car il dépend de l'API externe countriesnow.space.

export async function fetchCitiesForCountry(country: string): Promise<string[]> {
  try {
    // countriesnow.space API expects exact country names for best results
    const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });
    if (!res.ok) throw new Error("countriesnow fetch failed");
    const json = await res.json();
    if (!json || !json.data) return [];
    return (json.data as string[]).sort((a, b) => a.localeCompare(b));
  } catch (err) {
    console.error("fetchCitiesForCountry error", err);
    // fallback: return a small sample set so UI remains usable
    return ["Ville Principale", "Ville Secondaire", "Autre Ville"];
  }
}