import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

/*
  Formulaire pour ajouter / lister / supprimer des annonces (ticker).
  - title, content, language, dates optionnelles
  - Ces annonces s'affichent dans la page d'accueil (marquee)
*/

export default function SuperAnnouncements() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", content: "", language: "fr" });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(50);
    setItems(data || []);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.content) return alert("Le contenu est requis");
    const { data: { user } } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from("profiles").select("id").eq("auth_id", user?.id).single();
    await supabase.from("announcements").insert([{
      title: form.title,
      content: form.content,
      language: form.language,
      created_by: profile?.id || null
    }]);
    setForm({ title: "", content: "", language: "fr" });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer annonce ?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <h3>Gérer les annonces</h3>
      <form onSubmit={submit} style={{ display: "grid", gap: 8, marginBottom: 12 }}>
        <input placeholder="Titre (optionnel)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea placeholder="Contenu (texte qui défilera)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })}>
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="ln">Lingala</option>
          <option value="es">Español</option>
          <option value="pt">Português</option>
          <option value="zh">中文</option>
        </select>
        <button className="button" type="submit">Ajouter annonce</button>
      </form>

      <div>
        {items.map((a) => (
          <div key={a.id} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
            <div><strong>{a.title || "(sans titre)"}</strong></div>
            <div>{a.content}</div>
            <div style={{ marginTop: 6 }}>
              <button onClick={() => remove(a.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}