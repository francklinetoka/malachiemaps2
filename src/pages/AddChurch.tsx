import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { fetchCountries, fetchCitiesForCountry } from "../lib/location";

/*
  AddChurch page updated:
  - 3 explicit image fields (photo1, photo2, photo3)
  - minimum 1 photo required, max 3
  - dynamic country->cities
*/

export default function AddChurch() {
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [form, setForm] = useState<any>({
    name: "",
    country: "",
    city: "",
    province: "",
    neighborhood: "",
    address_reference: "",
    description: "",
    phone1: "",
    phone2: "",
    email: "",
    socials: { facebook: "", youtube: "", instagram: "", tiktok: "" }
  });
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [photo3, setPhoto3] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const list = await fetchCountries();
      setCountries(list);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!form.country) { setCities([]); return; }
      const list = await fetchCitiesForCountry(form.country);
      setCities(list);
    })();
  }, [form.country]);

  const uploadFile = async (file: File | null) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g,'-')}`;
    const { data, error } = await supabase.storage.from('church-photos').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) {
      console.error('upload error', error);
      return null;
    }
    const publicUrl = supabase.storage.from('church-photos').getPublicUrl(data.path).data.publicUrl;
    return publicUrl;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.name || !form.country || !form.city || !form.address_reference || !form.description) {
      alert('Champs obligatoires manquants');
      return;
    }
    const files = [photo1, photo2, photo3].filter(Boolean) as File[];
    if (files.length === 0) { alert('Au moins une photo requise'); return; }
    if (files.length > 3) { alert('Maximum 3 photos autorisées'); return; }
    setLoading(true);
    try {
      const urls: string[] = [];
      for (const f of files) {
        const u = await uploadFile(f);
        if (u) urls.push(u);
      }
      const { data: { user } } = await supabase.auth.getUser();
      const profileRes = await supabase.from('profiles').select('id,is_approved').eq('auth_id', user?.id).single();
      if (!profileRes.data || !profileRes.data.is_approved) {
        alert('Compte non approuvé ou introuvable.');
        setLoading(false);
        return;
      }
      const { error } = await supabase.from('churches').insert([{
        name: form.name,
        logo_url: urls[0] || null,
        photos: urls,
        country: form.country,
        city: form.city,
        province: form.province || null,
        neighborhood: form.neighborhood || null,
        address_reference: form.address_reference,
        description: form.description,
        phone1: form.phone1 || null,
        phone2: form.phone2 || null,
        email: form.email || null,
        socials: form.socials,
        lat: null,
        lng: null,
        is_visible: true,
        created_by: profileRes.data.id
      }]);
      if (error) { console.error(error); alert('Erreur lors de la création'); }
      else { alert('Église ajoutée'); window.location.href = '/admin/dashboard/content/list'; }
    } catch (err) {
      console.error(err); alert('Erreur serveur');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ maxWidth: 920, margin: '40px auto', padding: 20 }}>
      <h2>Ajouter une église</h2>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Nom de l'église" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}>
            <option value="">Choisir pays</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} disabled={!form.country}>
            <option value="">Choisir ville</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input placeholder="Province (optionnel)" value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} />
          <input placeholder="Quartier (optionnel)" value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} />
        </div>

        <input placeholder="Référence du lieu" value={form.address_reference} onChange={e => setForm({ ...form, address_reference: e.target.value })} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

        <input placeholder="Téléphone 1" value={form.phone1} onChange={e => setForm({ ...form, phone1: e.target.value })} />
        <input placeholder="Téléphone 2" value={form.phone2} onChange={e => setForm({ ...form, phone2: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />

        <div>
          <label style={{ fontWeight: 700 }}>Photo 1 (obligatoire)</label>
          <input type="file" accept="image/*" onChange={e => setPhoto1(e.target.files ? e.target.files[0] : null)} />
        </div>
        <div>
          <label>Photo 2 (optionnel)</label>
          <input type="file" accept="image/*" onChange={e => setPhoto2(e.target.files ? e.target.files[0] : null)} />
        </div>
        <div>
          <label>Photo 3 (optionnel)</label>
          <input type="file" accept="image/*" onChange={e => setPhoto3(e.target.files ? e.target.files[0] : null)} />
        </div>

        <div>
          <button className="button" disabled={loading} type="submit">{loading ? 'Envoi...' : 'Ajouter'}</button>
        </div>
      </form>
    </div>
  );
}