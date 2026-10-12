import Link from "next/link";
import { memberships } from "@/config/memberships";
import { FoundingMemberForm } from "@/components/forms/FoundingMemberForm";
import { MediaSlot } from "@/components/layout/MediaSlot";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

const PERKS = ["First to hear about opening day", "Membership details before anyone else", "Early access when doors open"];

export function FoundingMember() {
  const founding = memberships.show ? memberships.tiers.find((t) => t.featured) : undefined;
  return (
    <section id="founding-members" className="scroll-mt-20 bg-sand/35 py-24 md:py-32">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-rose-deep">Founding members</p>
          </Reveal>
          <h2 className="display-lg mt-6">
            <Words text="Be Part of the Beginning." accentFrom={3} />
          </h2>
          <Reveal delay={0.08}>
            <p className="lede mt-7">
              Join the Core Mama Pilates founding member list and be first to hear about our opening, membership
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
              <div className="mt-8 rounded-sm bg-rose-deep p-5 text-cream">
                <p className="font-display text-xl">
                  {founding.name} · {memberships.currency}
                  {founding.price}/month
                </p>
                <p className="mt-1 font-sans text-sm leading-relaxed text-cream/85">
                  {founding.sessions}. {founding.extras?.join(". ")}.{" "}
                  <Link href="/#memberships" className="text-cream underline underline-offset-4">
                    See all memberships
                  </Link>
                </p>
              </div>
            </Reveal>
          )}
          <Reveal delay={0.14}>
            <p className="mt-6 font-sans text-sm text-espresso/55">
              Sharing with a friend?{" "}
              <Link href="/founding-members" className="text-espresso underline underline-offset-4">
                Send them the founding member page
              </Link>
              .
            </p>
          </Reveal>
          <MediaReveal className="mt-10 hidden lg:block" delay={0.1}>
            <MediaSlot id="founding" className="aspect-[5/4] w-full" sizes="(min-width: 1024px) 40vw, 100vw" />
          </MediaReveal>
        </div>

        <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
          <div className="rounded-sm border border-espresso/10 bg-ivory p-7 shadow-[0_30px_60px_-40px_rgba(59,47,39,0.35)] sm:p-10">
            <h3 className="font-display text-2xl">Join the list</h3>
            <p className="mt-1 mb-8 font-sans text-sm text-espresso/60">Takes about twenty seconds.</p>
            <FoundingMemberForm source="homepage" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
