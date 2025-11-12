import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import ManageAdmins from "./manage-admins";
import SuperAnnouncements from "./announcements";
import ContentDashboard from "../content";

/*
  Dashboard SuperAdmin:
  - Même actions que ContentAdmin (via ContentDashboard)
  - Gestion des administrateurs (ManageAdmins)
  - Formulaire pour les annonces (SuperAnnouncements)
*/

export default function SuperDashboard({ profile }: { profile: any }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>SuperAdmin</h2>
      <div style={{ display: "flex", gap: 20 }}>
        <nav style={{ width: 260, borderRight: "1px solid #eee", paddingRight: 12 }}>
          <ul>
            <li><Link to="/admin/dashboard/super">Vue d'ensemble</Link></li>
            <li><Link to="/admin/dashboard/super/content">Gérer les églises</Link></li>
            <li><Link to="/admin/dashboard/super/admins">Gérer les administrateurs</Link></li>
            <li><Link to="/admin/dashboard/super/announcements">Annonces / Ticker</Link></li>
          </ul>
        </nav>
        <section style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<div>Bienvenue SuperAdmin, {profile?.first_name}</div>} />
            <Route path="/content/*" element={<ContentDashboard profile={profile} />} />
            <Route path="/admins" element={<ManageAdmins />} />
            <Route path="/announcements" element={<SuperAnnouncements />} />
          </Routes>
        </section>
      </div>
    </div>
  );
}