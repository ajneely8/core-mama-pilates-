"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, fieldInputClass, fieldTextareaClass } from "@/components/forms/Field";
import { bookingDetailsSchema, type BookingDetailsInput } from "@/lib/validation/schemas";

export function DetailsForm({
  defaultValues,
  onSubmit,
  onBack,
}: {
  defaultValues?: BookingDetailsInput | null;
  onSubmit: (values: BookingDetailsInput) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingDetailsInput>({
    resolver: zodResolver(bookingDetailsSchema),
    defaultValues: defaultValues ?? { fullName: "", email: "", phone: "", childcare: "0", notes: "" },
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex max-w-xl flex-col gap-5">
      <Field label="Full name" htmlFor="bk-name" error={errors.fullName?.message}>
        <Input id="bk-name" autoComplete="name" aria-invalid={!!errors.fullName} className={fieldInputClass} {...register("fullName")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="bk-email" error={errors.email?.message}>
          <Input
            id="bk-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className={fieldInputClass}
            {...register("email")}
          />
        </Field>
        <Field label="Phone number" htmlFor="bk-phone" error={errors.phone?.message} hint="For reminders about your session.">
          <Input
            id="bk-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            className={fieldInputClass}
            {...register("phone")}
          />
        </Field>
      </div>
      <Field
        label="Childcare (CoreNest)"
        htmlFor="bk-childcare"
        error={errors.childcare?.message}
        hint="Ages 6 months to 6 years. $8 for one child, $10 for two. Reservations required."
      >
        <div className="relative">
          <select
            id="bk-childcare"
            aria-invalid={!!errors.childcare}
            className={cn(fieldInputClass, "w-full appearance-none pr-10")}
            {...register("childcare")}
          >
            <option value="0">No childcare needed</option>
            <option value="1">1 child</option>
            <option value="2">2 children</option>
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-espresso/50" />
        </div>
      </Field>
      <Field label="Notes" htmlFor="bk-notes" optional error={errors.notes?.message}>
        <Textarea
          id="bk-notes"
          aria-invalid={!!errors.notes}
          className={fieldTextareaClass}
          placeholder="Anything we should know? First visit, injuries, bringing a little one."
          {...register("notes")}
        />
      </Field>
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="link" onClick={onBack} className="self-start">
          Back
        </Button>
        <Button type="submit" size="lg">
          Review reservation <ArrowRight data-arrow />
        </Button>
      </div>
    </form>
  );
}
