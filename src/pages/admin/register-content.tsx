import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/*
  Page d'inscription dédiée à l'Admin de Contenu.
  - Inscription utilisateur via Supabase Auth.
  - Création d'un profil role=CONTENT_ADMIN avec is_approved = false (doit être validé par SuperAdmin).
*/

export default function RegisterContentAdmin() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    country: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.country) {
      alert("Champs obligatoires manquants");
      return;
    }
    if (form.password !== form.confirm_password) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (signUpError) {
        console.error(signUpError);
        alert("Erreur d'inscription : " + signUpError.message);
        setLoading(false);
        return;
      }

      // Create profile with CONTENT_ADMIN, not approved yet
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          auth_id: signUpData.user?.id || null,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          country: form.country,
          role: "CONTENT_ADMIN",
          is_approved: false,
        },
      ]);

      if (profileError) {
        console.error(profileError);
        alert("Erreur création profil : " + profileError.message);
        setLoading(false);
        return;
      }

      alert("Inscription enregistrée. Veuillez patienter la validation du SuperAdmin.");
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 20 }}>
      <h2>Inscription Admin de Contenu</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="Prénom" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <input placeholder="Nom" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        </div>
        <input placeholder="Pays" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <input placeholder="Téléphone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input type="password" placeholder="Mot de passe" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input type="password" placeholder="Confirmer mot de passe" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} />
        </div>
        <div>
          <button disabled={loading} style={{ background: "#7A4B2A", color: "#fff", padding: "10px 14px", border: "none", borderRadius: 8 }}>
            {loading ? "Enregistrement..." : "S'inscrire"}
          </button>
        </div>
      </form>
    </div>
  );
}