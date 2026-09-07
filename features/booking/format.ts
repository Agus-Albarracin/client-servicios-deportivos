import type { ZoneName } from "@/lib/api/contracts";
export const zoneLabels: Record<ZoneName, string> = {
  CABA: "CABA",
  SUR: "Zona Sur",
  NORTE: "Zona Norte",
  NOROESTE: "Zona Noroeste",
  OESTE: "Zona Oeste",
};
const timeZone = "America/Argentina/Buenos_Aires";
export function todayInBuenosAires() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  return ["year", "month", "day"]
    .map((type) => parts.find((part) => part.type === type)!.value)
    .join("-");
}
export function formatTime(instant: string) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(instant));
}
export function formatDate(instant: string) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(instant));
}
export function safeExternalUrl(value: string, host: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === host &&
      !url.username &&
      !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}
