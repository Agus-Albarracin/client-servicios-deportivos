"use client";
import { useEffect, useRef, useState } from "react";
import { ApiError, bookingApi } from "@/lib/api/client";
import type {
  BookingDraft,
  Contact,
  DraftInput,
  WhatsAppPreview,
} from "@/lib/api/contracts";
import { SportStep } from "./sport-step";
import { ContactStep } from "./contact-step";
import { VenueStep } from "./venue-step";
import { VenueDetailStep } from "./venue-detail-step";
import { AvailabilityStep } from "./availability-step";
import { ReviewStep } from "./review-step";
import { Button } from "./ui";
const steps = [
  "Deporte",
  "Tus datos",
  "Zona y sede",
  "Detalle de sede",
  "Fecha y horario",
  "Resumen y WhatsApp",
];
const titles = [
  "¿Qué querés jugar?",
  "¿A nombre de quién?",
  "¿Dónde querés jugar?",
  "Conocé la sede",
  "Elegí tu turno",
  "Revisá tu solicitud",
];
const emptyContact: Contact = {
  renterFirstName: "",
  renterLastName: "",
  renterPhone: "+54",
};
export function BookingFlow() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [contact, setContact] = useState<Contact>(emptyContact);
  const [preview, setPreview] = useState<WhatsAppPreview | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [missing, setMissing] = useState(false);
  const [revision, setRevision] = useState(0);
  const busy = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [step]);
  useEffect(() => {
    const invalidate = () => {
      if (document.visibilityState !== "visible") setReady(false);
    };
    document.addEventListener("visibilitychange", invalidate);
    return () => document.removeEventListener("visibilitychange", invalidate);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const timeout = window.setTimeout(() => setReady(false), 60_000);
    return () => window.clearTimeout(timeout);
  }, [ready, preview]);
  async function run(action: () => Promise<void>) {
    if (busy.current) return;
    busy.current = true;
    setPending(true);
    setError("");
    setReady(false);
    try {
      await action();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No pudimos guardar los cambios. Volvé a intentar.",
      );
      setRevision((value) => value + 1);
      setMissing(cause instanceof ApiError && cause.status === 404);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  function save(input: DraftInput, next: number) {
    void run(async () => {
      const updated = draft
        ? await bookingApi.update(draft.id, input)
        : await bookingApi.create(input.sportId!);
      setDraft(updated); // Replace: omitted fields were invalidated by the server.
      setPreview(null);
      setMissing(false);
      setStep(next);
    });
  }
  function prepare() {
    if (!draft) return;
    void run(async () => {
      setPreview(null);
      const response = await bookingApi.preview(draft.id);
      setPreview(response);
      setReady(true);
    });
  }
  function backTo(target: number) {
    if (busy.current || target >= step) return;
    setReady(false);
    setPreview(null);
    setError("");
    setStep(target);
  }
  return (
    <div className="booking-layout">
      <nav aria-label="Pasos de la solicitud" className="booking-navigation"><p className="booking-nav-title">ARMÁ TU PRÓXIMO PARTIDO</p>
        <ol className="booking-progress">
          {steps.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                aria-current={step === index ? "step" : undefined}
                disabled={index >= step || pending}
                onClick={() => backTo(index)}
                className={index < step ? "completed-step" : undefined}
              >
                <span
                  aria-hidden="true"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-xs"
                >
                  {index < step ? "✓" : index + 1}
                </span>
                {label}
              </button>
            </li>
          ))}
        </ol><div className="booking-help"><strong>¿Cuándo queda reservado?</strong><p>Al elegir un horario creás una solicitud. La sede revisa tus datos y confirma el turno. Vas a poder coordinar por WhatsApp.</p></div>
      </nav>
      <section
        aria-labelledby="step-title"
        className="booking-panel"
      >
        <p className="step-progress"><progress aria-label="Progreso de la solicitud" max={steps.length} value={step + 1} />
          Paso {step + 1} de {steps.length}
        </p>
        <h2
          id="step-title"
          ref={heading}
          tabIndex={-1}
          className="mb-6 text-2xl font-semibold tracking-tight"
        >
          {titles[step]}
        </h2>
        {error ? (
          <div
            role="alert"
            className="mb-5 space-y-3 rounded-lg border border-danger p-4"
          >
            <p>{error}</p>
            {step === 5 ? (
              <Button
                variant="secondary"
                disabled={pending}
                onClick={() => backTo(4)}
              >
                Volver a elegir horario
              </Button>
            ) : null}
            {missing ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setDraft(null);
                  setPreview(null);
                  setReady(false);
                  setMissing(false);
                  setError("");
                  setStep(0);
                }}
              >
                Iniciar otra solicitud conservando mis datos
              </Button>
            ) : null}
          </div>
        ) : null}
        <fieldset disabled={pending} aria-busy={pending} className="min-w-0">
          <legend className="sr-only">{titles[step]}</legend>
          {step === 0 ? (
            <SportStep
              selected={draft?.sportId}
              onContinue={(sportId) => save({ sportId }, 1)}
            />
          ) : null}
          {step === 1 ? (
            <ContactStep
              contact={contact}
              onChange={setContact}
              onContinue={(input) => save(input, 2)}
            />
          ) : null}
          {step === 2 && draft ? (
            <VenueStep
              draft={draft}
              onContinue={(zoneId, venueId) => save({ zoneId, venueId }, 3)}
            />
          ) : null}
          {step === 3 && draft?.venueId ? (
            <VenueDetailStep
              venueId={draft.venueId}
              onContinue={() => setStep(4)}
            />
          ) : null}
          {step === 4 && draft ? (
            <AvailabilityStep
              draft={draft}
              revision={revision}
              onContinue={(date, slotId) => save({ date, slotId }, 5)}
            />
          ) : null}
          {step === 5 ? (
            <ReviewStep
              preview={preview}
              ready={ready && !pending}
              onPrepare={prepare}
            />
          ) : null}
        </fieldset>
        <p
          role="status"
          aria-live="polite"
          className="mt-4 min-h-6 text-sm text-muted"
        >
          {pending ? "Guardando y verificando tu solicitud…" : ""}
        </p>
        {step > 0 ? (
          <div className="mt-4 border-t border-line pt-5">
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => backTo(step - 1)}
            >
              Volver
            </Button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
