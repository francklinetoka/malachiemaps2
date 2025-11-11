import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminPending() {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('is_approved', false);
    setPending(data || []);
  };

  const setApprove = async (id: string, approve: boolean) => {
    // Only SUPERADMIN in frontend is allowed to trigger; ensure your Supabase policies protect this in prod.
    const { error } = await supabase.from('profiles').update({ is_approved: approve }).eq('id', id);
    if (error) console.error(error);
    load();
  };

  return (
    <div>
      <h3>Admins en attente</h3>
      {pending.length === 0 && <div>Aucun admin en attente</div>}
      {pending.map(p => (
        <div key={p.id} className="card" style={{ marginBottom: 8 }}>
          <div>{p.first_name} {p.last_name} — {p.email} — {p.country}</div>
          <div style={{ marginTop: 8 }}>
            <button className="button" onClick={() => setApprove(p.id, true)} style={{ marginRight: 8 }}>Approuver</button>
            <button onClick={() => setApprove(p.id, false)}>Refuser / Bloquer</button>
          </div>
        </div>
      ))}
    </div>
  );
}