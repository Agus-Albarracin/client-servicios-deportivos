import type {
  CalendarSettings,
  CalendarDay,
  BookingDraft,
  DraftInput,
  Slot,
  Sport,
  Venue,
  VenueDetail,
  WhatsAppPreview,
  Zone,
} from "./contracts";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const messages: Record<number, string> = {
  400: "Revisá los datos y la disponibilidad antes de continuar.",
  401: "No se pudo acceder a esta información. Intentá nuevamente más tarde.",
  403: "No se pudo conectar con el servicio desde esta página.",
  404: "La información solicitada ya no está disponible.",
  409: "La información cambió. Revisá tu selección e intentá nuevamente.",
  413: "Los datos enviados son demasiado extensos.",
  429: "Hiciste varias consultas seguidas. Esperá un momento y volvé a intentar.",
  503: "El servicio no está disponible. Tus datos siguen en esta pantalla; intentá nuevamente.",
};

export function createBookingApi(baseUrl: string) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = new URL(`${baseUrl.replace(/\/$/, "")}${path}`);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      throw new ApiError(0, "No se pudo conectar con el servicio.");
    }
    let response: Response;
    try {
      const timeout = AbortSignal.timeout(15_000);
      response = await fetch(url, {
        ...init,
        cache: "no-store",
        credentials: "omit",
        headers: {
          Accept: "application/json",
          ...(init.body ? { "Content-Type": "application/json" } : {}),
        },
        signal: init.signal ? AbortSignal.any([init.signal, timeout]) : timeout,
      });
    } catch {
      if (init.signal?.aborted) throw new DOMException("Aborted", "AbortError");
      throw new ApiError(
        0,
        "No pudimos conectar. Revisá tu conexión y volvé a intentar.",
      );
    }
    const body: unknown =
      response.status === 204
        ? undefined
        : await response.json().catch(() => undefined);
    if (!response.ok) {
      const detail =
        body && typeof body === "object" && "message" in body
          ? body.message
          : undefined;
      const validation = Array.isArray(detail)
        ? detail
            .filter((item): item is string => typeof item === "string")
            .join(" ")
        : typeof detail === "string"
          ? detail
          : undefined;
      throw new ApiError(
        response.status,
        (response.status === 400 && validation) ||
          messages[response.status] ||
          "No pudimos completar la consulta. Volvé a intentar.",
      );
    }
    if (body === undefined && response.status !== 204) {
      throw new ApiError(
        0,
        "La respuesta del servicio no es válida. Volvé a intentar.",
      );
    }
    return body as T;
  }

  return {
    calendarSettings: (signal?: AbortSignal) => request<CalendarSettings>("/scheduling/settings", { signal }),
    calendarMonth: (venueId: string, sportId: string, month: string, signal?: AbortSignal) => request<CalendarDay[]>(
      '/scheduling/month?' + new URLSearchParams({ venueId, sportId, month }), { signal }),
    sports: (signal?: AbortSignal) => request<Sport[]>("/sports", { signal }),
    zones: (signal?: AbortSignal) => request<Zone[]>("/zones", { signal }),
    venues: (zoneId: string, sportId: string, signal?: AbortSignal) =>
      request<Venue[]>(`/venues?${new URLSearchParams({ zoneId, sportId })}`, {
        signal,
      }),
    venue: (id: string, signal?: AbortSignal) =>
      request<VenueDetail>(`/venues/${encodeURIComponent(id)}`, { signal }),
    slots: (
      venueId: string,
      sportId: string,
      date: string,
      signal?: AbortSignal,
    ) =>
      request<Slot[]>(
        `/scheduling/day?${new URLSearchParams({ venueId, sportId, date })}`,
        { signal },
      ),
    create: (sportId: string) =>
      request<BookingDraft>("/booking-drafts", {
        method: "POST",
        body: JSON.stringify({ sportId }),
      }),
    update: (id: string, input: DraftInput) =>
      request<BookingDraft>(`/booking-drafts/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(input),
      }),
    preview: (id: string) =>
      request<WhatsAppPreview>(
        `/booking-drafts/${encodeURIComponent(id)}/whatsapp`,
        { method: "POST" },
      ),
  };
}

export const bookingApi = createBookingApi(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api",
);
