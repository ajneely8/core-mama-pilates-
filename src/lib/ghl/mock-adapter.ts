import { bookingConfig, getBookingType } from "@/config/booking";
import { site } from "@/config/site";
import { dateKeyInTz, parseDateKey, parseHHMM, zonedTimeToUtc } from "@/lib/time";
import type { SchedulingAdapter } from "./adapter";
import {
  AdapterError,
  type Appointment,
  type AppointmentRequest,
  type AvailabilityQuery,
  type AvailabilityResult,
  type ContactMessageInput,
  type ContactMessageResult,
  type LeadInput,
  type LeadResult,
  type Slot,
} from "./types";

/**
 * Demo adapter: deterministic SAMPLE availability plus an in-memory store so
 * the booking flow, double-booking protection, cancellation and rescheduling
 * all behave realistically. Nothing is persisted and nothing is sent.
 */

type Store = {
  appointments: Map<string, Appointment>;
  leads: Map<string, { id: string; lead: LeadInput; createdAt: string }>;
  messages: Map<string, ContactMessageInput & { createdAt: string }>;
};

declare global {
  var __cmpMockStore: Store | undefined;
}

function store(): Store {
  if (!globalThis.__cmpMockStore) {
    globalThis.__cmpMockStore = { appointments: new Map(), leads: new Map(), messages: new Map() };
  }
  return globalThis.__cmpMockStore;
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** Stable pseudo-random 0..n-1 from a string (FNV-1a). */
function hashMod(s: string, n: number) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % n;
}

function bookedCount(typeId: string, startIso: string) {
  let n = 0;
  for (const a of store().appointments.values()) {
    if (a.typeId === typeId && a.start === startIso && a.status !== "cancelled") n++;
  }
  return n;
}

function sameContactBooked(email: string, startIso: string, ignoreId?: string) {
  for (const a of store().appointments.values()) {
    if (a.id === ignoreId) continue;
    if (a.contact.email.toLowerCase() === email.toLowerCase() && a.start === startIso && a.status !== "cancelled") {
      return true;
    }
  }
  return false;
}

/** Generates sample slots for one studio-local day. */
function slotsForDay(typeId: string, dateKey: string, nowMs: number): Slot[] {
  const type = getBookingType(typeId);
  if (!type) return [];
  const tz = site.timezone;
  const { year, month, day } = parseDateKey(dateKey);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const hours = bookingConfig.sampleHours[weekday];
  if (!hours) return [];

  const open = parseHHMM(hours.open);
  const close = parseHHMM(hours.close);
  const openMs = zonedTimeToUtc(year, month, day, open.hour, open.minute, tz);
  const closeMs = zonedTimeToUtc(year, month, day, close.hour, close.minute, tz);
  const stepMs = type.durationMin * 60_000;
  const earliest = nowMs + bookingConfig.minNoticeMinutes * 60_000;

  const out: Slot[] = [];
  for (let t = openMs; t + stepMs <= closeMs; t += stepMs) {
    if (t < earliest) continue;
    const startIso = new Date(t).toISOString();
    // Deterministic "already booked" count so the calendar looks lived-in.
    const pretendTaken = hashMod(`${typeId}|${startIso}`, bookingConfig.sampleCapacity + 2);
    const remaining = bookingConfig.sampleCapacity - pretendTaken - bookedCount(typeId, startIso);
    if (remaining <= 0) continue;
    out.push({ start: startIso, end: new Date(t + stepMs).toISOString(), remaining });
  }
  return out;
}

function eachDateKey(from: string, to: string) {
  const a = parseDateKey(from);
  const b = parseDateKey(to);
  const start = Date.UTC(a.year, a.month - 1, a.day);
  const end = Date.UTC(b.year, b.month - 1, b.day);
  const keys: string[] = [];
  for (let t = start; t <= end; t += 86_400_000) {
    const d = new Date(t);
    keys.push(
      `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`,
    );
  }
  return keys;
}

