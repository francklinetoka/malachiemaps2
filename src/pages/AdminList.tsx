import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminList() {
  const [churches, setChurches] = useState<any[]>([]);
  useEffect(() => { load(); }, []);
  const load = async () => {
    const { data } = await supabase.from('churches').select('*').order('created_at', { ascending: false }).limit(200);
    setChurches(data || []);
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer cette église ?")) return;
    await supabase.from('churches').delete().eq('id', id);
    load();
  };
  return (
    <div>
      <h3>Liste des églises</h3>
      {churches.map(c => (
        <div key={c.id} className="card" style={{ marginBottom: 8 }}>
          <strong>{c.name}</strong> — {c.city} / {c.country}
          <div style={{ marginTop: 8 }}>
            <button className="button" onClick={() => window.location.href = `/church/${c.id}`}>Voir</button>
            <button style={{ marginLeft: 8 }} onClick={() => remove(c.id)}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
}