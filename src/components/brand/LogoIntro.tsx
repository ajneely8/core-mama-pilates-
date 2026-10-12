"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { cn } from "cn";
import { brand } from "@/config/brand";
import { useIntro } from "./intro-context";
import { Wordmark } from "./Wordmark";
import { LeafMark } from "./LeafMark";

/**
 * Logo reveal: the mark wipes in, the wordmark is stroke-drawn and fills, the
 * descriptor follows, then the curtain lifts into the hero. ~2.5s, click/tap
 * to skip. Plays on every load of the homepage and whenever the logo in the
 * nav is pressed; collapses to a short fade under prefers-reduced-motion.
 */
export function LogoIntro() {
  const { start, finish } = useIntro();
  const reduce = useReducedMotion() ?? false;
  const [state, setState] = useState<"draw" | "done">("draw");

  const complete = useCallback(() => {
    setState("done");
    finish();
  }, [finish]);

  useEffect(() => {
    start();
    const t = setTimeout(complete, reduce ? 1100 : 2550);
    return () => clearTimeout(t);
  }, [start, reduce, complete]);

  // Keep the page from scrolling under the curtain.
  useEffect(() => {
    if (state !== "draw") return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [state]);

  return (
    <AnimatePresence>
      {state === "draw" && (
        <motion.div
          key="intro"
          role="presentation"
          onClick={complete}
          className="fixed inset-0 z-[60] flex cursor-pointer flex-col items-center justify-center bg-cream text-espresso"
          initial={{ opacity: 1 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.4 } }
              : { y: "-100%", transition: { duration: 0.95, ease: [0.76, 0, 0.24, 1] } }
          }
        >
          <div className="flex w-[min(74vw,560px)] flex-col items-center">
            <div className={cn("mb-6 text-olive", brand.logo.markOfficial ? "w-24 sm:w-28" : "w-10")}>
              <LeafMark animate fadeOnly={reduce} delay={reduce ? 0.1 : 0.15} />
            </div>
            <Wordmark animate fadeOnly={reduce} strokeWidth={9} />
            <motion.p
              className="mt-3 text-center font-sans text-[11px] font-semibold tracking-[0.5em] text-espresso/80 sm:text-xs"
              style={{ marginRight: "-0.5em" }}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0.2 : 1.55, duration: 0.6 }}
            >
              {brand.logo.descriptor}
            </motion.p>
          </div>
          <motion.span
            className="absolute bottom-8 font-sans text-[10px] tracking-[0.3em] text-espresso/40 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Tap to skip
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
