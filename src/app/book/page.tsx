import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/config/site";
import { BookingWizardFromParams, WizardSkeleton } from "@/components/booking/BookingWizardFromParams";

export const metadata: Metadata = {
  title: "Book a Session",
  description: `Reserve a self-guided reformer session at ${site.name}. Choose a session, pick a time that fits, and the reformer is yours.`,
  alternates: { canonical: "/book" },
};

export default function BookPage() {
  return (
    <>
      <section className="pt-[76px]">
        <div className="container-x py-12 md:py-16">
          <p className="eyebrow">Reserve your reformer</p>
          <h1 className="display-lg mt-5">Book a session.</h1>
          <p className="lede mt-5 max-w-xl">
            Choose a session, pick a time that fits, and the reformer is yours. Takes about a minute.
          </p>
        </div>
      </section>
      <section className="container-x pb-24 md:pb-32">
        <Suspense fallback={<WizardSkeleton />}>
          <BookingWizardFromParams />
        </Suspense>
      </section>
    </>
  );
}
