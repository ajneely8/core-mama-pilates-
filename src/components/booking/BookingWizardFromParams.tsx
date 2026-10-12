"use client";

import { useSearchParams } from "next/navigation";
import { BookingWizard } from "./BookingWizard";

/** Reads ?type=… so CTAs can deep-link into a booking type. */
export function BookingWizardFromParams() {
  const params = useSearchParams();
  return <BookingWizard initialTypeId={params.get("type") ?? undefined} />;
}

export function WizardSkeleton() {
  return (
    <div aria-hidden className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="h-4 w-48 animate-pulse rounded bg-espresso/10" />
        <div className="mt-8 space-y-px border-t border-espresso/10">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse border-b border-espresso/10 bg-espresso/[0.03]" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4">
        <div className="h-56 animate-pulse border border-espresso/10 bg-espresso/[0.03]" />
      </div>
    </div>
  );
}
