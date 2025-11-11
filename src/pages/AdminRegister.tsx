import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminRegister() {
  const [form, setForm] = useState<any>({ first_name: "", last_name: "", country: "", email: "", phone: "", password: "", role: "CONTENT_ADMIN", superSecret: "" });

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.first_name || !form.last_name || !form.email || !form.password || !form.country) {
      alert("Champs obligatoires manquants");
      return;
    }
    // Sign up using Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });
    if (signUpError) {
      console.error(signUpError);
      alert("Erreur d'inscription : " + signUpError.message);
      return;
    }
    // Create profile row (is_approved=false by default)
    const { error: profileError } = await supabase.from('profiles').insert([{
      auth_id: signUpData.user?.id || null,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      country: form.country,
      role: form.role,
      is_approved: form.role === 'SUPERADMIN' ? true : false
    }]);
    if (profileError) {
      console.error(profileError);
      alert("Erreur création profil : " + profileError.message);
      return;
    }
    alert("Inscription enregistrée. Veuillez patienter la validation du SuperAdmin.");
    window.location.href = "/";
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }} className="card">
      <h2>Inscription administrateur</h2>
      <form onSubmit={submit} className="grid" style={{ gap: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input className="input" placeholder="Prénom" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
          <input className="input" placeholder="Nom" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
        </div>
        <input className="input" placeholder="Pays" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
        <input className="input" placeholder="Téléphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Mot de passe" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <div>
          <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="CONTENT_ADMIN">Admin de contenu</option>
            <option value="SUPERADMIN">SuperAdmin</option>
          </select>
        </div>
        <div>
          <button className="button" type="submit">S'inscrire</button>
        </div>
      </form>
    </div>
  );
}