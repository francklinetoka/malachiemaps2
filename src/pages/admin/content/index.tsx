import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import AddChurch from "./add-church";
import ManageChurches from "./manage-churches";

/*
  Dashboard de l'Admin de contenu
  - Navigation gauche avec liens (Tableau de bord minimal, Ajouter, Liste)
  - Section à droite affichant le composant selon la route sélectionnée
*/

export default function ContentDashboard({ profile }: { profile: any }) {
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin de contenu</h2>
      <div style={{ display: "flex", gap: 20 }}>
        <nav style={{ width: 240, borderRight: "1px solid #eee", paddingRight: 12 }}>
          <ul>
            <li><Link to="/admin/dashboard/content">Vue d'ensemble</Link></li>
            <li><Link to="/admin/dashboard/content/add">Ajouter une église</Link></li>
            <li><Link to="/admin/dashboard/content/list">Liste des églises</Link></li>
          </ul>
        </nav>
        <section style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<div>Bienvenue, {profile?.first_name} {profile?.last_name}</div>} />
            <Route path="/add" element={<AddChurch />} />
            <Route path="/list" element={<ManageChurches />} />
          </Routes>
        </section>
      </div>
    </div>
  );
}