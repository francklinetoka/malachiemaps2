import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SuperAdminDashboard() {
  const [pendingAdmins, setPendingAdmins] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const res = await axios.get("/api/admin/pending"); // endpoint à implémenter
      setPendingAdmins(res.data || []);
    })();
  }, []);

  const approve = async (id: number, approve: boolean) => {
    await axios.post("/api/admin/approve-user", { userId: id, approve });
    setPendingAdmins(p => p.filter((u: any) => u.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>SuperAdmin - Gestion des administrateurs</h2>
      <div>
        <h3>Admins en attente</h3>
        {pendingAdmins.length === 0 && <div>Aucun admin en attente</div>}
        {pendingAdmins.map((a: any) => (
          <div key={a.id} style={{ border: "1px solid #eee", padding: 8, marginBottom: 8 }}>
            <div>{a.firstName} {a.lastName} - {a.email}</div>
            <button onClick={() => approve(a.id, true)} style={{ marginRight: 8 }}>Approuver</button>
            <button onClick={() => approve(a.id, false)}>Refuser / Bloquer</button>
          </div>
        ))}
      </div>
    </div>
  );
}