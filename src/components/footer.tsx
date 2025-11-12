import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div className="mb-3 mb-md-0">
          <h5 className="mb-1" style={{ fontWeight: 800 }}>MalachieMaps</h5>
          <div className="small">Brazzaville, République du Congo</div>
          <div className="small">Tel: <a href="tel:+242069750376" className="text-light">+242069750376</a></div>
          <div className="small">Email: <a href="mailto:malachiemaps@gmail.com" className="text-light">malachiemaps@gmail.com</a></div>
        </div>

        <div className="d-flex align-items-center gap-3">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
             className="btn btn-outline-light btn-sm d-inline-flex align-items-center justify-content-center" aria-label="Facebook">
            <i className="bi bi-facebook" style={{ fontSize: 18 }}></i>
          </a>

          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
             className="btn btn-outline-light btn-sm d-inline-flex align-items-center justify-content-center" aria-label="Instagram">
            <i className="bi bi-instagram" style={{ fontSize: 18 }}></i>
          </a>

          <a href="https://wa.me/242069750376" target="_blank" rel="noopener noreferrer"
             className="btn btn-outline-light btn-sm d-inline-flex align-items-center justify-content-center" aria-label="WhatsApp">
            <i className="bi bi-whatsapp" style={{ fontSize: 18 }}></i>
          </a>
        </div>

        <div className="mt-3 mt-md-0 text-center text-md-end small">
          <a href="/privacy" className="text-light me-3">Privacy</a>
          <a href="/terms" className="text-light">Terms</a>
        </div>
      </div>
    </footer>
  );
}