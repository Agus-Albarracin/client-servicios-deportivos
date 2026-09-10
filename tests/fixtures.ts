import type { Page } from "@playwright/test";
import type { BookingDraft, Slot, Venue } from "../lib/api/contracts";

const id = (value: number) =>
  `00000000-0000-4000-8000-${String(value).padStart(12, "0")}`;
export const sports = [
  { id: id(1), name: "Fútbol", icon: "⚽", isActive: true },
  { id: id(2), name: "Tenis", icon: "🎾", isActive: true },
];
export const zones = [
  { id: id(3), name: "CABA" },
  { id: id(4), name: "SUR" },
  { id: id(5), name: "NORTE" },
];
export const venue: Venue = {
  id: id(6),
  name: "Polideportivo de prueba",
  zoneId: zones[0].id,
  address: "Avenida de prueba 123, Buenos Aires",
  latitude: -34.6,
  longitude: -58.4,
  description: "Sede de prueba para verificar el recorrido del turnero.",
  whatsappNumber: "+5491100000000",
  isActive: true,
};
export const date = "2099-01-01";
export const slot: Slot = {
  id: id(7),
  venueId: venue.id,
  sportId: sports[0].id,
  startsAt: `${date}T21:00:00.000Z`,
  endsAt: `${date}T22:00:00.000Z`,
  status: "AVAILABLE",
};

// Explicit HTTP fixtures only for tests. Production never falls back to these catalogs.
export async function mockApi(page: Page) {
  await page.route("https://maps.google.com/maps?**", (route) =>
    route.fulfill({ contentType: "text/html", body: "<p>Mapa de prueba</p>" }));
  const state = {
    draft: null as BookingDraft | null,
    patches: [] as Record<string, string>[],
    creates: 0,
    previews: 0,
    calendarEnabled: false,
    unavailable: false,
    reserved: false,
    failContact: false,
    failSports: false,
    emptySports: false,
    slowZone: false,
  };
  await page.route("http://localhost:4000/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace("/api", "");
    const reply = (json: unknown, status = 200) =>
      route.fulfill({
        status,
        json,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store",
        },
      });
    if (request.method() === "OPTIONS")
      return route.fulfill({
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    if (path === '/scheduling/settings') return reply({ calendarEnabled: state.calendarEnabled });
    if (path === '/scheduling/month') return reply([{ date, availableCount: state.unavailable || state.reserved ? 0 : 1, reservedCount: state.reserved ? 1 : 0, blocked: state.unavailable }]);
    if (path === "/sports")
      return state.failSports
        ? reply({ message: "Unavailable" }, 503)
        : reply(state.emptySports ? [] : sports);
    if (path === "/zones") return reply(zones);
    if (path === "/venues") {
      if (url.searchParams.get("zoneId") === zones[1].id && state.slowZone)
        await new Promise((resolve) => setTimeout(resolve, 350));
      return reply(
        url.searchParams.get("zoneId") === zones[0].id ? [venue] : [],
      );
    }
    if (path === `/venues/${venue.id}`)
      return reply({
        ...venue,
        mapUrl: "https://www.google.com/maps/search/?api=1&query=-34.6,-58.4",
      });
    if (path === "/scheduling/day" && state.reserved) return reply(url.searchParams.get("date") === date ? [{ ...slot, status: "RESERVED" }] : []);
    if (path === "/slots" || path === "/scheduling/day")
      return reply(
        url.searchParams.get("date") === date && !state.unavailable
          ? [
              { ...slot, sportId: url.searchParams.get("sportId") },
              { ...slot, id: id(9), status: "UNAVAILABLE" },
            ]
          : [],
      );
    if (path === "/booking-drafts" && request.method() === "POST") {
      state.creates++;
      state.draft = { id: id(8), sportId: request.postDataJSON().sportId };
      return reply(state.draft, 201);
    }
    if (path.endsWith("/whatsapp")) {
      state.previews++;
      if (state.unavailable)
        return reply(
          {
            message:
              "El turno no está disponible o no corresponde a la selección",
          },
          400,
        );
      const contact = {
        renterFirstName: state.draft!.renterFirstName,
        renterLastName: state.draft!.renterLastName,
        renterPhone: state.draft!.renterPhone,
      };
      const message = `Hola, quiero consultar por este turno:\nDeporte: Fútbol\nSede: ${venue.name}\nDirección: ${venue.address}\nFecha: 01/01/2099\nHorario: 18:00–19:00\nSolicitante: ${contact.renterFirstName} ${contact.renterLastName}\nTeléfono: ${contact.renterPhone}`;
      return reply({
        status: "PENDING_CONFIRMATION",
        label: "Gestionar por WhatsApp",
        notice: "La reserva queda pendiente de confirmación por la sede.",
        summary: {
          sport: sports.find((sport) => sport.id === state.draft!.sportId),
          venue,
          slot,
          ...contact,
        },
        message,
        url: `https://wa.me/5491100000000?text=${encodeURIComponent(message)}`,
      });
    }
    if (path.startsWith("/booking-drafts/") && request.method() === "PATCH") {
      const patch = request.postDataJSON();
      state.patches.push(patch);
      if (state.failContact && patch.renterFirstName)
        return reply({ message: "Unavailable" }, 503);
      if (state.unavailable && (patch.slotId || state.draft?.slotId))
        return reply({ message: "El turno no está disponible" }, 400);
      const previous = state.draft!;
      const next = { ...previous, ...patch };
      if (
        ["sportId", "zoneId", "venueId", "date"].some(
          (key) =>
            key in patch && patch[key] !== previous[key as keyof BookingDraft],
        ) &&
        !patch.slotId
      )
        delete next.slotId;
      if (patch.sportId && patch.sportId !== previous.sportId && !patch.venueId)
        delete next.venueId;
      state.draft = next;
      return reply(next);
    }
    return reply({ message: "Not found" }, 404);
  });
  return state;
}

export async function toVenues(page: Page) {
  await page.goto("/");
  await page.getByRole("radio", { name: "Fútbol" }).check();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
}
export async function toAvailability(page: Page) {
  await toVenues(page);
  await page.getByLabel("Zona", { exact: true }).selectOption(zones[0].id);
  await page.getByRole("radio", { name: /Polideportivo de prueba/ }).check();
  await page.getByRole("button", { name: "Ver disponibilidad" }).click();
  await page.getByLabel("Fecha", { exact: true }).fill(date);
}
export async function toContact(page: Page) {
  await toAvailability(page);
  await page.getByRole("radio", { name: "18:00 – 19:00" }).check();
  await page.getByRole("button", { name: "Continuar con mis datos" }).click();
}
export async function fillContact(page: Page) {
  await page.getByLabel("Nombre", { exact: true }).fill("Ana");
  await page.getByLabel("Apellido", { exact: true }).fill("Pérez");
  await page.getByLabel("Teléfono", { exact: true }).fill("+5491123456789");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
}
export async function toReview(page: Page) {
  await toContact(page);
  await fillContact(page);
}
