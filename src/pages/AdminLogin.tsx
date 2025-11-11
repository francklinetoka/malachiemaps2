import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handle = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Erreur de connexion: " + error.message);
      return;
    }
    // Check profile approved
    const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('email', email).single();
    if (profileError || !profileData) {
      alert("Profil introuvable. Contactez le support.");
      return;
    }
    if (!profileData.is_approved) {
      alert("Veuillez patienter, le SuperAdmin vérifie vos informations.");
      await supabase.auth.signOut();
      return;
    }
    // redirect to dashboard
    window.location.href = "/admin/dashboard";
  };

  return (
    <div style={{ maxWidth: 480, margin: "60px auto" }} className="card">
      <h2>Connexion administrateur</h2>
      <form onSubmit={handle} className="grid">
        <input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input" placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div>
          <button className="button" type="submit">Se connecter</button>
        </div>
      </form>
      <div style={{ marginTop: 12 }}>
        Mot de passe oublié ? Contacter le support.
      </div>
    </div>
  );
}