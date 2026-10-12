"use client";

import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Baby, CalendarDays, Headphones, HeartHandshake, MapPin, Sparkles } from "lucide-react";
import { media } from "@/config/media";
import { site } from "@/config/site";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { Button } from "@/components/ui/button";
import { useIntro } from "@/components/brand/intro-context";
import { EASE } from "@/components/motion/Reveal";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.5 } },
};
const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};
const backdrop: Variants = {
  hidden: { opacity: 0, scale: 1.03 },
  show: { opacity: 1, scale: 1, transition: { duration: 1.8, ease: EASE } },
};

export type HeroImageProps = { src: string; width: number; height: number };

/** The studio's four pillars, from its own "Coming Soon" post. */
const PILLARS = [
  { icon: Headphones, label: "Self-guided reformer Pilates" },
  { icon: CalendarDays, label: "Flexible scheduling" },
  { icon: Baby, label: "Childcare-centered concept" },
  { icon: HeartHandshake, label: "Wellness for every stage" },
];

/**
 * Front page. The studio's CoreNest graphic is shown WHOLE, zoomed out to the
 * screen height and centred on the plain page cream, with nothing drawn over
 * it and nothing synthesised around it.
 *
 * On wide screens (16:9 and wider, the `wide:` variant) the cream either side
 * carries the content: the two buttons with the soft-opening details on the
 * LEFT, the studio's four pillars and the Instagram link on the RIGHT. On
 * squarer desktop screens, where there is no room beside the poster, the
 * poster is shortened by a strip and the buttons sit centred in that strip.
 * On phones the graphic shows whole at full width with the buttons below.
 *
 * `image` comes from src/lib/hero-image.ts: drop a higher-resolution original
 * at public/photos/corenest-hero.(png|jpg) and it is picked up automatically.
 */
export function Hero({ image }: { image: HeroImageProps }) {
  const { done } = useIntro();
  const state = done ? "show" : "hidden";
  const vars = { "--hero-aspect": `${image.width} / ${image.height}` } as CSSProperties;
  const so = site.softOpening;

  return (
    <section
      className="relative isolate overflow-hidden bg-cream pt-[76px] lg:h-[100svh] lg:min-h-[640px] lg:pt-0"
      style={vars}
    >
      <motion.div
        aria-hidden
        className="relative aspect-[var(--hero-aspect)] w-full lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-28 lg:-z-10 lg:aspect-auto wide:bottom-0"
        initial="hidden"
        animate={state}
        variants={backdrop}
      >
        {/* Served untouched: no optimizer re-encode or resize, so every source pixel survives. */}
        <Image
          src={image.src}
          alt={media.hero.alt}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 100vh, 100vw"
          className="object-contain object-center"
        />
      </motion.div>

      {/* LEFT: buttons (+ soft-opening details on wide screens). */}
      <motion.div
        className="container-x flex flex-wrap items-center gap-3 py-10 lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-28 lg:flex-nowrap lg:justify-center lg:py-0 wide:inset-auto wide:top-1/2 wide:left-10 wide:h-auto wide:w-[calc(50vw-50svh-5rem)] wide:min-w-[13rem] wide:-translate-y-1/2 wide:flex-col wide:items-start wide:justify-start wide:gap-3 wide:px-0"
        initial="hidden"
        animate={state}
        variants={container}
      >
        <motion.div variants={fade}>
          <Button size="lg" render={<Link href="/book" />}>
            Book a Session <ArrowRight data-arrow />
          </Button>
        </motion.div>
        <motion.div variants={fade}>
          <Button size="lg" variant="rose" render={<Link href="/founding-members" />}>
            Become a Founding Member
          </Button>
        </motion.div>
        {so.show && (
          <motion.div variants={fade} className="hidden wide:block wide:mt-6">
            <p className="eyebrow text-rose-deep">Soft opening</p>
            <ul className="mt-3 space-y-2 font-sans text-[13px] leading-snug text-espresso/80">
              <li className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 size-3.5 shrink-0 text-olive" strokeWidth={1.5} />
                <span>
                  {so.dateLabel} · {so.timeLabel}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-olive" strokeWidth={1.5} />
                <span>
                  {site.address.line1}, {site.address.city}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="mt-0.5 size-3.5 shrink-0 text-olive" strokeWidth={1.5} />
                <span>{so.note}</span>
              </li>
            </ul>
          </motion.div>
        )}
      </motion.div>

      {/* RIGHT (wide screens only): the studio's pillars + Instagram. */}
      <motion.div
        className="absolute top-1/2 right-10 hidden w-[calc(50vw-50svh-5rem)] min-w-[13rem] -translate-y-1/2 flex-col wide:flex"
        initial="hidden"
        animate={state}
        variants={container}
      >
        <motion.p variants={fade} className="eyebrow">
          {site.shortName} is
        </motion.p>
        <ul className="mt-4 space-y-3.5">
          {PILLARS.map((p) => (
            <motion.li key={p.label} variants={fade} className="flex items-center gap-3 font-sans text-[14px] text-espresso/85">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-olive/30 text-olive">
                <p.icon className="size-4" strokeWidth={1.5} />
              </span>
              {p.label}
            </motion.li>
          ))}
        </ul>
        <motion.a
          variants={fade}
          href={site.instagram.url}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex items-center gap-2 font-sans text-[13px] font-medium text-espresso/75 transition-colors hover:text-espresso"
        >
          <InstagramIcon className="size-4" /> @{site.instagram.handle}
        </motion.a>
      </motion.div>
    </section>
  );
}
