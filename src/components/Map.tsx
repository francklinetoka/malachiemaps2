import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default as any).prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png"
});

export default function Map({ markers = [] }: { markers: any[] }) {
  const center: [number, number] = markers.length ? [markers[0].lat || 0, markers[0].lng || 0] : [-4.2634, 15.2832];
  return (
    <MapContainer center={center} zoom={5} style={{ height: "500px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((m: any) => (
        m.lat && m.lng && (
          <Marker key={m.id} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.name}</strong><br />
              {m.city}, {m.country}
            </Popup>
          </Marker>
        )
      ))}
    </MapContainer>
  );
}