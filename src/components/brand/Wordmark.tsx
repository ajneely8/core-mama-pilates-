"use client";

import { motion } from "framer-motion";
import { cn } from "cn";
import { brand } from "@/config/brand";
import { WORDMARK } from "./wordmark-paths";

/* The wordmark is real vector type (Cormorant Garamond, traced by
   scripts/make-wordmark.mjs), so it can be stroke-drawn and renders crisply at
   any size. It is two-tone like the sign on the studio wall: "Core" in
   espresso, "Mama" in dusty rose. Replace the traced paths with the studio's
   official outlines when they arrive — same file, same shape. */

const VIEW_TOP = -700;
const VIEW_H = 760;
const SPLIT = 4; // "Core" | "Mama"

type Props = {
  className?: string;
  /** Stroke-draw the letters, then fill. */
  animate?: boolean;
  /** Fade only (reduced motion). */
  fadeOnly?: boolean;
  /** Force a single colour (currentColor). */
  mono?: boolean;
  strokeWidth?: number;
  title?: string;
};

export function Wordmark({
  className,
  animate = false,
  fadeOnly = false,
  mono = false,
  strokeWidth = 9,
  title = "CoreMama",
}: Props) {
  const twoTone = brand.logo.wordmarkTwoTone && !mono;
  const colorFor = (i: number) => (twoTone && i >= SPLIT ? "var(--color-rose-deep)" : "currentColor");

  return (
    <svg
      viewBox={`-20 ${VIEW_TOP} ${WORDMARK.width + 40} ${VIEW_H}`}
      className={cn("block h-auto w-full overflow-visible", className)}
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      {WORDMARK.glyphs.map((g, i) => {
        const color = colorFor(i);
        if (!animate) return <path key={i} d={g.d} fill={color} />;
        if (fadeOnly) {
          return (
            <motion.path
              key={i}
              d={g.d}
              fill={color}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
          );
        }
        return (
          <motion.path
            key={i}
            d={g.d}
            fill={color}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0, fillOpacity: 0, strokeOpacity: 1 }}
            animate={{ pathLength: 1, fillOpacity: 1, strokeOpacity: 0 }}
            transition={{
              pathLength: { delay: i * 0.11, duration: 1.05, ease: "easeInOut" },
              fillOpacity: { delay: 1.25 + i * 0.05, duration: 0.65, ease: "easeOut" },
              strokeOpacity: { delay: 1.95, duration: 0.5 },
            }}
          />
        );
      })}
    </svg>
  );
}
