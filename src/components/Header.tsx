import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../i18n";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Charge la langue sauvegardée au montage
    const saved = localStorage.getItem('malachie_lang');
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }, [i18n]);

  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('malachie_lang', lng);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo.svg" alt="MalachieMaps" className="brand-logo" />
          <div className="brand-text">
            <div className="brand-title">MalachieMaps</div>
            <div className="brand-sub">{t('welcome')}</div>
          </div>
        </div>

        <div className="header-actions">
          <select 
            className="lang-select" 
            value={i18n.language} 
            onChange={changeLang}
          >
            <option value="fr">FR - Français</option>
            <option value="en">EN - English</option>
            <option value="ln">LN - Lingala</option>
            <option value="pt">PT - Português</option>
            <option value="es">ES - Español</option>
            <option value="zh">ZH - 中文 (Mandarin)</option>
            <option value="ru">RU - Русский</option>
            <option value="af">AF - Afrikaans</option>
            <option value="sw">SW - Swahili</option>
          </select>

          {/* Signaler ouvre la page /contact */}
          <Link to="/contact" className="btn-outline">
            <i className="bi bi-flag-fill" style={{ marginRight: 8 }}></i>{t('report_church')}
          </Link>
        </div>
      </div>
    </header>
    
  );
}