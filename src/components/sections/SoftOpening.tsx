import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Words } from "@/components/motion/Words";

export function SoftOpening() {
  const so = site.softOpening;
  if (!so.show) return null;
  return (
    <section aria-labelledby="soft-opening" className="bg-blush">
      <div className="container-x grid gap-8 py-14 md:grid-cols-12 md:items-center md:py-16">
        <Reveal className="md:col-span-5">
          <p className="eyebrow text-rose-deep">Soft opening</p>
          <h2 id="soft-opening" className="display-md mt-4">
            <Words text="Come see how CoreMama works." accentFrom={4} />
          </h2>
          <ul className="mt-5 space-y-2 font-sans text-[15px] text-espresso/85">
            <li className="flex items-center gap-2.5">
              <CalendarDays className="size-4 text-rose-deep" strokeWidth={1.5} /> {so.dateLabel} · {so.timeLabel}
            </li>
            <li className="flex items-center gap-2.5">
              <MapPin className="size-4 text-rose-deep" strokeWidth={1.5} /> {site.address.line1}, {site.address.city}
            </li>
          </ul>
        </Reveal>
        <RevealGroup className="md:col-span-4 md:col-start-7">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 font-sans text-sm text-espresso/80">
            {so.bullets.map((b) => (
              <RevealItem key={b} role="listitem" className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-rose-deep" /> {b}
              </RevealItem>
            ))}
          </ul>
          <RevealItem className="mt-4 font-display text-lg italic text-espresso/80">{so.note}</RevealItem>
        </RevealGroup>
        <Reveal delay={0.14} className="md:col-span-2 md:justify-self-end">
          <Button variant="rose" render={<Link href="/founding-members" />}>
            Join the list <ArrowRight data-arrow />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
