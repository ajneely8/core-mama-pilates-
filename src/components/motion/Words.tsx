"use client";

import { motion } from "framer-motion";
import { cn } from "cn";
import { EASE } from "./Reveal";

/** Reveals a heading word by word (each word slides up from a clipped line). */
export function Words({
  text,
  className,
  accentFrom,
  accentClassName = "italic font-normal text-rose-deep",
}: {
  text: string;
  className?: string;
  /** Index of the first word to render with the accent style. */
  accentFrom?: number;
  accentClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      className={cn("inline", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
          <motion.span
            className={cn("inline-block", accentFrom !== undefined && i >= accentFrom && accentClassName)}
            variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: EASE } } }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
