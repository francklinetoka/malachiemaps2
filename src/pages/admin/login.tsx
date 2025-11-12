import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

/*
  Page de connexion partagée pour SuperAdmin et Admin de contenu.
  - Après connexion, récupère le profil et redirige selon le rôle :
    - SUPERADMIN -> /admin/dashboard/super
    - CONTENT_ADMIN -> /admin/dashboard/content
  - Si is_approved = false -> affiche message "Veuillez patienter..."
*/

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert("Erreur de connexion: " + error.message);
        setLoading(false);
        return;
      }

      // get profile
      const { data: profileData, error: profileError } = await supabase.from("profiles").select("*").eq("email", email).single();
      if (profileError || !profileData) {
        alert("Profil introuvable. Contactez le support.");
        setLoading(false);
        await supabase.auth.signOut();
        return;
      }

      if (!profileData.is_approved) {
        alert("Veuillez patienter, le support vérifie vos informations.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (profileData.role === "SUPERADMIN") {
        window.location.href = "/admin/dashboard/super";
      } else {
        window.location.href = "/admin/dashboard/content";
      }
    } catch (err: any) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", padding: 20 }}>
      <h2>Connexion administrateur</h2>
      <form onSubmit={handle} style={{ display: "grid", gap: 8 }}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
        <div>
          <button className="button" disabled={loading} type="submit">
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </form>
      <div style={{ marginTop: 12 }}>Mot de passe oublié ? Contacter le support.</div>
    </div>
  );
}