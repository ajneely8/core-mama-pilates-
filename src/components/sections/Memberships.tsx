import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "cn";
import { memberships } from "@/config/memberships";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

export function Memberships() {
  if (!memberships.show) return null;
  const { tiers, currency } = memberships;

  return (
    <section id="memberships" className="scroll-mt-20 bg-ivory py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow">Memberships</p>
            </Reveal>
            <h2 className="display-lg mt-6">
              <Words text={memberships.headline} accentFrom={2} />
            </h2>
          </div>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <p className="lede">
              Every membership is a {memberships.sessionLength} on a reformer, as many times a month as your plan
              allows, with {memberships.childcare.name} childcare reservations built in.
            </p>
          </Reveal>
        </div>

        <RevealGroup role="list" className="mt-16 grid gap-3 md:grid-cols-5 md:gap-2">
          {tiers.map((t) => (
            <RevealItem
              key={t.id}
              role="listitem"
              className={cn(
                "group relative flex flex-col rounded-sm px-6 py-8 transition-[transform,box-shadow,background-color] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-30px_rgba(59,47,39,0.45)] md:px-5 md:py-9 lg:px-6",
                t.featured ? "bg-rose-deep text-cream" : "bg-cream text-espresso hover:bg-blush/50",
              )}
            >
              {t.badge && (
                <span className="absolute top-0 left-6 -translate-y-1/2 rounded-full bg-espresso px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.2em] text-cream uppercase md:left-5 lg:left-6">
                  {t.badge}
                </span>
              )}
              <h3 className="font-display text-2xl leading-tight">{t.name}</h3>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl leading-none tracking-tight">
                  {currency}
                  {t.price}
                </span>
                <span className={cn("font-sans text-xs", t.featured ? "text-cream/70" : "text-espresso/55")}>/month</span>
              </p>
              <ul className={cn("mt-6 space-y-2.5 font-sans text-[13.5px] leading-snug", t.featured ? "text-cream/90" : "text-espresso/80")}>
                <li>{t.sessions}</li>
                <li>{t.childcare}</li>
                {t.extras?.map((e) => (
                  <li key={e} className="font-semibold">
                    {e}
                  </li>
                ))}
              </ul>
              {t.note && <p className={cn("mt-4 font-sans text-xs", t.featured ? "text-cream/70" : "text-espresso/50")}>{t.note}</p>}
              <div className="mt-auto pt-8">
                <Button
                  size="sm"
                  variant={t.featured ? "cream" : "outline"}
                  className="w-full"
                  render={<Link href={t.featured ? "/founding-members" : "/#founding-members"} />}
                >
                  {t.featured ? "Claim a founding spot" : "Join the list"}
                </Button>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        <div className="mt-12 grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <p className="eyebrow">Every membership includes</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {memberships.includes.map((i) => (
                <li
                  key={i}
                  className="rounded-full border border-olive/30 bg-sage/25 px-3.5 py-1.5 font-sans text-[13px] text-espresso/85"
                >
                  {i}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-sans text-sm text-espresso/65">
              Up to 2 children per family per reservation. Reformer and childcare reservations are required for each
              visit.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
            <div className="rounded-sm bg-blush/60 p-6 sm:p-8">
              <p className="eyebrow text-rose-deep">{memberships.childcare.name} childcare</p>
              <p className="mt-4 font-display text-2xl">
                {currency}
                {memberships.childcare.oneChild} for one child · {currency}
                {memberships.childcare.twoChildren} for two
              </p>
              <p className="mt-2 font-sans text-sm text-espresso/70">
                Ages {memberships.childcare.ages}. {memberships.childcare.note}
              </p>
              {memberships.grandOpening.show && (
                <p className="mt-5 border-t border-espresso/10 pt-4 font-sans text-sm text-espresso/80">
                  <span className="font-semibold">Grand opening bonus.</span> {memberships.grandOpening.bonus}
                </p>
              )}
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-espresso/50">
            Membership details as announced by the studio; subject to confirmation before opening.
          </p>
          <Button variant="link" render={<Link href="/book?type=studio-tour" />}>
            See the studio first <ArrowRight data-arrow />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
