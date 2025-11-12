````markdown
# MalachieMaps (React + Supabase) - Starter

Ce dépôt contient une application React (Vite + TypeScript) prête à l'emploi pour lancer "MalachieMaps" :
- recherche d'églises par nom / pays / ville / province / quartier (sélections dépendantes),
- carte interactive (Leaflet / OpenStreetMap),
- authentification via Supabase (inscription admin / connexion),
- profils admin inactifs tant que SuperAdmin ne valide pas (is_approved=false),
- ajout / modification / suppression d'églises (admin approuvé),
- upload d'images vers storage public (via Supabase Storage),
- annonces (texte défilant) gérées par SuperAdmin,
- multilingue minimal (i18n).

Important : j’ai déjà injecté dans .env les valeurs Supabase que vous avez fournies. Vous pouvez modifier plus tard.

Quick start
1. Installer :
   - yarn ou npm install
2. Copier .env si besoin et ajuster les clés.
3. Lancer en dev :
   - yarn dev
4. Initialiser la base (voir fichier `supabase-migrations.sql`) dans Supabase SQL Editor pour créer les tables et bucket.

Notes de sécurité & déploiement
- Ne publiez jamais la clé service_role en public. Ici elle est mise pour que vous puissiez modifier plus tard.
- Avant mise en production configurez des politiques RLS côté Supabase et remplacez la clé service_role par une clé serveur côté API (serverless).
- Créez un compte SuperAdmin initial via le script SQL fourni (ligne `INSERT INTO profiles ... role='SUPERADMIN'`).

Structure principale
- src/
  - lib/supabaseClient.ts (initialisation Supabase)
  - pages: Home, Church detail, Admin (login/register/dashboard/add)
  - components: SearchFilter, Map, Header, Footer
- public/logo.svg













# Remplace SERVICE_ROLE_KEY par ta service role key (ne pas exposer cette clé publiquement)
export SERVICE_ROLE_KEY="wnrrvuqkgxbfedulwylb"

curl -sS -X POST "https://wnrrvuqkgxbfedulwylb.supabase.co/auth/v1/admin/users" \
  -H "Content-Type: application/json" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -d '{
    "email": "sylveretoka@gmail.com",
    "password": "sylveretoka@gmail.com",
    "email_confirm": true
  }'