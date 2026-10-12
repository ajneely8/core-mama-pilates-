import { cn } from "cn";
import { LeafMark } from "@/components/brand/LeafMark";

/** Slow-moving ribbon of brand phrases. Pauses under prefers-reduced-motion. */
export function Marquee({
  items,
  className,
  tone = "rose",
}: {
  items: string[];
  className?: string;
  tone?: "rose" | "olive" | "blush";
}) {
  const tones = {
    rose: "bg-rose-deep text-cream",
    olive: "bg-olive text-cream",
    blush: "bg-blush text-espresso",
  };
  const row = (
    <>
      {items.map((t, i) => (
        <span key={i} className="flex shrink-0 items-center gap-8 pr-8">
          <span className="font-display text-2xl italic md:text-3xl">{t}</span>
          <span className="size-1.5 rounded-full bg-current opacity-70" />
        </span>
      ))}
    </>
  );
  return (
    <div aria-hidden className={cn("overflow-hidden py-4 md:py-5", tones[tone], className)}>
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
      <span className="sr-only">{items.join(" · ")}</span>
      <LeafMark className="hidden" />
    </div>
  );
}
