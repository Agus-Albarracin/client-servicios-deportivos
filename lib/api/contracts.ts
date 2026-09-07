export interface Sport {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}

export type ZoneName = "CABA" | "SUR" | "NORTE" | "NOROESTE" | "OESTE";
export interface Zone {
  id: string;
  name: ZoneName;
}

export interface Venue {
  id: string;
  name: string;
  zoneId: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  whatsappNumber: string;
  isActive: boolean;
}
export interface VenueDetail extends Venue {
  mapUrl: string;
}

export interface Slot {
  id: string;
  venueId: string;
  sportId: string;
  startsAt: string;
  endsAt: string;
  status: "AVAILABLE" | "UNAVAILABLE";
}

export interface Contact {
  renterFirstName: string;
  renterLastName: string;
  renterPhone: string;
}
export interface BookingDraft extends Partial<Contact> {
  id: string;
  sportId: string;
  zoneId?: string;
  venueId?: string;
  date?: string;
  slotId?: string;
}
export type DraftInput = Partial<Omit<BookingDraft, "id">>;

export interface WhatsAppPreview {
  status: "PENDING_CONFIRMATION";
  label: string;
  notice: string;
  summary: Contact & { sport: Sport; venue: Venue; slot: Slot };
  message: string;
  url: string;
}
