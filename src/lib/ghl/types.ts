/** Shared types for the scheduling / CRM adapter layer. */

export type Mode = "demo" | "live";

export type Slot = {
  /** ISO-8601 UTC instant. */
  start: string;
  end: string;
  /** Remaining capacity when known (demo shows reformers left). */
  remaining?: number;
};

export type AvailabilityQuery = {
  typeId: string;
  /** Inclusive range, as "YYYY-MM-DD" in the studio time zone. */
  from: string;
  to: string;
};

export type AvailabilityResult = {
  mode: Mode;
  timezone: string;
  typeId: string;
  slots: Slot[];
  sample: boolean;
};

export type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
};

export type AppointmentRequest = {
  typeId: string;
  start: string;
  contact: ContactInput;
  notes?: string | null;
  /** Number of children for a CoreNest childcare reservation (0 = none). */
  childcare?: number;
  /** Visitor's IANA zone, stored for reminders. */
  timezone: string;
  source?: string;
};

export type AppointmentStatus = "demo" | "confirmed" | "cancelled";

export type Appointment = {
  id: string;
  mode: Mode;
  typeId: string;
  typeName: string;
  start: string;
  end: string;
  status: AppointmentStatus;
  contact: ContactInput;
  notes?: string | null;
  childcare?: number;
  timezone: string;
  createdAt: string;
  /** Present once GHL is connected. */
  ghl?: { contactId: string; appointmentId: string; calendarId: string };
};

export type LeadInput = ContactInput & {
  source: string;
  consent: boolean;
  tags?: string[];
  workflowId?: string | null;
  customFields?: Record<string, string>;
};

export type LeadResult = {
  mode: Mode;
  contactId: string;
  duplicate: boolean;
  tagsApplied: string[];
  workflowAdded: boolean;
};

export type ContactMessageInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactMessageResult = { mode: Mode; id: string };

export type AdapterErrorCode = "slot_taken" | "not_found" | "invalid" | "upstream" | "not_configured";

export class AdapterError extends Error {
  constructor(
    message: string,
    public code: AdapterErrorCode,
    public status = 400,
  ) {
    super(message);
    this.name = "AdapterError";
  }
}
