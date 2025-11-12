import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importations des ressources
import en from '../public/locales/en/common.json';
import fr from '../public/locales/fr/common.json';
import zh from '../public/locales/zh/common.json'; // Chinois
import ln from '../public/locales/ln/common.json'; // Lingala
import pt from '../public/locales/pt/common.json'; // Portugais
import es from '../public/locales/es/common.json'; // Espagnol
import ru from '../public/locales/ru/common.json'; // Russe
import af from '../public/locales/af/common.json'; // Afrikaans
import sw from '../public/locales/sw/common.json'; // Swahili

const resources = {
  en: { common: en },
  fr: { common: fr },
  zh: { common: zh }, // Ajouté
  ln: { common: ln }, // Ajouté
  pt: { common: pt }, // Ajouté
  es: { common: es }, // Ajouté
  ru: { common: ru }, // Ajouté
  af: { common: af }, // Ajouté
  sw: { common: sw }, // Ajouté
};

i18n.use(initReactI18next).init({
  resources,
  // Langue de repli au cas où la langue désirée n'est pas disponible
  fallbackLng: 'fr', 
  // Détermine la langue initiale (localStorage > navigateur > fr)
  lng: localStorage.getItem('malachie_lang') || navigator.language.split('-')[0] || 'fr',
  
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false }
});

export default i18n;