import React, { useEffect, useState } from "react";
import { fetchCountries, fetchCitiesForCountry } from "../lib/location";

type Props = {
  onSearch: (filters: any) => void;
};

export default function SearchFilter({ onSearch }: Props) {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await fetchCountries();
      if (!mounted) return;
      setCountries(list);
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // When country changes, fetch cities for that country
    setCities([]);
    setProvinces([]);
    setNeighborhoods([]);
    if (!filters.country) return;
    (async () => {
      const list = await fetchCitiesForCountry(filters.country);
      setCities(list);
    })();
  }, [filters.country]);

  useEffect(() => {
    // Provinces/neighborhoods: we don't have a global API here.
    // Keep them optional and allow free text or simple static placeholders if needed.
    if (filters.city) {
      setProvinces(["(Choisir une province)"]);
      setNeighborhoods([]);
    } else {
      setProvinces([]);
      setNeighborhoods([]);
    }
  }, [filters.city]);

  const handleSearch = () => {
    // Basic validations: city requires country; otherwise province/neighborhood are optional
    if (filters.city && !filters.country) {
      alert("Veuillez choisir le pays avant la ville");
      return;
    }
    onSearch(filters);
  };

  return (
    <div className="search-card">
      <div className="search-row">
        <input
          className="search-input"
          placeholder="Rechercher par nom d'église, mot-clé..."
          value={filters.name || ""}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <button className="btn-primary" onClick={handleSearch}>
          Rechercher
        </button>
      </div>

      <div className="filters-grid" style={{ marginTop: 12 }}>
        <select
          className="select"
          value={filters.country || ""}
          onChange={(e) => setFilters({ ...filters, country: e.target.value, city: "", province: "", neighborhood: "" })}
        >
          <option value="">Tous les pays</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.city || ""}
          onChange={(e) => setFilters({ ...filters, city: e.target.value, province: "", neighborhood: "" })}
          disabled={!filters.country}
        >
          <option value="">Ville</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.province || ""}
          onChange={(e) => setFilters({ ...filters, province: e.target.value })}
          disabled={!filters.country}
        >
          <option value="">Province (optionnel)</option>
          {provinces.map((p) => (
            <option key={p} value={p === "(Choisir une province)" ? "" : p}>
              {p}
            </option>
          ))}
        </select>

        <select
          className="select"
          value={filters.neighborhood || ""}
          onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
          disabled={!filters.country}
        >
          <option value="">Quartier (optionnel)</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}