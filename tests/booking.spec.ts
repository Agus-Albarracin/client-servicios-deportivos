import { expect, test } from "@playwright/test";
import {
  date,
  fillContact,
  mockApi,
  sports,
  toAvailability,
  toContact,
  toReview,
  toVenues,
  zones,
} from "./fixtures";

test("completes all five steps and prepares the exact WhatsApp message", async ({
  page,
}) => {
  const state = await mockApi(page);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await toReview(page);
  await page
    .getByRole("button", { name: "Preparar resumen", exact: true })
    .click();
  await expect(
    page.getByText("Pendiente de confirmación", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Ana Pérez", { exact: true })).toBeVisible();
  await expect(page.getByText("18:00 – 19:00", { exact: true })).toBeVisible();
  await expect(page.getByText("Ver mensaje completo")).toHaveCount(0);
  const link = page.getByRole("link", {
    name: "Abonar la reserva",
    exact: true,
  });
  await expect(link).toHaveAttribute("target", "_blank");
  const url = new URL((await link.getAttribute("href"))!);
  expect(url.hostname).toBe("wa.me");
  expect(url.searchParams.get("text")).toContain("Ana Pérez");
  expect(url.searchParams.get("text")).not.toContain(state.draft!.id);
  expect(state.creates).toBe(1);
  expect(state.previews).toBe(1);
  expect(state.draft).toMatchObject({ date, renterPhone: "+5491123456789" });
  expect(errors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath("summary.png"),
    fullPage: true,
  });
});

test("validates contact, preserves it on errors and when going back", async ({
  page,
}) => {
  const state = await mockApi(page);
  await toContact(page);
  const previousPatches = state.patches.length;
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByLabel("Nombre", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Teléfono", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect(state.patches).toHaveLength(previousPatches);
  await page.getByLabel("Nombre", { exact: true }).fill("Ana");
  await page.getByLabel("Apellido", { exact: true }).fill("Pérez");
  await page.getByLabel("Teléfono", { exact: true }).fill("+5491123456789");
  state.failContact = true;
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByRole("region").getByRole("alert")).toContainText("no está disponible");
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("Ana");
  state.failContact = false;
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await page.getByRole("button", { name: "Volver", exact: true }).click();
  await expect(page.getByLabel("Teléfono", { exact: true })).toHaveValue(
    "+5491123456789",
  );
});

test("clears incompatible choices and keeps contact when changing sport", async ({
  page,
}) => {
  const state = await mockApi(page);
  await toReview(page);
  await page.getByRole("button", { name: "Deporte", exact: true }).click();
  await page.getByRole("radio", { name: "Tenis" }).check();
  await page.getByRole("button", { name: "Continuar", exact: true }).click();
  await expect(page.getByLabel("Zona", { exact: true })).toBeVisible();
  expect(state.draft!.renterFirstName).toBe("Ana");
  expect(state.draft!.sportId).toBe(sports[1].id);
  expect(state.draft).not.toHaveProperty("slotId");
  expect(state.draft).not.toHaveProperty("venueId");
  await expect(
    page.getByRole("button", { name: "Ver disponibilidad", exact: true }),
  ).toBeDisabled();
});

test("does not expose blocked slots and recovers when availability changes", async ({
  page,
}) => {
  const state = await mockApi(page);
  await toAvailability(page);
  await expect(page.getByRole("radio")).toHaveCount(1);
  await page.getByRole("radio", { name: "18:00 – 19:00" }).check();
  await page.getByRole("button", { name: "Continuar con mis datos" }).click();
  await fillContact(page);
  state.unavailable = true;
  await page
    .getByRole("button", { name: "Preparar resumen", exact: true })
    .click();
  await expect(page.getByRole("region").getByRole("alert")).toContainText(
    "El turno no está disponible",
  );
  await expect(
    page.getByRole("link", { name: "Abonar la reserva" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Volver a elegir horario" }).click();
  await expect(page.getByText(/No hay turnos disponibles/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continuar con mis datos" }),
  ).toBeDisabled();
});

test("handles catalog errors, empty catalogs and keyboard selection", async ({
  page,
}) => {
  const state = await mockApi(page);
  state.failSports = true;
  await page.goto("/");
  await expect(page.getByRole("region").getByRole("alert")).toBeVisible();
  state.failSports = false;
  state.emptySports = true;
  await page.getByRole("button", { name: "Volver a intentar" }).click();
  await expect(page.getByText(/Todavía no hay deportes/)).toBeVisible();
  state.emptySports = false;
  await page.reload();
  const radio = page.getByRole("radio", { name: "Fútbol" });
  await radio.focus();
  await page.keyboard.press("Space");
  await expect(radio).toBeChecked();
  await expect(
    page.getByRole("button", { name: "Continuar", exact: true }),
  ).toBeEnabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: test.info().outputPath("sports.png"),
    fullPage: true,
  });
});

test("ignores delayed responses after changing the zone", async ({ page }) => {
  const state = await mockApi(page);
  state.slowZone = true;
  await toVenues(page);
  await page.getByLabel("Zona", { exact: true }).selectOption(zones[1].id);
  await page.getByLabel("Zona", { exact: true }).selectOption(zones[0].id);
  await expect(
    page.getByRole("radio", { name: /Polideportivo de prueba/ }),
  ).toBeVisible();
  await expect(page.getByLabel("Zona", { exact: true })).toHaveValue(
    zones[0].id,
  );
});

test("date change invalidates local selection and metadata matches the flow", async ({
  page,
}) => {
  await mockApi(page);
  await toAvailability(page);
  await page.getByRole("radio", { name: "18:00 – 19:00" }).check();
  await page.getByLabel("Fecha", { exact: true }).fill("2099-01-02");
  await expect(page.getByText(/No hay turnos disponibles/)).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Continuar con mis datos" }),
  ).toBeDisabled();
  await expect(page).toHaveTitle(
    "Solicitá tu turno | Turnero de polideportivos",
  );
  await expect(page.locator("html")).toHaveAttribute("lang", "es-AR");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  );
});

test("shows the venue map inline before requesting contact and clears it on zone change", async ({ page }) => {
  const state = await mockApi(page);
  await toVenues(page);
  await expect(page.locator('.booking-progress button')).toHaveText([
    /Deporte/, /Zona y sede/, /Fecha y horario/, /Tus datos/, /Resumen y WhatsApp/,
  ]);
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveCount(0);
  expect(state.draft).not.toHaveProperty("renterFirstName");
  await page.getByLabel("Zona", { exact: true }).selectOption(zones[0].id);
  await page.getByRole("radio", { name: /Polideportivo de prueba/ }).check();
  const map = page.getByTitle("Mapa de Polideportivo de prueba", { exact: true });
  await expect(map).toBeVisible();
  const url = new URL((await map.getAttribute("src"))!);
  expect(url.origin).toBe("https://www.openstreetmap.org");
  expect(url.searchParams.get("marker")).toBe("-34.6,-58.4");
  await expect(page.getByRole("link", { name: /Google Maps/ })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: test.info().outputPath("venue-map.png"), fullPage: true });
  await page.getByLabel("Zona", { exact: true }).selectOption(zones[1].id);
  await expect(map).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ver disponibilidad" })).toBeDisabled();
});

test("recovers an occupied slot while saving the final contact step without losing contact", async ({ page }) => {
  const state = await mockApi(page);
  await toContact(page);
  state.unavailable = true;
  await fillContact(page);
  await expect(page.getByRole("region").getByRole("alert")).toContainText("El turno no está disponible");
  await page.getByRole("button", { name: "Volver a elegir horario" }).click();
  await expect(page.getByText(/No hay turnos disponibles/)).toBeVisible();
  state.unavailable = false;
  await page.getByRole("button", { name: "Actualizar horarios" }).click();
  await page.getByRole("radio", { name: "18:00 – 19:00" }).check();
  await page.getByRole("button", { name: "Continuar con mis datos" }).click();
  await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("Ana");
  await expect(page.getByLabel("Teléfono", { exact: true })).toHaveValue("+5491123456789");
  await page.getByRole("button", { name: "Guardar y continuar" }).click();
  await expect(page.getByRole("button", { name: "Preparar resumen", exact: true })).toBeVisible();
});
