import type { WhatsAppPreview } from "@/lib/api/contracts";
import { formatDate, formatTime, safeExternalUrl } from "./format";
import { Button, primaryLink } from "./ui";
export function ReviewStep({
  preview,
  ready,
  onPrepare,
}: {
  preview: WhatsAppPreview | null;
  ready: boolean;
  onPrepare: () => void;
}) {
  if (!preview)
    return (
      <div className="space-y-5">
        <p>
          Revisaremos los datos y la disponibilidad actual antes de preparar tu
          mensaje.
        </p>
        <Button onClick={onPrepare}>Preparar resumen</Button>
      </div>
    );
  const { summary } = preview;
  const url = safeExternalUrl(preview.url, "wa.me");
  const rows = [
    ["Deporte", summary.sport.name],
    ["Sede", summary.venue.name],
    ["Dirección", summary.venue.address],
    ["Fecha", formatDate(summary.slot.startsAt)],
    [
      "Horario",
      `${formatTime(summary.slot.startsAt)} – ${formatTime(summary.slot.endsAt)}`,
    ],
    ["Solicitante", `${summary.renterFirstName} ${summary.renterLastName}`],
    ["Teléfono", summary.renterPhone],
  ];
  return (
    <div className="space-y-6">
      <p className="rounded-lg bg-accent-soft p-4 text-accent-strong">
        <strong className="block">Pendiente de confirmación</strong>
        {preview.notice}
      </p>
      <dl className="divide-y divide-line">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
            <dt className="text-muted">{label}</dt>
            <dd className="font-medium wrap-break-word sm:col-span-2">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      <details className="rounded-lg border border-line p-4">
        <summary className="cursor-pointer font-medium">
          Ver mensaje completo
        </summary>
        <p className="mt-4 whitespace-pre-wrap text-sm wrap-break-word">
          {preview.message}
        </p>
      </details>
      {ready && url ? (
        <div className="space-y-3">
          <a
            className={primaryLink}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            Gestionar por WhatsApp
          </a>
          <p className="text-sm text-muted">
            Se abre en otra pestaña. Enviá el mensaje desde WhatsApp; abrirlo no
            confirma tu reserva.
          </p>
        </div>
      ) : (
        <Button onClick={onPrepare}>
          Verificar disponibilidad y preparar WhatsApp
        </Button>
      )}
    </div>
  );
}
