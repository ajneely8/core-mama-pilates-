"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import type { AvailabilityResult } from "@/lib/ghl/types";

type Status = "idle" | "loading" | "ready" | "error";

type Outcome =
  | { kind: "ready"; key: string; data: AvailabilityResult }
  | { kind: "error"; key: string; message: string };

/** Fetches open slots for a booking type; `refresh()` re-pulls after a conflict. */
export function useAvailability(typeId: string | null) {
  const [tick, setTick] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const key = typeId ? `${typeId}#${tick}` : null;

  useEffect(() => {
    if (!typeId || !key) return;
    const ctrl = new AbortController();
    fetch(`/api/booking/availability?typeId=${encodeURIComponent(typeId)}`, { signal: ctrl.signal })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error ?? "Could not load availability");
        return json as AvailabilityResult;
      })
      .then((data) => setOutcome({ kind: "ready", key, data }))
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setOutcome({ kind: "error", key, message: e instanceof Error ? e.message : "Could not load availability" });
      });
    return () => ctrl.abort();
  }, [typeId, key]);

  const current = outcome && outcome.key === key ? outcome : null;
  const status: Status = !key ? "idle" : !current ? "loading" : current.kind;
  const data = current?.kind === "ready" ? current.data : null;
  const error = current?.kind === "error" ? current.message : null;

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  return { data, status, error, refresh };
}

const noopSubscribe = () => () => {};

/** The visitor's IANA zone; null during server render and hydration. */
export function useVisitorTimeZone() {
  return useSyncExternalStore(
    noopSubscribe,
    () => {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      } catch {
        return "UTC";
      }
    },
    () => null,
  );
}
