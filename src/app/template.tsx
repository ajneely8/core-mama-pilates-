"use client";

import { motion } from "framer-motion";

/** Page transition: a quiet fade on every route change. Opacity only, so
 *  fixed-position children (the logo intro) are never trapped in a transform. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
