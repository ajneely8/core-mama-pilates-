import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { memberships } from "@/config/memberships";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { MediaSlot } from "@/components/layout/MediaSlot";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

/** CoreNest: the studio's on-site childcare, in its own warm band. */
export function Childcare() {
  const c = site.amenities.childcare;
  if (c.status === "none") return null;
  const price = memberships.childcare;
  const facts = [
    `Ages ${c.ages}`,
    `${memberships.currency}${price.oneChild} for one child · ${memberships.currency}${price.twoChildren} for two`,
    "Reservations required",
    "Up to 2 children per family per visit",
  ];

  return (
    <section id="childcare" className="scroll-mt-20 overflow-hidden bg-blush/60 py-24 md:py-32">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <MediaReveal className="mx-auto w-full max-w-md lg:col-span-6 lg:max-w-lg">
          <MediaSlot id="childcare" className="aspect-square w-full" sizes="(min-width: 1024px) 44vw, 90vw" />
        </MediaReveal>
        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="eyebrow text-rose-deep">{c.name} childcare</p>
          </Reveal>
          <h2 className="display-lg mt-6">
            <Words text="Little ones, cared for." accentFrom={2} />
          </h2>
          <Reveal delay={0.08}>
            <p className="lede mt-7">
              Thoughtful care for little ones while you move, breathe, and recharge. {c.name} sits a few steps from
              the reformers, so your hour is really yours.
            </p>
          </Reveal>
          <RevealGroup role="list" className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((f) => (
              <RevealItem
                key={f}
                role="listitem"
                className="rounded-sm bg-ivory/70 px-4 py-3 font-sans text-sm text-espresso/85"
              >
                {f}
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal delay={0.1} className="mt-8">
            <Button variant="rose" render={<Link href="/book" />}>
              Book with childcare <ArrowRight data-arrow />
            </Button>
            <p className="mt-3 font-sans text-xs text-espresso/55">
              {c.status === "confirmed" ? "Details as announced by the studio; confirm before opening." : c.note}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
