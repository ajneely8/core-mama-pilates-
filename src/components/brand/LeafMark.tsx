"use client";

import { motion } from "framer-motion";
import { cn } from "cn";
import { brand } from "@/config/brand";

/* Brand mark.
   - When `brand.logo.markOfficial` is true the studio's own mark is shown
     (raster or SVG file at brand.logo.markSrc). Animated variants reveal it
     with a soft mask wipe, since a bitmap cannot be stroke-drawn.
   - Otherwise a PROVISIONAL leaf flourish echoes the sprig in the real logo
     without redrawing the mother-and-baby illustration. */

const STEM = "M50 96 C47 72 53 48 50 14";
const LEAVES = [
  "M49 70 C40 68 32 60 31 50 C41 51 48 58 49 70 Z",
  "M51 56 C60 54 68 46 69 36 C59 37 52 44 51 56 Z",
  "M49 42 C40 40 33 32 32 22 C42 23 48 30 49 42 Z",
  "M51 84 C60 82 68 74 69 64 C59 65 52 72 51 84 Z",
  "M50 14 C44 10 44 2 50 0 C56 2 56 10 50 14 Z",
];
const HEART = "M84 76 C81 70 72 73 76 80 L84 88 L92 80 C96 73 87 70 84 76 Z";

type Props = { className?: string; animate?: boolean; fadeOnly?: boolean; delay?: number };

const lineProps = { strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function OfficialMark({ className, animate, fadeOnly, delay }: Props) {
  const src = brand.logo.markSrc;
  const common = { src, draggable: false, className: cn("block h-auto w-full", className) };
  if (!animate) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...common} alt="" />;
  }
  if (fadeOnly) {
    return (
      <motion.img
        {...common}
        alt=""
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay }}
      />
    );
  }
  return (
    <motion.img
      {...common}
      alt=""
      initial={{ clipPath: "circle(0% at 50% 50%)", opacity: 0.6, scale: 1.06 }}
      animate={{ clipPath: "circle(50% at 50% 50%)", opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

export function LeafMark({ className, animate = false, fadeOnly = false, delay = 0 }: Props) {
  if (brand.logo.markOfficial) {
    return <OfficialMark className={className} animate={animate} fadeOnly={fadeOnly} delay={delay} />;
  }

  if (!animate || fadeOnly) {
    const Svg = animate ? motion.svg : "svg";
    const anim = animate ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, delay } } : {};
    return (
      <Svg viewBox="0 0 100 100" className={cn("block", className)} aria-hidden {...anim}>
        <path d={STEM} fill="none" stroke="currentColor" strokeWidth={2.2} {...lineProps} />
        {LEAVES.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
        <path d={HEART} fill="var(--color-rose)" />
      </Svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={cn("block overflow-visible", className)} aria-hidden>
      <motion.path
        d={STEM}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        {...lineProps}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.9, ease: "easeInOut" }}
      />
      {LEAVES.map((d, i) => (
        <motion.path
          key={i}
          d={d}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={1.6}
          {...lineProps}
          initial={{ pathLength: 0, fillOpacity: 0 }}
          animate={{ pathLength: 1, fillOpacity: 1 }}
          transition={{
            pathLength: { delay: delay + 0.35 + i * 0.12, duration: 0.55, ease: "easeInOut" },
            fillOpacity: { delay: delay + 0.7 + i * 0.12, duration: 0.4 },
          }}
        />
      ))}
      <motion.path
        d={HEART}
        fill="var(--color-rose)"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ transformOrigin: "84px 80px" }}
        transition={{ delay: delay + 1.25, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </svg>
  );
}
