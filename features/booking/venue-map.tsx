import { useState } from "react";
import type { Venue } from "@/lib/api/contracts";

function mapUrl(venue: Venue) {
  const { latitude, longitude } = venue;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
    || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  const params = new URLSearchParams({
    q: `${latitude},${longitude}`, z: "15", t: "m", hl: "es", output: "embed",
  });
  return `https://maps.google.com/maps?${params}`;
}

/** Keep a bounded set of iframe documents alive; never cache booking availability. */
export function VenueMap({ venue }: { venue?: Venue }) {
  const url = venue ? mapUrl(venue) : null;
  const [maps, setMaps] = useState<{ url: string; name: string }[]>([]);
  if (url && venue && !maps.some((map) => map.url === url)) {
    setMaps([...maps.slice(-2), { url, name: venue.name }]);
  }
  return (
    <>
      {venue && !url ? (
        <p className="text-sm text-muted">
          La ubicación en el mapa no está disponible. Podés continuar con la dirección indicada.
        </p>
      ) : null}
      {maps.map((map) => (
        <div key={map.url} hidden={map.url !== url}>
          <iframe
            title={`Mapa de ${map.url === url && venue ? venue.name : map.name}`}
            src={map.url}
            width="100%"
            height="280"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block w-full rounded-lg border border-line"
          />
        </div>
      ))}
    </>
  );
}
