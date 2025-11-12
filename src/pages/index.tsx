import React, { useState } from "react";
import SearchFilter from "@/components/SearchFilter";
import Map from "@/components/Map";
import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function Home() {
  const [churches, setChurches] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const doSearch = async (filters: any) => {
    const params = new URLSearchParams();
    if (filters.name) params.append("name", filters.name);
    if (filters.country) params.append("country", filters.country);
    if (filters.city) params.append("city", filters.city);
    if (filters.province) params.append("province", filters.province);
    if (filters.neighborhood) params.append("neighborhood", filters.neighborhood);
    const res = await axios.get("/api/churches?" + params.toString());
    setChurches(res.data.items);
    setTotal(res.data.total);
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
     

      <div style={{ background: "#f6f6f6", padding: 8 }}>
        <marquee>Message défilant (à gérer depuis SuperAdmin)</marquee>
      </div>

      <div style={{ padding: 20, display: "grid", gridTemplateColumns: "1fr 700px", gap: 20 }}>
        <div>
          <SearchFilter onSearch={doSearch} />
          <div style={{ marginTop: 12 }}>
            <strong>{total}</strong> églises trouvées
            <div style={{ marginTop: 12 }}>
              {churches.map(c => (
                <div key={c.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 6, marginBottom: 8 }}>
                  <h3 style={{ margin: 0 }}>{c.name}</h3>
                  <p style={{ margin: 0 }}>{c.city}, {c.country}</p>
                  <p style={{ marginTop: 8 }}>{c.addressReference}</p>
                  <a href={`/church/${c.id}`}>Voir</a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Map markers={churches.filter(c => c.lat && c.lng)} />
        </div>
      </div>

      
    </div>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"]))
    }
  };
}