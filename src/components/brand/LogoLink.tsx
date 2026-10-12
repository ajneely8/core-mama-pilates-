"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIntro } from "./intro-context";

/**
 * Wraps the nav/footer logo. On the homepage a click replays the logo intro
 * and returns to the top; elsewhere it navigates home, where the intro plays
 * on mount.
 */
export function LogoLink({
  href = "/",
  className,
  "aria-label": ariaLabel,
  children,
}: {
  href?: string;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { replay } = useIntro();
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        if (href === "/" && pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "auto" });
          replay();
        }
      }}
    >
      {children}
    </Link>
  );
}
