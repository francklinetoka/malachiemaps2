import React, { useEffect, useState } from "react";

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
    setCountries(["République du Congo", "France", "USA", "Espagne", "Portugal", "Chine"]);
  }, []);

  useEffect(() => {
    if (filters.country) {
      if (filters.country.includes("Congo")) setCities(["Brazzaville", "Pointe-Noire"]);
      else setCities(["Ville A", "Ville B"]);
    } else setCities([]);
    setProvinces([]);
    setNeighborhoods([]);
  }, [filters.country]);

  useEffect(() => {
    if (filters.city) setProvinces(["Province 1", "Province 2"]);
    else setProvinces([]);
    setNeighborhoods([]);
  }, [filters.city]);

  useEffect(() => {
    if (filters.province) setNeighborhoods(["Quartier 1", "Quartier 2"]);
    else setNeighborhoods([]);
  }, [filters.province]);

  const handleSearch = () => {
    if (filters.city && !filters.country) { alert("Veuillez choisir le pays avant la ville"); return; }
    if (filters.province && (!filters.country || !filters.city)) { alert("Veuillez choisir pays et ville avant la province"); return; }
    if (filters.neighborhood && (!filters.country || !filters.city || !filters.province)) { alert("Veuillez choisir pays, ville et province avant le quartier"); return; }
    onSearch(filters);
  };

  return (
    <div className="card">
      <div style={{ marginBottom: 8 }}>
        <input className="input" placeholder="Recherche par nom" value={filters.name || ""} onChange={e => setFilters({ ...filters, name: e.target.value })} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <select className="input" value={filters.country || ""} onChange={e => setFilters({ ...filters, country: e.target.value })}>
          <option value="">Choisir pays</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.city || ""} onChange={e => setFilters({ ...filters, city: e.target.value })}>
          <option value="">Choisir ville</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.province || ""} onChange={e => setFilters({ ...filters, province: e.target.value })}>
          <option value="">Choisir province</option>
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className="input" value={filters.neighborhood || ""} onChange={e => setFilters({ ...filters, neighborhood: e.target.value })}>
          <option value="">Choisir quartier</option>
          {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="button" onClick={handleSearch}>Rechercher</button>
        <a href="/admin/register">Signaler une église</a>
      </div>
    </div>
  );
}