import React, { useEffect, useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AdminList from "./AdminList";
import AdminPending from "./AdminPending";

export default function AdminDashboard() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const user = supabase.auth.getUser();
      const u = (await user).data.user;
      if (!u) {
        window.location.href = "/admin/login";
        return;
      }
      const { data } = await supabase.from('profiles').select('*').eq('auth_id', u.id).single();
      setProfile(data);
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Tableau de bord</h2>
      <div style={{ display: "flex", gap: 20 }}>
        <nav style={{ width: 240, borderRight: "1px solid #eee", paddingRight: 12 }}>
          <ul>
            <li><Link to="/admin/dashboard">Vue d'ensemble</Link></li>
            <li><Link to="/admin/dashboard/add">Ajouter une église</Link></li>
            <li><Link to="/admin/dashboard/list">Liste des églises</Link></li>
            {profile?.role === 'SUPERADMIN' && <li><Link to="/admin/dashboard/pending">Admins en attente</Link></li>}
          </ul>
        </nav>
        <section style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<div>Bienvenue, {profile?.first_name} {profile?.last_name}</div>} />
            <Route path="/add" element={<div>Utilisez le menu "Ajouter une église" (ou <Link to="/admin/dashboard/add">ici</Link>)</div>} />
            <Route path="/list" element={<AdminList />} />
            <Route path="/pending" element={<AdminPending />} />
          </Routes>
        </section>
      </div>
    </div>
  );
}