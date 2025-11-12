import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AnnouncementsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  };

  return (
    <div style={{ maxWidth: 920, margin: '40px auto', padding: 20 }}>
      <h2>Annonces</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(a => (
          <div key={a.id} className="announcements-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{a.title || '(sans titre)'}</strong>
              <small style={{ color: '#6b7280' }}>{new Date(a.created_at).toLocaleString()}</small>
            </div>
            <p style={{ marginTop: 8 }}>{a.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}