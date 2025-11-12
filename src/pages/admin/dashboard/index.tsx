import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient";
import ContentDashboard from "../content";
import SuperDashboard from "../super";

/*
  Entrée unique /admin/dashboard -> détecte le rôle et redirige ou affiche.
  Routes exposées:
   - /admin/dashboard/content -> admin contenu
   - /admin/dashboard/super -> super admin
*/

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        window.location.href = "/admin/login";
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("auth_id", user.id).single();
      setProfile(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Chargement...</div>;
  if (!profile) return <div style={{ padding: 20 }}>Profil introuvable</div>;

  return (
    <Routes>
      <Route path="/" element={profile.role === "SUPERADMIN" ? <SuperDashboard profile={profile} /> : <ContentDashboard profile={profile} />} />
      <Route path="/super/*" element={<SuperDashboard profile={profile} />} />
      <Route path="/content/*" element={<ContentDashboard profile={profile} />} />
    </Routes>
  );
}