import "server-only";
import { bookingConfig, getBookingType } from "@/config/booking";
import { site } from "@/config/site";
import type { SchedulingAdapter } from "./adapter";
import {
  AdapterError,
  type Appointment,
  type AppointmentRequest,
  type AvailabilityQuery,
  type AvailabilityResult,
  type ContactInput,
  type ContactMessageInput,
  type ContactMessageResult,
  type LeadInput,
  type LeadResult,
  type Slot,
} from "./types";

/**
 * GoHighLevel (LeadConnector) adapter — API v2.
 *
 * Runs on the server only. Credentials come from environment variables and
 * never reach the browser. Endpoints follow the public v2 reference
 * (https://highlevel.stoplight.io). Verify against the current docs and test
 * with a sandbox sub-account before going live: this file has not yet been
 * exercised against a real account.
 */

const BASE = "https://services.leadconnectorhq.com";

function env() {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    throw new AdapterError("GoHighLevel is not configured.", "not_configured", 503);
  }
  return { apiKey, locationId };
}

function calendarIdFor(typeId: string) {
  const type = getBookingType(typeId);
  if (!type) throw new AdapterError("Unknown booking type", "invalid", 400);
  const calId = process.env[type.ghlCalendarEnv];
  if (!calId) {
    throw new AdapterError(`Missing ${type.ghlCalendarEnv} for ${type.name}.`, "not_configured", 503);
  }
  return { type, calId };
}

function typeForCalendar(calendarId: string) {
  return bookingConfig.types.find((t) => process.env[t.ghlCalendarEnv] === calendarId);
}

async function ghl<T>(path: string, init: RequestInit & { version?: string } = {}): Promise<T> {
  const { apiKey } = env();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: init.version ?? "2021-07-28",
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new AdapterError(`GHL ${res.status}: ${text.slice(0, 200)}`, "upstream", 502);
  }
  return (await res.json()) as T;
}

type FreeSlotsResponse = Record<string, { slots: string[] } | string>;

type UpsertContactArgs = ContactInput & { source?: string; tags?: string[] };

type GhlEvent = {
  id: string;
  calendarId: string;
  contactId: string;
  startTime: string;
  endTime: string;
  appointmentStatus: string;
  title?: string;
  notes?: string;
};

export class GhlAdapter implements SchedulingAdapter {
  readonly mode = "live" as const;

  async getAvailability(q: AvailabilityQuery): Promise<AvailabilityResult> {
    const { type, calId } = calendarIdFor(q.typeId);
    const startDate = Date.parse(`${q.from}T00:00:00Z`);
    const endDate = Date.parse(`${q.to}T23:59:59Z`);
    const data = await ghl<FreeSlotsResponse>(
      `/calendars/${calId}/free-slots?startDate=${startDate}&endDate=${endDate}&timezone=${encodeURIComponent(site.timezone)}`,
      { version: "2021-04-15" },
    );
    const slots: Slot[] = [];
    for (const [key, value] of Object.entries(data)) {
      if (key === "traceId" || typeof value === "string") continue;
      for (const s of value.slots) {
        const start = new Date(s);
        slots.push({
          start: start.toISOString(),
          end: new Date(start.getTime() + type.durationMin * 60_000).toISOString(),
        });
      }
    }
    slots.sort((a, b) => a.start.localeCompare(b.start));
    return { mode: this.mode, timezone: site.timezone, typeId: q.typeId, slots, sample: false };
  }

  private async upsertContact(c: UpsertContactArgs) {
    const { locationId } = env();
    const res = await ghl<{ contact: { id: string }; new?: boolean }>(`/contacts/upsert`, {
      method: "POST",
      body: JSON.stringify({
        locationId,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone ?? undefined,
        source: c.source ?? "website",
        tags: c.tags,
      }),
    });
    return { id: res.contact.id, isNew: Boolean(res.new) };
  }

