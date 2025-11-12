import React from "react";
import { Routes, Route } from "react-router-dom";

// Composant de mise en page commun (avec Header et Footer)
import Layout from "./components/Layout"; 

// Pages publiques
import Home from "./pages/Home";
import ChurchDetail from "./pages/ChurchDetail";

// Admin pages
import AdminLogin from "./pages/admin/login";
import RegisterContentAdmin from "./pages/admin/register-content";
import RegisterSuperAdmin from "./pages/admin/register-superadmin";
import AdminDashboard from "./pages/admin/dashboard";

export default function App() {
  return (
    <Routes>
      
      {/* -------------------- 1. Pages Publiques (AVEC Layout) -------------------- */}
      {/* Les routes enveloppées par <Layout> afficheront le Header et le Footer. */}
      
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/church/:id" element={<Layout><ChurchDetail /></Layout>} />

      {/* -------------------- 2. Routes Admin (SANS Layout standard) -------------------- */}
      {/* Les routes Admin n'ont pas de Layout standard. */}
      
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register/content" element={<RegisterContentAdmin />} />
      <Route path="/admin/register/super" element={<RegisterSuperAdmin />} />
      
      {/* Le Dashboard pourrait utiliser un Layout Admin spécifique si nécessaire */}
      <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
    </Routes>
  );
}