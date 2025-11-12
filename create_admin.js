// create_admin.js
// Usage: node create_admin.js email firstName lastName country password
// Requires VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in env (.env)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function main() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Définir VITE_SUPABASE_URL et VITE_SUPABASE_SERVICE_ROLE_KEY dans .env');
    process.exit(1);
  }
  const supabaseAdmin = createClient(url, key);

  const [email, first_name, last_name, country, password] = process.argv.slice(2);
  if (!email || !first_name || !last_name || !country || !password) {
    console.error('Usage: node create_admin.js email firstName lastName country password');
    process.exit(1);
  }

  // 1) create auth user
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (userError) {
    console.error('Erreur création auth user:', userError);
    process.exit(1);
  }
  const authId = userData.user.id;
  console.log('Auth user créé :', authId);

  // 2) upsert profile
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert([{
    auth_id: authId,
    first_name,
    last_name,
    email,
    country,
    role: 'SUPERADMIN',
    is_approved: true,
    is_blocked: false
  }], { onConflict: ['email'] });

  if (profileError) {
    console.error('Erreur upsert profile:', profileError);
    process.exit(1);
  }
  console.log('Profile créé / mis à jour pour', email);
  console.log('Identifiants :', email, '/', password);
}
main();