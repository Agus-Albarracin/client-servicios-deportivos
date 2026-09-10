import { VenueMap } from "./venue-map";
import { useState } from "react";
import { bookingApi } from "@/lib/api/client";
import type { BookingDraft } from "@/lib/api/contracts";
import { useResource } from "./use-resource";
import { zoneLabels } from "./format";
import { Button, Choice, Empty, Feedback, inputClass } from "./ui";
export function VenueStep({
  draft,
  onContinue,
}: {
  draft: BookingDraft;
  onContinue: (zoneId: string, venueId: string) => void;
}) {
  const [zoneId, setZoneId] = useState(draft.zoneId ?? "");
  const [venueId, setVenueId] = useState(draft.venueId ?? "");
  const zones = useResource("zones", bookingApi.zones);
  const venues = useResource(
    zoneId ? `venues:${zoneId}:${draft.sportId}` : null,
    (signal) => bookingApi.venues(zoneId, draft.sportId, signal),
  );
  const options =
    venues.data?.filter((venue) => venue.isActive && venue.zoneId === zoneId) ??
    [];
  const selectedVenue = options.find((venue) => venue.id === venueId);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (options.some((venue) => venue.id === venueId))
          onContinue(zoneId, venueId);
      }}
      className="space-y-6"
    >
      <p className="text-muted">
        Primero elegí la zona. Vas a ver las sedes que ofrecen tu deporte.
      </p>
      <Feedback {...zones}>
        {zones.data?.length ? (
          <div>
            <label htmlFor="zone" className="mb-2 block font-medium">
              Zona
            </label>
            <select
              id="zone"
              className={inputClass}
              value={zoneId}
              onChange={(event) => {
                setZoneId(event.target.value);
                setVenueId("");
              }}
            >
              <option value="">Elegí una zona</option>
              {zones.data.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zoneLabels[zone.name]}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Empty>
            Todavía no hay zonas habilitadas. Volvé a consultar más tarde.
          </Empty>
        )}
      </Feedback>
      {zoneId ? (
        <Feedback {...venues}>
          {options.length ? (
            <fieldset>
              <legend className="mb-3 font-semibold">Sedes disponibles</legend>
              <div className="grid gap-3">
                {options.map((venue) => (
                  <Choice
                    key={venue.id}
                    name="venue"
                    value={venue.id}
                    checked={venueId === venue.id}
                    onChange={() => setVenueId(venue.id)}
                  >
                    <span className="block font-semibold">{venue.name}</span>
                    <span className="mt-1 block text-sm text-muted">
                      {venue.address}
                    </span>
                  </Choice>
                ))}
              </div>
            </fieldset>
          ) : (
            <Empty>
              No hay sedes disponibles para este deporte en esta zona. Probá con
              otra zona.
            </Empty>
          )}
        </Feedback>
      ) : null}
      {selectedVenue ? (
        <div className="space-y-3">
          <p className="text-muted">{selectedVenue.description}</p>
          <VenueMap venue={selectedVenue} />
        </div>
      ) : null}
      <Button
        type="submit"
        disabled={
          !options.some((venue) => venue.id === venueId) ||
          !zones.data?.some((zone) => zone.id === zoneId)
        }
      >
        Ver disponibilidad
      </Button>
    </form>
  );
}
