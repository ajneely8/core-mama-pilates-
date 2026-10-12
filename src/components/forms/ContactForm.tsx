"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, Honeypot, ModeNote, fieldInputClass, fieldTextareaClass } from "@/components/forms/Field";
import { contactSchema, type ContactInput } from "@/lib/validation/schemas";
import type { ContactMessageResult } from "@/lib/ghl/types";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; result: ContactMessageResult }
  | { kind: "error"; message: string };

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honey, setHoney] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (honey) {
      setStatus({ kind: "success", result: { mode: "demo", id: "ignored" } });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as ContactMessageResult & { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus({ kind: "success", result: data });
      reset();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong" });
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status.kind === "success" ? (
        <motion.div
          key="ok"
          role="status"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-start"
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-olive text-cream">
            <Check className="size-5" strokeWidth={2.5} />
          </span>
          <h3 className="display-md mt-5">Thank you.</h3>
          <p className="lede mt-2">We&apos;ve received your message and will get back to you soon.</p>
          <ModeNote mode={status.result.mode}>
            {status.result.mode === "demo"
              ? "This was a demo submission; no message was delivered. Once GoHighLevel is connected, messages create a contact note and trigger the studio's notification workflow."
              : "Delivered to the studio."}
          </ModeNote>
          <Button variant="link" className="mt-6 text-sm" onClick={() => setStatus({ kind: "idle" })}>
            Send another message
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
          <Honeypot value={honey} onChange={setHoney} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" htmlFor="contact-name" error={errors.name?.message}>
              <Input id="contact-name" autoComplete="name" aria-invalid={!!errors.name} className={fieldInputClass} {...register("name")} />
            </Field>
            <Field label="Email" htmlFor="contact-email" error={errors.email?.message}>
              <Input
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={fieldInputClass}
                {...register("email")}
              />
            </Field>
          </div>
          <Field label="Message" htmlFor="contact-message" error={errors.message?.message}>
            <Textarea
              id="contact-message"
              aria-invalid={!!errors.message}
              className={fieldTextareaClass}
              placeholder="Ask about sessions, memberships, childcare, or anything else."
              {...register("message")}
            />
          </Field>
          {status.kind === "error" && (
            <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 font-sans text-sm text-destructive">
              {status.message}
            </p>
          )}
          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status.kind === "submitting"}>
            {status.kind === "submitting" ? "Sending…" : "Send message"}
            <ArrowRight data-arrow />
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
