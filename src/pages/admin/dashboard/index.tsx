import React from "react";

export default function AdminDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Tableau de bord - Admin de contenu</h2>
      <div style={{ display: "flex", gap: 20 }}>
        <nav style={{ width: 220, borderRight: "1px solid #eee", paddingRight: 12 }}>
          <ul>
            <li>Vue d'ensemble</li>
            <li><a href="/admin/dashboard/add">Ajouter une église</a></li>
            <li><a href="/admin/dashboard/list">Liste des églises</a></li>
          </ul>
        </nav>
        <section style={{ flex: 1 }}>
          <h3>Bienvenue</h3>
          <p>Utilisez le menu à gauche pour gérer les églises.</p>
        </section>
      </div>
    </div>
  );
}