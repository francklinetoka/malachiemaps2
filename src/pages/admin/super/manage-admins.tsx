import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

/*
  Composant SuperAdmin pour gérer les administrateurs:
  - Lister tous les profils admin
  - Ajouter, modifier role, approuver, bloquer, supprimer
  Note: Pour production, applique RLS et vérifications côté serveur.
*/

export default function ManageAdmins() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").in("role", ["SUPERADMIN", "CONTENT_ADMIN"]).order("created_at", { ascending: false });
    setAdmins(data || []);
    setLoading(false);
  };

  const setApprove = async (id: string, approve: boolean) => {
    await supabase.from("profiles").update({ is_approved: approve }).eq("id", id);
    load();
  };

  const setBlock = async (id: string, block: boolean) => {
    await supabase.from("profiles").update({ is_blocked: block }).eq("id", id);
    load();
  };

  const changeRole = async (id: string, role: string) => {
    await supabase.from("profiles").update({ role }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet administrateur ?")) return;
    await supabase.from("profiles").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h3>Gestion des administrateurs</h3>
      {loading && <div>Chargement...</div>}
      {admins.map((a) => (
        <div key={a.id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 8 }}>
          <div><strong>{a.first_name} {a.last_name}</strong> — {a.email}</div>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={() => setApprove(a.id, true)}>Approuver</button>
            <button onClick={() => setApprove(a.id, false)}>Refuser</button>
            <button onClick={() => setBlock(a.id, !a.is_blocked)}>{a.is_blocked ? "Débloquer" : "Bloquer"}</button>
            <select defaultValue={a.role} onChange={(e) => changeRole(a.id, e.target.value)}>
              <option value="CONTENT_ADMIN">Admin de contenu</option>
              <option value="SUPERADMIN">SuperAdmin</option>
            </select>
            <button onClick={() => remove(a.id)}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
}