import { z } from "zod";

export const digitsOnly = (v: string) => v.replace(/\D/g, "");

const validPhone = (v: string) => {
  const d = digitsOnly(v);
  return d.length >= 10 && d.length <= 15;
};

const phoneOptional = z
  .string()
  .trim()
  .max(30)
  .refine((v) => !v || validPhone(v), { message: "Enter a valid phone number" });

const phoneRequired = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(validPhone, { message: "Enter a valid phone number" });

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const foundingMemberSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  email,
  phone: phoneOptional,
  consent: z.boolean().refine((v) => v === true, { message: "Please tick the box to join the list" }),
  source: z.string().trim().max(80),
});
export type FoundingMemberInput = z.infer<typeof foundingMemberSchema>;

export const bookingDetailsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(100)
    .refine((v) => v.split(/\s+/).length >= 2, { message: "Please include first and last name" }),
  email,
  phone: phoneRequired,
  /** CoreNest childcare reservation: number of children. */
  childcare: z.enum(["0", "1", "2"]),
  notes: z.string().trim().max(500, "Keep notes under 500 characters"),
});
export type BookingDetailsInput = z.infer<typeof bookingDetailsSchema>;

export function childcareLabel(n: number | string | undefined | null) {
  const v = Number(n ?? 0);
  if (!v) return "None";
  return v === 1 ? "1 child (CoreNest)" : `${v} children (CoreNest)`;
}

export const createBookingSchema = z.object({
  typeId: z.string().min(1),
  start: z.iso.datetime({ offset: true }),
  timezone: z.string().min(1).max(64),
  details: bookingDetailsSchema,
  source: z.string().trim().max(80).optional(),
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const rescheduleSchema = z.object({
  start: z.iso.datetime({ offset: true }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  email,
  message: z.string().trim().min(10, "Tell us a little more").max(2000),
});
export type ContactInput = z.infer<typeof contactSchema>;

export function splitName(full: string) {
  const parts = full.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") || "-" };
}
