
import React from "react";

export default function ChurchCard({ church }: { church: any }) {
  const photos: string[] = church.photos || [];
  // ensure at least 3 placeholders
  const placeholders = Array.from({ length: Math.max(0, 3 - photos.length) });

  // recent = within 3 days
  const createdAt = new Date(church.created_at);
  const isRecent = (Date.now() - createdAt.getTime()) <= (3 * 24 * 3600 * 1000);

  return (
    <article className="church-card">
      <div className="card-media">
        {photos.slice(0,3).map((p, i) => (
          <img key={i} src={p} alt={`${church.name} photo ${i+1}`} />
        ))}
        {placeholders.map((_, i) => <div key={`ph-${i}`} style={{borderRadius:8,background:'#f7f0ea'}} />)}
      </div>
      <div className="card-body">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">{church.name}</h3>
          {isRecent && <div className="badge-recent">Nouveau</div>}
        </div>
        <div className="card-meta">{church.city}, {church.country}</div>
        <p className="card-desc">{church.address_reference}</p>
        <div className="card-actions">
          <a className="link" href={`/church/${church.id}`}>Voir</a>
        </div>
      </div>
    </article>
  );
}