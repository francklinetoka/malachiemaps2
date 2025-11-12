import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import Map from "../components/Map";
import { supabase } from "../lib/supabaseClient";
import ChurchCard from "../components/ChurchCard";
import HelpFloating from "../components/HelpFloating";

export default function Home() {
  const [churches, setChurches] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
    fetchAnnouncements();
    const sub = supabase
      .channel("public-churches")
      .on("postgres_changes", { event: "*", schema: "public", table: "churches" }, () => fetchAll())
      .subscribe();
    return () => supabase.removeChannel(sub);
  }, []);

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from("churches")
      .select("*")
      .eq('is_visible', true)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) console.error(error);
    else {
      setChurches(data || []);
      setTotal((data || []).length);
      const recentList = (data || []).filter((c: any) => {
        const created = new Date(c.created_at).getTime();
        return (Date.now() - created) <= (3 * 24 * 3600 * 1000);
      });
      setRecent(recentList);
    }
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(50);
    setAnnouncements(data || []);
  };

  const handleSearch = async (filters: any) => {
    let query = supabase.from("churches").select("*").eq('is_visible', true);
    if (filters.name) query = query.ilike("name", `%${filters.name}%`);
    if (filters.country) query = query.eq("country", filters.country);
    if (filters.city) query = query.eq("city", filters.city);
    const { data, error } = await query.order("created_at", { ascending: false }).limit(500);
    if (error) console.error(error);
    else {
      setChurches(data || []);
      setTotal((data || []).length);
    }
  };

  return (
    <div className="page-root">
      
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <h1 className="hero-title">Retrouve les églises du message, partout dans le monde</h1>
            <p className="hero-sub">Recherche par nom, pays, ville. Signale une église si elle manque.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <div className="stat">
                <div className="stat-value">{total}</div>
                <div className="stat-label">Églises répertoriées</div>
              </div>
              <div className="stat">
                <div className="stat-value">{announcements.length}</div>
                <div className="stat-label">Annonces</div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            
            <div className="search-card">
              <SearchFilter onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      <main className="content-main">
        <div className="results">
          <div className="results-header">
            <h2>Résultats</h2>
            <div>{total} trouvées</div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 18, alignItems: 'center' }}>
            <a className="link" href="/annonces">Annonces</a>
            <div style={{ flexGrow: 1 }} />
            <div>Récemment ajoutées (3 jours) : <strong>{recent.length}</strong></div>
          </div>

          <div className="list-grid">
            {churches.map((c) => <ChurchCard key={c.id} church={c} />)}
          </div>
        </div>

        <aside className="map-aside" id="map">
          <Map markers={churches.filter((c) => c.lat && c.lng)} />
        </aside>
      </main>

      <section className="container" style={{ marginTop: 28 }}>
        <h3>Églises ajoutées récemment</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {recent.map((r) => <ChurchCard key={r.id} church={r} />)}
        </div>
      </section>

   

      <HelpFloating />
    </div>
  );
}