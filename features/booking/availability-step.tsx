import { useEffect, useState } from "react";
import { bookingApi } from "@/lib/api/client";
import type { BookingDraft } from "@/lib/api/contracts";
import { useResource } from "./use-resource";
import { formatTime, todayInBuenosAires } from "./format";
import { Button, Choice, Empty, Feedback, inputClass } from "./ui";
export function AvailabilityStep({
  draft,
  onContinue,
  revision,
}: {
  draft: BookingDraft;
  onContinue: (date: string, slotId: string) => void;
  revision: number;
}) {
  const [today] = useState(todayInBuenosAires);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);
  const [date, setDate] = useState(
    draft.date && draft.date >= today ? draft.date : today,
  );
  const [slotId, setSlotId] = useState(draft.slotId ?? "");
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today;
  const slots = useResource(
    validDate
      ? `slots:${draft.venueId}:${draft.sportId}:${date}:${revision}`
      : null,
    (signal) => bookingApi.slots(draft.venueId!, draft.sportId, date, signal),
  );
  const options =
    slots.data?.filter(
      (slot) =>
        slot.status === "AVAILABLE" &&
        slot.venueId === draft.venueId &&
        slot.sportId === draft.sportId &&
        Date.parse(slot.startsAt) > now,
    ) ?? [];
  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (options.some((slot) => slot.id === slotId))
          onContinue(date, slotId);
      }}
    >
      <p className="text-muted">
        Los horarios se muestran en hora de Buenos Aires. La sede confirma la
        reserva por WhatsApp.
      </p>
      <div>
        <label htmlFor="date" className="mb-2 block font-medium">
          Fecha
        </label>
        <input
          type="date"
          id="date"
          min={today}
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setSlotId("");
          }}
          className={inputClass}
          aria-describedby="date-help"
        />
        <p id="date-help" className="mt-2 text-sm text-muted">
          Elegí hoy o una fecha futura para consultar horarios.
        </p>
      </div>
      {validDate ? (
        <Feedback {...slots}>
          {options.length ? (
            <fieldset>
              <legend className="mb-3 font-semibold">
                Horarios disponibles
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {options.map((slot) => (
                  <Choice
                    key={slot.id}
                    name="slot"
                    value={slot.id}
                    checked={slotId === slot.id}
                    onChange={() => setSlotId(slot.id)}
                  >
                    {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
                  </Choice>
                ))}
              </div>
            </fieldset>
          ) : (
            <Empty>
              No hay turnos disponibles para esta fecha. Probá con otro día.
            </Empty>
          )}
        </Feedback>
      ) : null}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={!options.some((slot) => slot.id === slotId)}
        >
          Revisar solicitud
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!validDate || slots.loading}
          onClick={() => {
            setSlotId("");
            slots.retry();
          }}
        >
          Actualizar horarios
        </Button>
      </div>
    </form>
  );
}
