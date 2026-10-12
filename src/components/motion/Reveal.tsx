"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "cn";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

const groupVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;

/** Subtle scroll reveal, fires once. */
export function Reveal({
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
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{
        hidden: revealVariants.hidden,
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Parent that staggers its <RevealItem> children. */
export function RevealGroup({
  children,
  className,
  role,
}: {
  children: React.ReactNode;
  className?: string;
  role?: string;
}) {
  return (
    <motion.div
      role={role}
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={groupVariants}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  role,
}: {
  children: React.ReactNode;
  className?: string;
  role?: string;
}) {
  return (
    <motion.div role={role} className={className} variants={revealVariants}>
      {children}
    </motion.div>
  );
}

/** Thin rule that draws itself in on scroll. */
export function RuleReveal({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      className={cn("h-px w-full origin-left bg-espresso/15", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, ease: EASE }}
    />
  );
}
