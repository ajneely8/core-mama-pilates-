import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { site } from "@/config/site";
import { memberships } from "@/config/memberships";
import { foundingFaq } from "@/content/faq";
import { Button } from "@/components/ui/button";
import { FoundingMemberForm } from "@/components/forms/FoundingMemberForm";
import { MediaSlot } from "@/components/layout/MediaSlot";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Marquee } from "@/components/motion/Marquee";
import { Faq } from "@/components/sections/Faq";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

export const metadata: Metadata = {
  title: "Founding Members",
  description:
    "Join the Core Mama Pilates founding member list and be first to hear about our opening, membership details, and early access.",
  alternates: { canonical: "/founding-members" },
};

const PERKS = ["Opening day news, first", "Membership details before they go public", "Early access when the doors open"];

export default function FoundingMembersPage() {
  const founding = memberships.show ? memberships.tiers.find((t) => t.featured) : undefined;
  return (
    <>
      <section className="bg-blush/50 pt-[76px]">
        <div className="container-x grid gap-12 py-12 lg:grid-cols-12 lg:gap-10 lg:py-20">
          <div className="lg:col-span-6">
            <Reveal>
              <p className="eyebrow text-rose-deep">Founding members · {site.address.city}</p>
            </Reveal>
            <h1 className="display-xl mt-6">
              <Words text="Be Part of" />
              <br />
              <Words text="the Beginning." accentFrom={1} />
            </h1>
            <Reveal delay={0.08}>
              <p className="lede mt-7 max-w-lg">
                Core Mama Pilates is a self-guided reformer studio with on-site childcare, opening soon in{" "}
                {site.address.city}. Join the founding member list and be first to hear about our opening, membership
                details, and early access.
              </p>
            </Reveal>
            <RevealGroup role="list" className="mt-8 space-y-3">
              {PERKS.map((p) => (
                <RevealItem key={p} role="listitem" className="flex items-center gap-3 font-sans text-[15px] text-espresso/80">
                  <span className="size-1.5 rounded-full bg-rose-deep" />
                  {p}
                </RevealItem>
              ))}
            </RevealGroup>
            {founding && (
              <Reveal delay={0.1}>
                <div className="mt-8 inline-block rounded-sm bg-rose-deep px-5 py-4 text-cream">
                  <p className="font-display text-xl">
                    {founding.name} · {memberships.currency}
                    {founding.price}/month
                  </p>
                  <p className="mt-1 font-sans text-sm text-cream/85">
                    {founding.sessions}. {founding.extras?.join(". ")}.
                  </p>
                </div>
              </Reveal>
            )}
            <Reveal delay={0.14}>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 font-sans text-sm font-medium text-espresso/75 transition-colors hover:text-espresso"
              >
                <Instagram className="size-4" /> Follow along @{site.instagram.handle}
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-6">
            <div className="rounded-sm border border-espresso/10 bg-ivory p-6 shadow-[0_30px_60px_-40px_rgba(59,47,39,0.4)] sm:p-10">
              <h2 className="font-display text-2xl">Join the founding member list</h2>
              <p className="mt-1 mb-8 font-sans text-sm text-espresso/60">Free to join. Unsubscribe any time.</p>
              <FoundingMemberForm source="landing-page" size="large" />
            </div>
          </Reveal>
        </div>
      </section>

      <Marquee
        tone="rose"
        items={["Self-guided reformer Pilates", "CoreNest childcare", "Only 10 founding spots", "Rate locked while active", "Yuba City"]}
      />

      <section className="container-x grid items-center gap-10 pt-16 lg:grid-cols-12 lg:pt-24">
        <MediaReveal className="mx-auto w-full max-w-sm lg:col-span-5 lg:max-w-none">
          <MediaSlot id="landing" className="aspect-[3/4] w-full" sizes="(min-width: 1024px) 40vw, 90vw" />
        </MediaReveal>
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow">In the studio&apos;s words</p>
          <h2 className="display-lg mt-6">
            <Words text="Wellness designed for real life." accentFrom={3} />
          </h2>
          <p className="lede mt-7 max-w-lg">
            Flexible scheduling, a non-intimidating environment, integrated childcare, self-guided reformer Pilates,
            and all levels welcome. That is the CoreMama experience, and founding members see it first.
          </p>
        </Reveal>
      </section>

      <Faq items={foundingFaq} eyebrow="Good to know" title="A few quick answers." compact />

      <section className="container-x pb-24">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 rounded-sm bg-sage/25 p-8 md:flex-row md:items-center md:p-10">
            <div>
              <h2 className="display-md">Prefer to see the studio first?</h2>
              <p className="mt-2 font-sans text-[15px] text-espresso/65">
                Book a short tour and we&apos;ll walk you through how it all works.
              </p>
            </div>
            <Button size="lg" render={<Link href="/book?type=studio-tour" />}>
              Book a studio tour <ArrowRight data-arrow />
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
