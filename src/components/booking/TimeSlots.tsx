"use client";

import { cn } from "cn";
import type { Slot } from "@/lib/ghl/types";
import { formatTime, tzParts } from "@/lib/time";

function period(iso: string, tz: string) {
  const h = tzParts(new Date(iso).getTime(), tz).hour;
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

export function TimeSlots({
  slots,
  tz,
  selected,
  onSelect,
}: {
  slots: Slot[];
  tz: string;
  selected: Slot | null;
  onSelect: (s: Slot) => void;
}) {
  const groups = new Map<string, Slot[]>();
  for (const s of slots) {
    const p = period(s.start, tz);
    groups.set(p, [...(groups.get(p) ?? []), s]);
  }
  if (!slots.length) {
    return <p className="font-sans text-sm text-espresso/60">No times left on this day. Try another date.</p>;
  }
  return (
    <div className="space-y-8">
      {[...groups.entries()].map(([label, list]) => (
        <div key={label}>
          <p className="eyebrow">{label}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {list.map((s) => {
              const isSelected = selected?.start === s.start;
              const low = typeof s.remaining === "number" && s.remaining <= 1;
              return (
                <button
                  key={s.start}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(s)}
                  className={cn(
                    "flex h-12 flex-col items-center justify-center rounded-full border font-sans text-sm transition-all duration-200",
                    isSelected
                      ? "border-espresso bg-espresso text-cream"
                      : "border-espresso/20 bg-ivory text-espresso hover:border-espresso",
                  )}
                >
                  <span className="tabular-nums">{formatTime(s.start, tz)}</span>
                  {low && !isSelected && <span className="text-[10px] leading-none text-rose-deep">1 spot left</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
