import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChurchDetail from "./pages/ChurchDetail";

// Admin pages (new)
import AdminLogin from "./pages/admin/login";
import RegisterContentAdmin from "./pages/admin/register-content";
import RegisterSuperAdmin from "./pages/admin/register-superadmin";
import AdminDashboard from "./pages/admin/dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/church/:id" element={<ChurchDetail />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register/content" element={<RegisterContentAdmin />} />
      <Route path="/admin/register/super" element={<RegisterSuperAdmin />} />
      <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
    </Routes>
  );
}

