import React, { useState } from "react";

export default function HelpFloating() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="fab-help" onClick={() => setOpen(true)} aria-label="Aide">
        <i className="fas fa-question-circle" style={{ fontSize: 18 }}></i>
        Comment ça marche
      </button>

      {open && (
        <div style={{
          position: 'fixed', right: 20, bottom: 80, width: 340, background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.12)', zIndex: 1100
        }}>
          <h4 style={{ margin: '0 0 8px' }}>Comment fonctionne MalachieMaps ?</h4>
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            <li>Rechercher une église par nom, pays, ville.</li>
            <li>Si elle n'existe pas, cliquez sur "Signaler une église" pour nous envoyer l'information.</li>
            <li>Les administrateurs valident les ajouts — après validation, l'église apparaîtra.</li>
          </ol>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setOpen(false)} style={{ background: '#eee', padding: '8px 10px', borderRadius: 8, border: 'none' }}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}