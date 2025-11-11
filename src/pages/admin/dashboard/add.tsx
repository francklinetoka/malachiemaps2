import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AddChurch() {
  const [form, setForm] = useState<any>({
    name: "", country: "", city: "", province: "", neighborhood: "", addressReference: "", description: "", phone1: "", phone2: "", email: "", socials: {}
  });
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const handleFileChange = (e: any) => {
    setFiles(Array.from(e.target.files));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    const fd = new FormData();
    files.forEach(f => fd.append("files", f));
    const res = await axios.post("/api/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.urls || [];
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.country || !form.city || !form.addressReference || !form.description) {
      alert("Champs obligatoires manquants");
      return;
    }
    const urls = await uploadFiles();
    // createdById: for demo, assume 1. In prod, use session user id.
    const payload = { ...form, photos: urls, createdById: 1 };
    await axios.post("/api/churches", payload);
    alert("Église ajoutée");
    router.push("/admin/dashboard");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Ajouter une église</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Nom de l'église" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          <input placeholder="Pays" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          <input placeholder="Ville" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
          <input placeholder="Province" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} />
          <input placeholder="Quartier" value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Référence du lieu" value={form.addressReference} onChange={e => setForm({ ...form, addressReference: e.target.value })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Téléphone 1" value={form.phone1} onChange={e => setForm({ ...form, phone1: e.target.value })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div style={{ marginTop: 8 }}>
          <label>Photos (min 1)</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        </div>
        <div style={{ marginTop: 12 }}>
          <button style={{ background: "#7A4B2A", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6 }}>Ajouter</button>
        </div>
      </form>
    </div>
  );
}