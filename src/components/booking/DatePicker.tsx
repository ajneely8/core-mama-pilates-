"use client";

import { useMemo } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "cn";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export function DatePicker({
  month,
  onMonthChange,
  selected,
  onSelect,
  availableDays,
  minMonth,
  maxMonth,
  loading,
}: {
  month: Date;
  onMonthChange: (m: Date) => void;
  /** "yyyy-MM-dd" in the visitor's local zone. */
  selected: string | null;
  onSelect: (key: string) => void;
  availableDays: Set<string>;
  minMonth: Date;
  maxMonth: Date;
  loading?: boolean;
}) {
  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
      }),
    [month],
  );
  const canPrev = startOfMonth(month) > startOfMonth(minMonth);
  const canNext = startOfMonth(month) < startOfMonth(maxMonth);

  return (
    <div className="w-full max-w-md" aria-busy={loading}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-2xl" aria-live="polite">
          {format(month, "MMMM yyyy")}
        </h3>
        <div className="flex gap-1">
          <button
            type="button"
            aria-label="Previous month"
            disabled={!canPrev}
            onClick={() => onMonthChange(addMonths(month, -1))}
            className="flex size-10 items-center justify-center rounded-full border border-espresso/15 text-espresso transition-colors hover:bg-espresso/5 disabled:opacity-30"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next month"
            disabled={!canNext}
            onClick={() => onMonthChange(addMonths(month, 1))}
            className="flex size-10 items-center justify-center rounded-full border border-espresso/15 text-espresso transition-colors hover:bg-espresso/5 disabled:opacity-30"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div role="grid" aria-label={format(month, "MMMM yyyy")} className="mt-6">
        <div role="row" className="grid grid-cols-7 text-center">
          {WEEKDAYS.map((d, i) => (
            <span key={i} role="columnheader" className="pb-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-espresso/45">
              {d}
            </span>
          ))}
        </div>
        <div className={cn("grid grid-cols-7 gap-y-1 transition-opacity", loading && "opacity-50")}>
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const inMonth = isSameMonth(day, month);
            const available = inMonth && availableDays.has(key);
            const isSelected = selected === key;
            return (
              <div key={key} role="gridcell" className="flex justify-center">
                <button
                  type="button"
                  disabled={!available}
                  aria-pressed={isSelected}
                  aria-label={format(day, "EEEE, MMMM d") + (available ? "" : " (unavailable)")}
                  onClick={() => onSelect(key)}
                  className={cn(
                    "relative flex size-11 flex-col items-center justify-center rounded-full font-sans text-sm transition-all duration-200",
                    !inMonth && "invisible",
                    available && !isSelected && "text-espresso hover:bg-espresso/[0.06]",
                    !available && "text-espresso/25",
                    isSelected && "bg-espresso text-cream shadow-[0_8px_20px_-10px_rgba(51,43,38,0.6)]",
                  )}
                >
                  <span className="tabular-nums">{format(day, "d")}</span>
                  {available && !isSelected && <span className="absolute bottom-1.5 size-1 rounded-full bg-rose-deep" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
