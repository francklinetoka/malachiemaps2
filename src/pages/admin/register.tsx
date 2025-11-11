import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function AdminRegister() {
  const [form, setForm] = useState<any>({ firstName: "", lastName: "", country: "", email: "", phone: "", password: "", role: "CONTENT_ADMIN", superSecret: "" });
  const router = useRouter();

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/register", form);
      alert("Inscription enregistrée. Veuillez patienter la validation du SuperAdmin.");
      router.push("/");
    } catch (err: any) {
      alert(err.response?.data?.error || "Erreur");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", padding: 16, borderRadius: 8 }}>
      <h2>Inscription administrateur</h2>
      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input placeholder="Prénom" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
          <input placeholder="Nom" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <input placeholder="Pays" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} style={{ marginTop: 8 }} />
        <input placeholder="Téléphone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ marginTop: 8 }} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ marginTop: 8 }} />
        <input placeholder="Mot de passe" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ marginTop: 8 }} />
        <div style={{ marginTop: 10 }}>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value="CONTENT_ADMIN">Admin de contenu</option>
            <option value="SUPERADMIN">SuperAdmin (secret requis)</option>
          </select>
        </div>
        {form.role === "SUPERADMIN" && (
          <div style={{ marginTop: 8 }}>
            <input placeholder="Secret SuperAdmin" value={form.superSecret} onChange={e => setForm({ ...form, superSecret: e.target.value })} />
          </div>
        )}
        <div style={{ marginTop: 12 }}>
          <button style={{ background: "#7A4B2A", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6 }}>S'inscrire</button>
        </div>
      </form>
    </div>
  );
}