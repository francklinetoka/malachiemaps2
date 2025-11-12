/**
 * Script Node.js à exécuter localement pour créer un SuperAdmin (Auth user + profile)
 * Usage:
 *   node create_superadmin.js
 *
 * IMPORTANT: This script requires VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in your environment (.env).
 *            It uses the service role key to create a user directly (admin operation).
 *
 * Default credentials created by this script:
 *   email: superadmin@malachiemaps.org
 *   password: Malachie@2025!
 *
 * After running, you can login with these credentials on /admin/login.
 */










const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

async function main() {
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
    console.error("Veuillez définir VITE_SUPABASE_URL et VITE_SUPABASE_SERVICE_ROLE_KEY dans .env");
    process.exit(1);
  }

  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

  const email = "superadmin@malachiemaps.org";
  const password = "Malachie@2025!";

  // Create auth user with admin privileges (service role)
  const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "SUPERADMIN" },
  });

  if (userError) {
    console.error("Erreur création auth user:", userError);
    process.exit(1);
  }

  console.log("Auth user créé:", user.user.id);

  // Create profile in profiles table
  const { error: profileError } = await supabaseAdmin.from("profiles").insert([
    {
      auth_id: user.user.id,
      first_name: "Super",
      last_name: "Admin",
      email,
      phone: null,
      country: "République du Congo",
      role: "SUPERADMIN",
      is_approved: true,
    },
  ]);

  if (profileError) {
    console.error("Erreur création profil:", profileError);
    process.exit(1);
  }

  console.log("Profil SuperAdmin créé avec succès.");
  console.log("Identifiants:");
  console.log("  email:", email);
  console.log("  password:", password);
  console.log("Connectez-vous sur /admin/login avec ces identifiants.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});