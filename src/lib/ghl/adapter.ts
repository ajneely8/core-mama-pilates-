import type {
  Appointment,
  AppointmentRequest,
  AvailabilityQuery,
  AvailabilityResult,
  ContactMessageInput,
  ContactMessageResult,
  LeadInput,
  LeadResult,
  Mode,
} from "./types";

/**
 * Everything the site needs from a scheduling + CRM backend. The demo adapter
 * and the GoHighLevel adapter both implement this, so switching to live
 * calendars is a configuration change, not a redesign.
 */
export interface SchedulingAdapter {
  readonly mode: Mode;
  getAvailability(q: AvailabilityQuery): Promise<AvailabilityResult>;
  createAppointment(req: AppointmentRequest): Promise<Appointment>;
  getAppointment(id: string): Promise<Appointment | null>;
  cancelAppointment(id: string): Promise<Appointment>;
  rescheduleAppointment(id: string, newStart: string): Promise<Appointment>;
  upsertLead(lead: LeadInput): Promise<LeadResult>;
  submitContactMessage(msg: ContactMessageInput): Promise<ContactMessageResult>;
}
