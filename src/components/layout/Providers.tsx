"use client";

import { MotionConfig } from "framer-motion";
import { IntroProvider } from "@/components/brand/intro-context";

/** Global motion settings (honours prefers-reduced-motion) + intro state. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <IntroProvider>{children}</IntroProvider>
    </MotionConfig>
  );
}
