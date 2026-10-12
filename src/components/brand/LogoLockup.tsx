import { cn } from "cn";
import { brand } from "@/config/brand";
import { Wordmark } from "./Wordmark";
import { LeafMark } from "./LeafMark";
import { LogoLink } from "./LogoLink";

/** Static mark + wordmark + descriptor used in the nav and footer. */
export function LogoLockup({
  className,
  href = "/",
  size = "md",
  withMark = true,
  onDark = false,
}: {
  className?: string;
  href?: string | null;
  size?: "sm" | "md" | "lg";
  withMark?: boolean;
  /** Cream lettering for dark backgrounds. */
  onDark?: boolean;
}) {
  const widths = { sm: "w-[104px]", md: "w-[128px]", lg: "w-[180px]" }[size];
  const markSize = { sm: "w-9", md: "w-11", lg: "w-16" }[size];
  const inner = (
    <span className={cn("inline-flex items-center gap-3", onDark ? "text-cream" : "text-espresso", className)}>
      {withMark && (
        <span className={cn(markSize, "shrink-0 text-olive", onDark && "rounded-full bg-cream p-1")}>
          <LeafMark />
        </span>
      )}
      <span className="inline-flex flex-col items-center gap-[3px]">
        <Wordmark className={widths} mono={onDark} />
        <span
          className={cn(
            "font-sans font-semibold uppercase",
            onDark ? "text-cream/75" : "text-espresso/80",
            size === "lg" ? "text-[11px] tracking-[0.46em]" : "text-[9px] tracking-[0.42em]",
          )}
          style={{ marginRight: "-0.42em" }}
        >
          {brand.logo.descriptor}
        </span>
      </span>
    </span>
  );
  if (!href) return inner;
  return (
    <LogoLink href={href} aria-label={`${brand.logo.wordmark} ${brand.logo.descriptor} — home`} className="inline-flex">
      {inner}
    </LogoLink>
  );
}
