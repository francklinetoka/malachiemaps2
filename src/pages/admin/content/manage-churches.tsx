import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

/*
  Liste des églises pour Admin Contenu avec actions :
   - Voir
   - Modifier (redirection vers page d'édition si besoin)
   - Supprimer
   - Bloquer / Débloquer visibilité
*/

export default function ManageChurches() {
  const [churches, setChurches] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from("churches").select("*").order("created_at", { ascending: false }).limit(500);
    setChurches(data || []);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette église ?")) return;
    await supabase.from("churches").delete().eq("id", id);
    load();
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from("churches").update({ is_visible: !current }).eq("id", id);
    load();
  };

  return (
    <div>
      <h3>Liste des églises</h3>
      {churches.map((c) => (
        <div key={c.id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 8, borderRadius: 8 }}>
          <strong>{c.name}</strong> — {c.city} / {c.country}
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={() => (window.location.href = `/church/${c.id}`)} className="button">Voir</button>
            <button onClick={() => remove(c.id)}>Supprimer</button>
            <button onClick={() => toggleVisibility(c.id, c.is_visible)}>{c.is_visible ? "Bloquer" : "Rendre visible"}</button>
          </div>
        </div>
      ))}
    </div>
  );
}