import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import SearchFilter from "../components/SearchFilter";
import Map from "../components/Map";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [churches, setChurches] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchAll();
    fetchAnnouncements();
    // subscribe to changes (simple realtime)
    const sub = supabase.channel('public-churches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'churches' }, () => fetchAll())
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, []);

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from('churches')
      .select('*')
      .eq('is_visible', true)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) console.error(error);
    else {
      setChurches(data || []);
      setTotal((data || []).length);
    }
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(10);
    setAnnouncements(data || []);
  };

  const handleSearch = async (filters: any) => {
    let query = supabase.from('churches').select('*').eq('is_visible', true);
    if (filters.name) query = query.ilike('name', `%${filters.name}%`);
    if (filters.country) query = query.eq('country', filters.country);
    if (filters.city) query = query.eq('city', filters.city);
    if (filters.province) query = query.eq('province', filters.province);
    if (filters.neighborhood) query = query.eq('neighborhood', filters.neighborhood);
    const { data, error } = await query.order('created_at', { ascending: false }).limit(200);
    if (error) console.error(error);
    else {
      setChurches(data || []);
      setTotal((data || []).length);
    }
  };

  return (
    <div>
      <Header />
      <div className="ticker"><marquee>{announcements.map(a => a.content).join(' — ') || 'Bienvenue sur MalachieMaps'}</marquee></div>
      <div className="container grid cols-2" style={{ alignItems: 'start' }}>
        <div>
          <SearchFilter onSearch={handleSearch} />
          <div style={{ marginTop: 12 }}>
            <strong>{total}</strong> églises ajoutées — <a href="#map">Voir sur la carte</a>
            <div style={{ marginTop: 12 }}>
              {churches.map(c => (
                <div key={c.id} className="card" style={{ marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>{c.name}</h3>
                  <p style={{ margin: 0 }}>{c.city}, {c.country}</p>
                  <p style={{ marginTop: 8 }}>{c.address_reference}</p>
                  <a href={`/church/${c.id}`}>Voir</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div id="map">
          <Map markers={churches.filter(c => c.lat && c.lng)} />
        </div>
      </div>
      <footer className="footer">
        Contact : +242069750376 ; malachiemaps@gmail.com ; Brazzaville, République du Congo
      </footer>
    </div>
  );
}