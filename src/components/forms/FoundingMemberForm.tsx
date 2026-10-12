"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, Honeypot, ModeNote, fieldInputClass } from "@/components/forms/Field";
import { foundingMemberSchema, type FoundingMemberInput } from "@/lib/validation/schemas";
import type { LeadResult } from "@/lib/ghl/types";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; result: LeadResult }
  | { kind: "error"; message: string };

export function FoundingMemberForm({
  source,
  size = "default",
  className,
}: {
  /** Tracked signup source, e.g. "homepage" or "landing-page". */
  source: string;
  size?: "default" | "large";
  className?: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honey, setHoney] = useState("");
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FoundingMemberInput>({
    resolver: zodResolver(foundingMemberSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", consent: false, source },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (honey) {
      // Bot filled the hidden field: pretend success, send nothing.
      setStatus({
        kind: "success",
        result: { mode: "demo", contactId: "ignored", duplicate: false, tagsApplied: [], workflowAdded: false },
      });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/founding-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as LeadResult & { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus({ kind: "success", result: data });
      reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  });

  const large = size === "large";
  const inputClass = cn(fieldInputClass, large && "h-13");

  return (
    <div className={cn("relative", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {status.kind === "success" ? (
          <motion.div
            key="success"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start"
          >
            <span className="flex size-12 items-center justify-center rounded-full bg-olive text-cream">
              <Check className="size-5" strokeWidth={2.5} />
            </span>
            <h3 className="display-md mt-5">You&apos;re on the list!</h3>
            <p className="lede mt-2">We&apos;ll be in touch with the latest Core Mama updates.</p>
            {status.result.duplicate && (
              <p className="mt-3 font-sans text-sm text-espresso/70">
                Looks like you were already with us. We&apos;ve updated your details.
              </p>
            )}
            <ModeNote mode={status.result.mode}>
              {status.result.mode === "demo"
                ? "This was a demo submission and was not saved to a CRM. Once GoHighLevel is connected, this contact is created or updated, tagged CoreMama-FoundingMember, added to the launch workflow, and the signup source is recorded."
                : `Saved to the studio CRM${status.result.tagsApplied.length ? ` and tagged ${status.result.tagsApplied.join(", ")}` : ""}.`}
            </ModeNote>
            <Button variant="link" className="mt-6 text-sm" onClick={() => setStatus({ kind: "idle" })}>
              Add another person
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-5"
          >
            <input type="hidden" {...register("source")} />
            <Honeypot value={honey} onChange={setHoney} />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First name" htmlFor={`${source}-firstName`} error={errors.firstName?.message}>
                <Input
                  id={`${source}-firstName`}
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  className={inputClass}
                  {...register("firstName")}
                />
              </Field>
              <Field label="Last name" htmlFor={`${source}-lastName`} error={errors.lastName?.message}>
                <Input
                  id={`${source}-lastName`}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  className={inputClass}
                  {...register("lastName")}
                />
              </Field>
            </div>

            <Field label="Email address" htmlFor={`${source}-email`} error={errors.email?.message}>
              <Input
                id={`${source}-email`}
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={inputClass}
                {...register("email")}
              />
            </Field>

            <Field
              label="Phone number"
              htmlFor={`${source}-phone`}
              optional
              error={errors.phone?.message}
              hint="For text updates about opening day."
            >
              <Input
                id={`${source}-phone`}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                className={inputClass}
                {...register("phone")}
              />
            </Field>

            <Controller
              control={control}
              name="consent"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <label htmlFor={`${source}-consent`} className="flex cursor-pointer items-start gap-3">
                    <Checkbox
                      id={`${source}-consent`}
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                      aria-invalid={!!errors.consent}
                      className="mt-0.5 size-5 rounded-[3px] border-espresso/40 data-checked:border-espresso data-checked:bg-espresso"
                    />
                    <span className="font-sans text-[13px] leading-relaxed text-espresso/75">
                      Yes, send me Core Mama updates by email and text. I can unsubscribe at any time.
                    </span>
                  </label>
                  {errors.consent && (
                    <p role="alert" className="font-sans text-xs text-destructive">
                      {errors.consent.message}
                    </p>
                  )}
                </div>
              )}
            />

            {status.kind === "error" && (
              <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 font-sans text-sm text-destructive">
                {status.message}
              </p>
            )}

            <Button type="submit" size={large ? "xl" : "lg"} className="mt-1 w-full sm:w-auto" disabled={status.kind === "submitting"}>
              {status.kind === "submitting" ? "Adding you…" : "Join the Founding Member List"}
              <ArrowRight data-arrow />
            </Button>
            <p className="font-sans text-xs text-espresso/50">No spam. Just opening news, membership details, and early access.</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
