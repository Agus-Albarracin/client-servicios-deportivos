import type { Venue } from "@/lib/api/contracts";

export function VenueMap({ venue }: { venue: Venue }) {
  const { latitude, longitude } = venue;
  const valid = Number.isFinite(latitude) && Number.isFinite(longitude)
    && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180;
  if (!valid) return <p className="text-sm text-muted">La ubicación en el mapa no está disponible. Podés continuar con la dirección indicada.</p>;
  const params = new URLSearchParams({
    bbox: [Math.max(-180, longitude - 0.01), Math.max(-90, latitude - 0.006),
      Math.min(180, longitude + 0.01), Math.min(90, latitude + 0.006)].join(","),
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  });
  return (
    <iframe
      title={`Mapa de ${venue.name}`}
      src={`https://www.openstreetmap.org/export/embed.html?${params}`}
      width="100%"
      height="280"
      loading="lazy"
      referrerPolicy="no-referrer"
      className="block w-full rounded-lg border border-line"
    />
  );
}
