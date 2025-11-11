import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddChurch() {
  const [form, setForm] = useState<any>({
    name: "", country: "", city: "", province: "", neighborhood: "", address_reference: "", description: "", phone1: "", phone2: "", email: ""
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const uploadFiles = async () => {
    if (!files || files.length === 0) return [];
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const fileName = `${Date.now()}-${f.name.replace(/\s+/g,'-')}`;
      const { data, error } = await supabase.storage.from('church-photos').upload(fileName, f, { cacheControl: '3600', upsert: false });
      if (error) {
        console.error("Upload error", error);
        continue;
      }
      const publicUrl = supabase.storage.from('church-photos').getPublicUrl(data.path).data.publicUrl;
      urls.push(publicUrl);
    }
    return urls;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.country || !form.city || !form.address_reference || !form.description) {
      alert("Champs obligatoires manquants");
      return;
    }
    if (!files || files.length === 0) { alert("Au moins une photo requise"); return; }
    const uploaded = await uploadFiles();
    // Get current profile id as created_by
    const {
      data: { user }
    } = await supabase.auth.getUser();
    const { data: profile } = await supabase.from('profiles').select('id, is_approved').eq('auth_id', user?.id).single();
    if (!profile || !profile.is_approved) {
      alert("Compte non approuvé ou introuvable.");
      return;
    }
    const { error } = await supabase.from('churches').insert([{
      name: form.name,
      logo_url: uploaded[0] || null,
      photos: uploaded,
      country: form.country,
      city: form.city,
      province: form.province,
      neighborhood: form.neighborhood,
      address_reference: form.address_reference,
      description: form.description,
      phone1: form.phone1,
      phone2: form.phone2,
      email: form.email,
      socials: null,
      lat: null,
      lng: null,
      is_visible: true,
      created_by: profile.id
    }]);
    if (error) {
      console.error(error);
      alert("Erreur lors de la création");
    } else {
      alert("Église ajoutée");
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div style={{ padding: 20 }} className="card">
      <h2>Ajouter une église</h2>
      <form onSubmit={submit} className="grid" style={{ gap: 8 }}>
        <input className="input" placeholder="Nom de l'église" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input className="input" placeholder="Pays" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
          <input className="input" placeholder="Ville" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <input className="input" placeholder="Province" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} />
          <input className="input" placeholder="Quartier" value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} />
        </div>
        <input className="input" placeholder="Référence du lieu" value={form.address_reference} onChange={e => setForm({ ...form, address_reference: e.target.value })} />
        <textarea className="input" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="input" placeholder="Téléphone 1" value={form.phone1} onChange={e => setForm({ ...form, phone1: e.target.value })} />
        <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <div>
          <label>Photos (min 1)</label>
          <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} />
        </div>
        <div>
          <button className="button" type="submit">Ajouter</button>
        </div>
      </form>
    </div>
  );
}