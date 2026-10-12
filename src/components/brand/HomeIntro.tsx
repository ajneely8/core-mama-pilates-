"use client";

import { usePathname } from "next/navigation";
import { useIntro } from "./intro-context";
import { LogoIntro } from "./LogoIntro";

/** Mounts the logo intro on the homepage, outside the page-transition wrapper
 *  so its fixed overlay always sits above the navigation. Re-keyed on `run`
 *  so a logo click replays it from the start. */
export function HomeIntro() {
  const pathname = usePathname();
  const { run } = useIntro();
  if (pathname !== "/") return null;
  return <LogoIntro key={run} />;
}
