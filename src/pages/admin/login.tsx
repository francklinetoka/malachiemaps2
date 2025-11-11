import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handle = async (e: any) => {
    e.preventDefault();
    const res = await signIn("credentials", { redirect: false, email, password });
    if (res && res.ok) {
      router.push("/admin/dashboard");
    } else {
      alert("Identifiants invalides ou compte non approuvé");
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", padding: 20, background: "#fff", borderRadius: 8 }}>
      <h2>Connexion administrateur</h2>
      <form onSubmit={handle}>
        <div><input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div style={{ marginTop: 8 }}><input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} /></div>
        <div style={{ marginTop: 12 }}>
          <button type="submit" style={{ background: "#7A4B2A", color: "#fff", padding: "8px 12px", border: "none", borderRadius: 6 }}>Se connecter</button>
        </div>
      </form>
      <div style={{ marginTop: 12 }}>
        Mot de passe oublié ? Contacter le support.
      </div>
    </div>
  );
}