  async createAppointment(req: AppointmentRequest): Promise<Appointment> {
    const { type, calId } = calendarIdFor(req.typeId);
    const { locationId } = env();
    const contact = await this.upsertContact({ ...req.contact, source: req.source ?? "website-booking" });
    const start = new Date(req.start);
    const end = new Date(start.getTime() + type.durationMin * 60_000);
    const childcareNote = req.childcare ? `Childcare (CoreNest): ${req.childcare} ${req.childcare === 1 ? "child" : "children"}.` : "";
    const notes = [childcareNote, req.notes ?? ""].filter(Boolean).join(" ") || undefined;

    const res = await ghl<{ id: string }>(`/calendars/events/appointments`, {
      method: "POST",
      version: "2021-04-15",
      body: JSON.stringify({
        calendarId: calId,
        locationId,
        contactId: contact.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        title: `${type.name} — ${req.contact.firstName} ${req.contact.lastName}`,
        appointmentStatus: "confirmed",
        ignoreFreeSlotValidation: false, // GHL rejects double bookings for us.
        notes,
      }),
    });

    return {
      id: res.id,
      mode: this.mode,
      typeId: type.id,
      typeName: type.name,
      start: start.toISOString(),
      end: end.toISOString(),
      status: "confirmed",
      contact: req.contact,
      notes: req.notes ?? null,
      childcare: req.childcare ?? 0,
      timezone: req.timezone,
      createdAt: new Date().toISOString(),
      ghl: { contactId: contact.id, appointmentId: res.id, calendarId: calId },
    };
  }

  async getAppointment(id: string): Promise<Appointment | null> {
    const { event } = await ghl<{ event: GhlEvent | null }>(`/calendars/events/appointments/${id}`, {
      version: "2021-04-15",
    });
    if (!event) return null;
    const type = typeForCalendar(event.calendarId);
    return {
      id: event.id,
      mode: this.mode,
      typeId: type?.id ?? "unknown",
      typeName: type?.name ?? event.title ?? "Session",
      start: new Date(event.startTime).toISOString(),
      end: new Date(event.endTime).toISOString(),
      status: event.appointmentStatus === "cancelled" ? "cancelled" : "confirmed",
      contact: { firstName: "", lastName: "", email: "" },
      notes: event.notes ?? null,
      timezone: site.timezone,
      createdAt: new Date().toISOString(),
      ghl: { contactId: event.contactId, appointmentId: event.id, calendarId: event.calendarId },
    };
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    await ghl(`/calendars/events/appointments/${id}`, {
      method: "PUT",
      version: "2021-04-15",
      body: JSON.stringify({ appointmentStatus: "cancelled" }),
    });
    const appt = await this.getAppointment(id);
    if (!appt) throw new AdapterError("Reservation not found", "not_found", 404);
    return { ...appt, status: "cancelled" };
  }

  async rescheduleAppointment(id: string, newStart: string): Promise<Appointment> {
    const current = await this.getAppointment(id);
    if (!current) throw new AdapterError("Reservation not found", "not_found", 404);
    const durationMs = new Date(current.end).getTime() - new Date(current.start).getTime();
    const start = new Date(newStart);
    const end = new Date(start.getTime() + durationMs);
    await ghl(`/calendars/events/appointments/${id}`, {
      method: "PUT",
      version: "2021-04-15",
      body: JSON.stringify({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        ignoreFreeSlotValidation: false,
      }),
    });
    return { ...current, start: start.toISOString(), end: end.toISOString() };
  }

  async upsertLead(lead: LeadInput): Promise<LeadResult> {
    const tags = lead.tags ?? [];
    const contact = await this.upsertContact({ ...lead, tags });
    if (tags.length) {
      await ghl(`/contacts/${contact.id}/tags`, { method: "POST", body: JSON.stringify({ tags }) });
    }
    let workflowAdded = false;
    if (lead.workflowId) {
      await ghl(`/contacts/${contact.id}/workflow/${lead.workflowId}`, {
        method: "POST",
        body: JSON.stringify({ eventStartTime: new Date().toISOString() }),
      });
      workflowAdded = true;
    }
    return { mode: this.mode, contactId: contact.id, duplicate: !contact.isNew, tagsApplied: tags, workflowAdded };
  }

  async submitContactMessage(msg: ContactMessageInput): Promise<ContactMessageResult> {
    const [firstName, ...rest] = msg.name.trim().split(/\s+/);
    const contact = await this.upsertContact({
      firstName,
      lastName: rest.join(" ") || "-",
      email: msg.email,
      source: "website-contact",
      tags: ["CoreMama-ContactForm"],
    });
    const workflowId = process.env.GHL_CONTACT_WORKFLOW_ID;
    if (workflowId) {
      await ghl(`/contacts/${contact.id}/workflow/${workflowId}`, {
        method: "POST",
        body: JSON.stringify({ eventStartTime: new Date().toISOString() }),
      });
    }
    // The message body is attached as a contact note so staff see it in GHL.
    await ghl(`/contacts/${contact.id}/notes`, { method: "POST", body: JSON.stringify({ body: msg.message }) });
    return { mode: this.mode, id: contact.id };
  }
}
