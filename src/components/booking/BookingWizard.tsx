"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { addDays, parseISO, startOfMonth } from "date-fns";
import { ArrowRight, Check, Clock, RefreshCw } from "lucide-react";
import { cn } from "cn";
import { bookingConfig, getBookingType, type BookingType } from "@/config/booking";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { ModeNote } from "@/components/forms/Field";
import { EASE } from "@/components/motion/Reveal";
import type { Appointment, Slot } from "@/lib/ghl/types";
import { dateKeyInTz, formatLongDate, formatTime, tzShortName } from "@/lib/time";
import { childcareLabel, type BookingDetailsInput } from "@/lib/validation/schemas";
import { DatePicker } from "./DatePicker";
import { TimeSlots } from "./TimeSlots";
import { DetailsForm } from "./DetailsForm";
import { useAvailability, useVisitorTimeZone } from "./useAvailability";

type Step = 1 | 2 | 3 | 4 | 5 | 6;
const STEPS = ["Session", "Date", "Time", "Details", "Review", "Confirmed"];

type ApiError = { error?: string; code?: string };

export function BookingWizard({ initialTypeId }: { initialTypeId?: string }) {
  const validInitial = initialTypeId && getBookingType(initialTypeId) ? initialTypeId : null;
  const [step, setStep] = useState<Step>(validInitial ? 2 : 1);
  const [typeId, setTypeId] = useState<string | null>(validInitial);
  const [dateKey, setDateKey] = useState<string | null>(null);
  const [slot, setSlot] = useState<Slot | null>(null);
  const [details, setDetails] = useState<BookingDetailsInput | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [rescheduling, setRescheduling] = useState(false);
  const [busy, setBusy] = useState(false);
  const [flash, setFlash] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  /** Month the visitor navigated to; null = follow the first available day. */
  const [monthOverride, setMonthOverride] = useState<Date | null>(null);

  const tz = useVisitorTimeZone();
  const { data, status, error, refresh } = useAvailability(typeId);
  const type = typeId ? getBookingType(typeId) : undefined;

  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    if (!data || !tz) return map;
    for (const s of data.slots) {
      const key = dateKeyInTz(s.start, tz);
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return map;
  }, [data, tz]);

  const availableDays = useMemo(() => new Set(slotsByDay.keys()), [slotsByDay]);

  // The calendar opens on the first month that has availability.
  const firstAvailable = useMemo(() => [...availableDays].sort()[0] ?? null, [availableDays]);
  const month = monthOverride ?? (firstAvailable ? startOfMonth(parseISO(firstAvailable)) : startOfMonth(new Date()));

  const today = new Date();
  const maxDate = addDays(today, bookingConfig.windowDays);

  function go(next: Step) {
    setFlash(null);
    setStep(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseType(t: BookingType) {
    if (t.id !== typeId) {
      setDateKey(null);
      setSlot(null);
      setMonthOverride(null);
    }
    setTypeId(t.id);
    go(2);
  }

  function chooseDate(key: string) {
    setDateKey(key);
    setSlot(null);
    go(3);
  }

  function chooseSlot(s: Slot) {
    setSlot(s);
    if (rescheduling) go(5);
    else go(4);
  }

  async function confirm() {
    if (!typeId || !slot || !tz) return;
    setBusy(true);
    setFlash(null);
    try {
      let res: Response;
      if (rescheduling && appointment) {
        res = await fetch(`/api/booking/${appointment.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ start: slot.start }),
        });
      } else {
        if (!details) return;
        res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ typeId, start: slot.start, timezone: tz, details, source: "website-booking" }),
        });
      }
      const json = (await res.json()) as { appointment?: Appointment } & ApiError;
      if (!res.ok || !json.appointment) {
        if (json.code === "slot_taken") {
          refresh();
          setSlot(null);
          setFlash({ tone: "error", text: json.error ?? "That time was just taken. Please pick another." });
          go(3);
          return;
        }
        throw new Error(json.error ?? "Something went wrong");
      }
      setAppointment(json.appointment);
      setRescheduling(false);
      go(6);
    } catch (e) {
      setFlash({ tone: "error", text: e instanceof Error ? e.message : "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function cancel() {
    if (!appointment) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/booking/${appointment.id}`, { method: "DELETE" });
      const json = (await res.json()) as { appointment?: Appointment } & ApiError;
      if (!res.ok || !json.appointment) throw new Error(json.error ?? "Could not cancel");
      setAppointment(json.appointment);
      refresh();
    } catch (e) {
      setFlash({ tone: "error", text: e instanceof Error ? e.message : "Could not cancel. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  function startReschedule() {
    setRescheduling(true);
    setDateKey(null);
    setSlot(null);
    refresh();
    go(2);
  }

  function startOver() {
    setStep(1);
    setTypeId(null);
    setDateKey(null);
    setSlot(null);
    setMonthOverride(null);
    setDetails(null);
    setAppointment(null);
    setRescheduling(false);
    setFlash(null);
  }

  const visitorTzLabel = tz ? tzShortName(tz) : "";
  const studioTzLabel = tzShortName(site.timezone);
  const differentTz = tz ? tz !== site.timezone : false;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-8">
        <StepIndicator current={step} />

        {data?.sample && step < 6 && (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-rose/50 bg-blush/40 px-3 py-1 font-sans text-[11px] font-semibold tracking-wide text-espresso/75 uppercase">
            <span className="size-1.5 rounded-full bg-rose-deep" /> Sample availability for demo
          </p>
        )}

        <AnimatePresence mode="wait" initial={false}>
          {flash && (
            <motion.p
              key={flash.text}
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mt-6 rounded-md border px-4 py-3 font-sans text-sm",
                flash.tone === "error"
                  ? "border-destructive/30 bg-destructive/5 text-destructive"
                  : "border-olive/30 bg-sage/15 text-espresso/80",
              )}
            >
              {flash.text}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-10"
          >
            {step === 1 && (
              <div>
                <h2 className="display-md">Choose a session</h2>
                <p className="mt-2 font-sans text-sm text-espresso/60">
                  Session options are placeholders until the studio publishes its final booking types.
                </p>
                <ul className="mt-8 border-t border-espresso/12">
                  {bookingConfig.types.map((t) => (
                    <li key={t.id} className="border-b border-espresso/12">
                      <button
                        type="button"
                        onClick={() => chooseType(t)}
                        className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:bg-espresso/[0.03] md:px-4"
                      >
                        <div>
                          <h3 className="font-display text-2xl text-espresso">{t.name}</h3>
                          <p className="mt-1 max-w-lg font-sans text-sm leading-relaxed text-espresso/65">{t.description}</p>
                          <p className="mt-2 inline-flex items-center gap-1.5 font-sans text-xs text-espresso/55">
                            <Clock className="size-3.5" /> {t.durationMin} minutes
                          </p>
                        </div>
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-espresso/20 text-espresso transition-all group-hover:border-espresso group-hover:bg-espresso group-hover:text-cream">
                          <ArrowRight className="size-4" />
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 2 && type && (
              <div>
                <h2 className="display-md">{rescheduling ? "Pick a new date" : "Pick a date"}</h2>
                <p className="mt-2 font-sans text-sm text-espresso/60">
                  {status === "loading" && "Loading availability…"}
                  {status === "ready" && `Showing days with open ${type.name.toLowerCase()} times.`}
                  {status === "error" && (error ?? "Could not load availability.")}
                </p>
                {status === "error" ? (
                  <Button variant="outline" className="mt-6" onClick={refresh}>
                    <RefreshCw /> Try again
                  </Button>
                ) : (
                  <div className="mt-8">
                    {tz && (
                      <DatePicker
                        month={month}
                        onMonthChange={setMonthOverride}
                        selected={dateKey}
                        onSelect={chooseDate}
                        availableDays={availableDays}
                        minMonth={today}
                        maxMonth={maxDate}
                        loading={status === "loading"}
                      />
                    )}
                  </div>
                )}
                <TzNote visitor={visitorTzLabel} studio={studioTzLabel} different={differentTz} />
                <Button variant="link" className="mt-8" onClick={() => go(rescheduling ? 6 : 1)}>
                  Back
                </Button>
              </div>
            )}

            {step === 3 && type && dateKey && tz && (
              <div>
                <h2 className="display-md">Choose a time</h2>
                <p className="mt-2 font-sans text-sm text-espresso/60">{formatLongDate(parseISO(dateKey), tz)}</p>
                <div className="mt-8">
                  <TimeSlots slots={slotsByDay.get(dateKey) ?? []} tz={tz} selected={slot} onSelect={chooseSlot} />
                </div>
                <TzNote visitor={visitorTzLabel} studio={studioTzLabel} different={differentTz} />
                <Button variant="link" className="mt-8" onClick={() => go(2)}>
                  Back
                </Button>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="display-md">Your details</h2>
                <p className="mt-2 mb-8 font-sans text-sm text-espresso/60">So we know who the reformer is waiting for.</p>
                <DetailsForm
                  defaultValues={details}
                  onBack={() => go(3)}
                  onSubmit={(v) => {
                    setDetails(v);
                    go(5);
                  }}
                />
              </div>
            )}

            {step === 5 && type && slot && tz && (
              <div>
                <h2 className="display-md">{rescheduling ? "Confirm your new time" : "Review your reservation"}</h2>
                <dl className="mt-8 divide-y divide-espresso/12 border-y border-espresso/12">
                  <Row label="Session" value={type.name} onEdit={rescheduling ? undefined : () => go(1)} />
                  <Row label="Date" value={formatLongDate(slot.start, tz)} onEdit={() => go(2)} />
                  <Row
                    label="Time"
                    value={`${formatTime(slot.start, tz)} – ${formatTime(slot.end, tz)} ${visitorTzLabel}`}
                    onEdit={() => go(3)}
                  />
                  {!rescheduling && details && (
                    <>
                      <Row label="Name" value={details.fullName} onEdit={() => go(4)} />
                      <Row label="Email" value={details.email} onEdit={() => go(4)} />
                      <Row label="Phone" value={details.phone} onEdit={() => go(4)} />
                      <Row label="Childcare" value={childcareLabel(details.childcare)} onEdit={() => go(4)} />
                      {details.notes && <Row label="Notes" value={details.notes} onEdit={() => go(4)} />}
                    </>
                  )}
                </dl>
                <ModeNote mode={data?.mode ?? "demo"}>
                  {data?.mode === "live"
                    ? "Confirming creates a real appointment in the studio calendar."
                    : "This is a demo booking system. No real appointment will be created and no confirmation will be sent until the studio's calendar is connected."}
                </ModeNote>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="link" onClick={() => go(rescheduling ? 3 : 4)} className="self-start">
                    Back
                  </Button>
                  <Button size="lg" onClick={confirm} disabled={busy}>
                    {busy ? "Confirming…" : rescheduling ? "Confirm new time" : "Confirm reservation"}
                    <Check />
                  </Button>
                </div>
              </div>
            )}

            {step === 6 && appointment && tz && (
              <Confirmation
                appointment={appointment}
                tz={tz}
                tzLabel={visitorTzLabel}
                busy={busy}
                onCancel={cancel}
                onReschedule={startReschedule}
                onStartOver={startOver}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <aside className="lg:col-span-4">
        <div className="border border-espresso/12 bg-ivory p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Your reservation</p>
          <dl className="mt-5 space-y-4 font-sans text-sm">
            <SummaryRow label="Session" value={type?.name} />
            <SummaryRow label="Date" value={slot && tz ? formatLongDate(slot.start, tz) : dateKey ? formatLongDate(parseISO(dateKey), tz ?? "UTC") : undefined} />
            <SummaryRow label="Time" value={slot && tz ? `${formatTime(slot.start, tz)} ${visitorTzLabel}` : undefined} />
            <SummaryRow label="Length" value={type ? `${type.durationMin} min` : undefined} />
          </dl>
          <p className="mt-6 border-t border-espresso/10 pt-4 font-sans text-xs leading-relaxed text-espresso/50">
            {site.name} · {site.address.city}, {site.address.region}. Studio time is {site.timezoneLabel}.
          </p>
          <p className="mt-3 font-sans text-xs text-espresso/50">
            Need help?{" "}
            <Link href="/#contact" className="underline underline-offset-4">
              Contact the studio
            </Link>
            .
          </p>
        </div>
      </aside>
    </div>
  );
}

function StepIndicator({ current }: { current: Step }) {
  return (
    <ol className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Booking progress">
      {STEPS.map((label, i) => {
        const n = (i + 1) as Step;
        const state = n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li key={label} className="flex items-center gap-2 font-sans text-[11px] font-semibold tracking-[0.18em] uppercase" aria-current={state === "current" ? "step" : undefined}>
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full border text-[10px] tabular-nums",
                state === "done" && "border-olive bg-olive text-cream",
                state === "current" && "border-espresso bg-espresso text-cream",
                state === "todo" && "border-espresso/20 text-espresso/40",
              )}
            >
              {state === "done" ? <Check className="size-3" strokeWidth={3} /> : n}
            </span>
            <span className={cn(state === "todo" ? "text-espresso/40" : "text-espresso")}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function TzNote({ visitor, studio, different }: { visitor: string; studio: string; different: boolean }) {
  if (!visitor) return null;
  return (
    <p className="mt-6 font-sans text-xs text-espresso/55">
      Times shown in your time zone ({visitor}).
      {different && ` The studio runs on ${studio}.`}
    </p>
  );
}

function Row({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return (
    <div className="grid grid-cols-[6rem_1fr_auto] items-baseline gap-4 py-4 sm:grid-cols-[8rem_1fr_auto]">
      <dt className="font-sans text-xs font-semibold tracking-[0.14em] text-espresso/50 uppercase">{label}</dt>
      <dd className="font-sans text-[15px] text-espresso break-words">{value}</dd>
      {onEdit ? (
        <button type="button" onClick={onEdit} className="font-sans text-xs text-espresso/60 underline underline-offset-4 hover:text-espresso">
          Edit
        </button>
      ) : (
        <span />
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-espresso/10 pb-3">
      <dt className="text-espresso/55">{label}</dt>
      <dd className={cn("text-right", value ? "text-espresso" : "text-espresso/35")}>{value ?? "—"}</dd>
    </div>
  );
}

function Confirmation({
  appointment,
  tz,
  tzLabel,
  busy,
  onCancel,
  onReschedule,
  onStartOver,
}: {
  appointment: Appointment;
  tz: string;
  tzLabel: string;
  busy: boolean;
  onCancel: () => void;
  onReschedule: () => void;
  onStartOver: () => void;
}) {
  const cancelled = appointment.status === "cancelled";
  const demo = appointment.mode === "demo";
  return (
    <div role="status" aria-live="polite">
      <span className={cn("flex size-12 items-center justify-center rounded-full text-cream", cancelled ? "bg-espresso/40" : "bg-olive")}>
        <Check className="size-5" strokeWidth={2.5} />
      </span>
      <h2 className="display-md mt-5">
        {cancelled ? "Reservation cancelled." : demo ? "Demo reservation created." : "You're booked in."}
      </h2>
      <p className="lede mt-2">
        {cancelled
          ? "Your time has been released. Book again whenever you like."
          : `${appointment.typeName} on ${formatLongDate(appointment.start, tz)} at ${formatTime(appointment.start, tz)} ${tzLabel}.`}
      </p>

      <dl className="mt-8 divide-y divide-espresso/12 border-y border-espresso/12">
        <Row label="Reference" value={appointment.id} />
        <Row label="Session" value={appointment.typeName} />
        <Row label="When" value={`${formatLongDate(appointment.start, tz)}, ${formatTime(appointment.start, tz)} – ${formatTime(appointment.end, tz)} ${tzLabel}`} />
        <Row label="Childcare" value={childcareLabel(appointment.childcare)} />
        <Row label="Status" value={cancelled ? "Cancelled" : demo ? "Demo (not a real appointment)" : "Confirmed"} />
      </dl>

      <ModeNote mode={appointment.mode}>
        {demo
          ? "No confirmation email or text was sent. When GoHighLevel is connected, confirming creates the contact, books the appointment on the studio calendar, and triggers the studio's confirmation and reminder workflows."
          : "The studio's confirmation and reminder workflows handle email and text from here."}
      </ModeNote>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {!cancelled && (
          <>
            <Button variant="outline" onClick={onReschedule} disabled={busy}>
              <RefreshCw /> Reschedule
            </Button>
            <Button variant="destructive" onClick={onCancel} disabled={busy}>
              {busy ? "Cancelling…" : "Cancel reservation"}
            </Button>
          </>
        )}
        <Button variant="link" onClick={onStartOver}>
          Book another session
        </Button>
      </div>
    </div>
  );
}
