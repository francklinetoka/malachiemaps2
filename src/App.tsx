import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import AddChurch from "./pages/AddChurch";
import ChurchDetail from "./pages/ChurchDetail";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/church/:id" element={<ChurchDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      <Route path="/admin/dashboard/add" element={<AddChurch />} />
    </Routes>
  );
}