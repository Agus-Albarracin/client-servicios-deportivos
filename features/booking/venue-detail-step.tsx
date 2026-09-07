import { bookingApi } from "@/lib/api/client";
import { useResource } from "./use-resource";
import { safeExternalUrl } from "./format";
import { Button, Empty, Feedback } from "./ui";
export function VenueDetailStep({
  venueId,
  onContinue,
}: {
  venueId: string;
  onContinue: () => void;
}) {
  const venue = useResource(`venue:${venueId}`, (signal) =>
    bookingApi.venue(venueId, signal),
  );
  const mapUrl = venue.data
    ? safeExternalUrl(venue.data.mapUrl, "www.google.com")
    : undefined;
  return (
    <div className="space-y-6">
      <Feedback {...venue}>
        {venue.data?.isActive ? (
          <article className="space-y-5">
            <h3 className="text-xl font-semibold wrap-break-word">
              {venue.data.name}
            </h3>
            <p className="whitespace-pre-line text-muted wrap-break-word">
              {venue.data.description}
            </p>
            <div className="rounded-lg border border-line p-5">
              <h4 className="font-semibold">Ubicación</h4>
              <address className="mt-2 not-italic wrap-break-word">
                {venue.data.address}
              </address>
              {mapUrl ? (
                <a
                  className="mt-3 inline-flex min-h-12 items-center font-medium text-accent underline underline-offset-4"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en Google Maps (nueva pestaña)
                </a>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  El mapa no está disponible. Podés continuar con la dirección
                  indicada.
                </p>
              )}
            </div>
            <Button onClick={onContinue}>Ver disponibilidad</Button>
          </article>
        ) : (
          <Empty>
            Esta sede ya no está habilitada. Volvé al paso anterior para elegir
            otra.
          </Empty>
        )}
      </Feedback>
    </div>
  );
}
