import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

/*
  Page publique /contact
  Permet à un visiteur de signaler une église manquante.
  Les signalements sont insérés dans la table `church_reports`.
  Champs min : reporter_name, reporter_email (optionnel), church_name, country, city, details.
*/

export default function Contact() {
  const [form, setForm] = useState({
    reporter_name: "",
    reporter_email: "",
    church_name: "",
    country: "",
    city: "",
    neighborhood: "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.church_name || !form.country || !form.city) {
      alert("Veuillez renseigner au minimum le nom, le pays et la ville de l'église.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("church_reports").insert([{
        reporter_name: form.reporter_name || null,
        reporter_email: form.reporter_email || null,
        church_name: form.church_name,
        country: form.country,
        city: form.city,
        neighborhood: form.neighborhood || null,
        details: form.details || null,
        created_at: new Date().toISOString()
      }]);
      if (error) {
        console.error("Insert church_reports error:", error);
        alert("Erreur lors de l'envoi, réessaye plus tard.");
      } else {
        setSent(true);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
        <h2>Merci — signalement envoyé</h2>
        <p>Nous avons reçu votre signalement. Un administrateur validera et ajoutera l'église.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }} className="card">
      <h2>Signaler une église</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
        <input placeholder="Votre nom (optionnel)" value={form.reporter_name} onChange={(e) => setForm({ ...form, reporter_name: e.target.value })} />
        <input placeholder="Votre email (optionnel)" value={form.reporter_email} onChange={(e) => setForm({ ...form, reporter_email: e.target.value })} />
        <input placeholder="Nom de l'église" value={form.church_name} onChange={(e) => setForm({ ...form, church_name: e.target.value })} required />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="Pays" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} required />
          <input placeholder="Ville" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        </div>
        <input placeholder="Quartier (optionnel)" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
        <textarea placeholder="Détails / référence du lieu (optionnel)" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
        <div>
          <button className="button" type="submit" disabled={loading}>{loading ? "Envoi..." : "Envoyer le signalement"}</button>
        </div>
      </form>
    </div>
  );
}