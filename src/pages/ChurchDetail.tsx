import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ChurchDetail() {
  const { id } = useParams();
  const [church, setChurch] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('churches').select('*').eq('id', id).single();
      if (error) console.error(error);
      else setChurch(data);
    })();
  }, [id]);

  if (!church) return <div style={{ padding: 20 }}>Chargement...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{church.name}</h2>
      <p>{church.city}, {church.country}</p>
      <p>{church.address_reference}</p>
      <p>{church.description}</p>
      <div>
        {(church.photos || []).map((p: string) => <img key={p} src={p} alt="" style={{ maxWidth: 200, marginRight: 8 }} />)}
      </div>
    </div>
  );
}