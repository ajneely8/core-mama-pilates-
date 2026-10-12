"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type IntroState = {
  /** True once the curtain has lifted; the hero waits for this. */
  done: boolean;
  /** Increments every time the intro should play again (logo click). */
  run: number;
  start: () => void;
  finish: () => void;
  replay: () => void;
};

const IntroContext = createContext<IntroState>({
  done: true,
  run: 0,
  start: () => {},
  finish: () => {},
  replay: () => {},
});

/** Lives in the root layout. The intro plays on every load of the homepage and
 *  again whenever `replay()` is called (the logo in the top-left). */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  const start = useCallback(() => setDone(false), []);
  const finish = useCallback(() => setDone(true), []);
  const replay = useCallback(() => {
    setDone(false);
    setRun((r) => r + 1);
  }, []);
  const value = useMemo(() => ({ done, run, start, finish, replay }), [done, run, start, finish, replay]);

  // Exposed for styling hooks and debugging (data-intro-done on <html>).
  useEffect(() => {
    document.documentElement.dataset.introDone = String(done);
  }, [done]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
