import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <img src="/logo.svg" alt="MalachieMaps" style={{ height: 56 }} />
        <div>
          <h2 style={{ margin: 0 }}>MalachieMaps</h2>
          <small>Retrouve les églises du message</small>
        </div>
      </div>
      <nav>
        <Link to="/admin/login">Administration</Link>
      </nav>
    </header>
  );
}