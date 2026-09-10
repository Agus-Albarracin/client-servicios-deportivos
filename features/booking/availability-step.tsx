import { CalendarPicker } from "./calendar-picker";
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
  const [month, setMonth] = useState((draft.date && draft.date >= today ? draft.date : today).slice(0, 7));
  const settings = useResource('calendar-settings:' + revision, signal => bookingApi.calendarSettings(signal));
  const [view, setView] = useState<'list' | 'calendar' | null>(null);
  const mode = view ?? (settings.data?.calendarEnabled ? 'calendar' : 'list');
  const [availabilityRevision, setAvailabilityRevision] = useState(0);
  const calendar = useResource(mode === 'calendar' ? 'calendar:' + draft.venueId + ':' + draft.sportId + ':' + month + ':' + revision + ':' + availabilityRevision : null,
    signal => bookingApi.calendarMonth(draft.venueId!, draft.sportId, month, signal));
  useEffect(() => {
    const refresh = () => { if (document.visibilityState === 'visible') setAvailabilityRevision(value => value + 1); };
    const timer = window.setInterval(refresh, 30_000);
    window.addEventListener('focus', refresh);
    return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, []);
  const [slotId, setSlotId] = useState(draft.slotId ?? "");
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today;
  const slots = useResource(
    validDate
      ? `slots:${draft.venueId}:${draft.sportId}:${date}:${revision}:${availabilityRevision}`
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
  const reserved = slots.data?.filter(slot => slot.status === 'RESERVED' && slot.venueId === draft.venueId && slot.sportId === draft.sportId) ?? [];
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
        Horarios de Buenos Aires. Elegí uno disponible: el administrador debe confirmar tu solicitud para reservarlo.
      </p>
      <div className="flex flex-wrap gap-3" aria-label="Vista de turnos">
        <Button type="button" variant={mode === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>Lista de horarios</Button>
        <Button type="button" variant={mode === 'calendar' ? 'primary' : 'secondary'} onClick={() => setView('calendar')}>Calendario</Button>
      </div>
      {settings.error && <p role="status" className="text-sm text-muted">No se pudo cargar la vista predeterminada. Podés seguir en lista o elegir calendario. <button type="button" onClick={settings.retry}>Reintentar configuración</button></p>}
      {mode === 'calendar' ? <Feedback {...calendar}><CalendarPicker date={date} month={month} onMonth={setMonth} onDate={value => { setDate(value); setSlotId(''); }} days={calendar.data ?? []} loading={calendar.loading} /></Feedback> : <div>
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
      </div>}
      <p className="slot-legend"><span>● Disponible para solicitar</span><span className="reserved-key">● Reservado · no seleccionable</span></p>
      {validDate ? (
        <Feedback {...slots}><div className="space-y-4">
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
          {reserved.length > 0 && <section aria-label="Horarios reservados"><h3 className="mb-3 font-semibold">Horarios reservados</h3><div className="grid gap-3 sm:grid-cols-2">{reserved.map(slot => <div className="reserved-slot" key={slot.id}><span>{formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}</span><strong>Reservado</strong></div>)}</div></section>}
          </div></Feedback>
      ) : null}
      {options.some(slot => slot.id === slotId) && <p className="selected-slot-note">Horario elegido: <strong>{formatTime(options.find(slot => slot.id === slotId)!.startsAt)} – {formatTime(options.find(slot => slot.id === slotId)!.endsAt)}</strong>. Continuá para revisar tu solicitud.</p>}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={!options.some((slot) => slot.id === slotId)}
        >
          Continuar con mis datos
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!validDate || slots.loading}
          onClick={() => {
            setSlotId("");
            setAvailabilityRevision(value => value + 1);
          }}
        >
          Actualizar horarios
        </Button>
      </div>
    </form>
  );
}
