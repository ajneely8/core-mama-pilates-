"use client";

import { motion } from "framer-motion";
import { cn } from "cn";
import { EASE } from "./Reveal";

/**
 * Wipes an image in from the bottom as it scrolls into view, settles its
 * scale, and gives it a gentle zoom on hover.
 */
export function MediaReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        whileHover={{ scale: 1.035 }}
        transition={{ duration: 1.5, ease: EASE, delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