export class MockAdapter implements SchedulingAdapter {
  readonly mode = "demo" as const;

  async getAvailability(q: AvailabilityQuery): Promise<AvailabilityResult> {
    if (!getBookingType(q.typeId)) throw new AdapterError("Unknown booking type", "invalid", 400);
    const now = Date.now();
    const slots = eachDateKey(q.from, q.to).flatMap((k) => slotsForDay(q.typeId, k, now));
    return { mode: this.mode, timezone: site.timezone, typeId: q.typeId, slots, sample: true };
  }

  private assertSlotOpen(typeId: string, startIso: string, email: string, ignoreId?: string) {
    const dayKey = dateKeyInTz(startIso, site.timezone);
    const open = slotsForDay(typeId, dayKey, Date.now()).some((s) => s.start === startIso);
    if (!open) throw new AdapterError("That time was just taken. Please choose another.", "slot_taken", 409);
    if (sameContactBooked(email, startIso, ignoreId)) {
      throw new AdapterError("You already have a reservation at this time.", "slot_taken", 409);
    }
  }

  async createAppointment(req: AppointmentRequest): Promise<Appointment> {
    const type = getBookingType(req.typeId);
    if (!type) throw new AdapterError("Unknown booking type", "invalid", 400);
    const startIso = new Date(req.start).toISOString();
    this.assertSlotOpen(req.typeId, startIso, req.contact.email);

    const appt: Appointment = {
      id: makeId("demo"),
      mode: this.mode,
      typeId: type.id,
      typeName: type.name,
      start: startIso,
      end: new Date(new Date(startIso).getTime() + type.durationMin * 60_000).toISOString(),
      status: "demo",
      contact: req.contact,
      notes: req.notes ?? null,
      childcare: req.childcare ?? 0,
      timezone: req.timezone,
      createdAt: new Date().toISOString(),
    };
    store().appointments.set(appt.id, appt);
    return appt;
  }

  async getAppointment(id: string) {
    return store().appointments.get(id) ?? null;
  }

  async cancelAppointment(id: string) {
    const appt = store().appointments.get(id);
    if (!appt) throw new AdapterError("Reservation not found", "not_found", 404);
    const updated: Appointment = { ...appt, status: "cancelled" };
    store().appointments.set(id, updated);
    return updated;
  }

  async rescheduleAppointment(id: string, newStart: string) {
    const appt = store().appointments.get(id);
    if (!appt) throw new AdapterError("Reservation not found", "not_found", 404);
    const type = getBookingType(appt.typeId);
    if (!type) throw new AdapterError("Unknown booking type", "invalid", 400);
    const startIso = new Date(newStart).toISOString();
    this.assertSlotOpen(appt.typeId, startIso, appt.contact.email, id);
    const updated: Appointment = {
      ...appt,
      start: startIso,
      end: new Date(new Date(startIso).getTime() + type.durationMin * 60_000).toISOString(),
      status: "demo",
    };
    store().appointments.set(id, updated);
    return updated;
  }

  async upsertLead(lead: LeadInput): Promise<LeadResult> {
    const key = lead.email.toLowerCase();
    const existing = store().leads.get(key);
    const tags = lead.tags ?? [];
    if (existing) {
      store().leads.set(key, { ...existing, lead: { ...existing.lead, ...lead } });
      return { mode: this.mode, contactId: existing.id, duplicate: true, tagsApplied: tags, workflowAdded: false };
    }
    const contactId = makeId("demo_contact");
    store().leads.set(key, { id: contactId, lead, createdAt: new Date().toISOString() });
    return { mode: this.mode, contactId, duplicate: false, tagsApplied: tags, workflowAdded: Boolean(lead.workflowId) };
  }

  async submitContactMessage(msg: ContactMessageInput): Promise<ContactMessageResult> {
    const id = makeId("demo_msg");
    store().messages.set(id, { ...msg, createdAt: new Date().toISOString() });
    return { mode: this.mode, id };
  }
}
