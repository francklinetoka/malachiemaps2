import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";

export default function ContactModal() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    reporter_name: "",
    reporter_email: "",
    church_name: "",
    country: "",
    city: "",
    details: ""
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: any) => {
    e.preventDefault();
    if (!form.church_name || !form.country || !form.city) {
      alert("Veuillez renseigner le nom, le pays et la ville.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('church_reports').insert([{
      reporter_name: form.reporter_name || null,
      reporter_email: form.reporter_email || null,
      church_name: form.church_name,
      country: form.country,
      city: form.city,
      details: form.details || null
    }]);
    setLoading(false);
    if (error) { console.error(error); alert("Erreur lors de l'envoi."); }
    else { setDone(true); }
  };

  // render a compact page-style form; this component can be used on /contact page
  if (done) {
    return (
      <div className="card" style={{ padding: 20, maxWidth: 720, margin: '20px auto' }}>
        <h3>Merci — signalement envoyé</h3>
        <p>Nous avons reçu votre signalement. Un administrateur va le traiter.</p>
        <p>
          <a href="https://wa.me/?text=Bonjour%20MalachieMaps" target="_blank" rel="noreferrer" className="btn-outline">
            <i className="bi bi-whatsapp"></i> {t('contact_whatsapp')}
          </a>
          &nbsp;&nbsp;
          <a href="mailto:malachiemaps@gmail.com" className="btn-outline"><i className="bi bi-envelope-fill"></i> {t('contact_mail')}</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 18, maxWidth: 720, margin: '20px auto' }}>
      <h3>{t('report_church')}</h3>
      <input placeholder="Votre nom (optionnel)" value={form.reporter_name} onChange={e => setForm({ ...form, reporter_name: e.target.value })} />
      <input placeholder="Votre e-mail (optionnel)" value={form.reporter_email} onChange={e => setForm({ ...form, reporter_email: e.target.value })} />
      <input placeholder="Nom de l'église" value={form.church_name} onChange={e => setForm({ ...form, church_name: e.target.value })} required />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <input placeholder="Pays" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} required />
        <input placeholder="Ville" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required />
      </div>
      <textarea placeholder="Détails / Référence du lieu (optionnel)" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Envoi...' : t('submit')}</button>
        <a href={`https://wa.me/?text=Bonjour%20MalachieMaps%20-%20Je%20souhaite%20signaler%20une%20église%20: ${encodeURIComponent(form.church_name||'')}`} target="_blank" rel="noreferrer" className="btn-outline">
          <i className="bi bi-whatsapp"></i> {t('contact_whatsapp')}
        </a>
        <a href={`mailto:malachiemaps@gmail.com?subject=Signalement%20d'église&body=${encodeURIComponent(form.church_name || '')}`} className="btn-outline">
          <i className="bi bi-envelope-fill"></i> {t('contact_mail')}
        </a>
      </div>
    </form>
  );
}