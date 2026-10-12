"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";
import { cn } from "cn";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { LogoLockup } from "@/components/brand/LogoLockup";

const links = [
  { href: "/#experience", label: "The Studio" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#memberships", label: "Memberships" },
  { href: "/#faq", label: "FAQ" },
  { href: "/founding-members", label: "Founding Members" },
];

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Nav() {
  const pathname = usePathname();
  const minimal = pathname.startsWith("/founding-members");
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 backdrop-blur-md transition-[background-color,box-shadow] duration-500",
          scrolled || open ? "bg-cream/92 shadow-[0_1px_0_0_rgba(51,43,38,0.08)]" : "bg-cream/70",
        )}
      >
        <div className="container-x flex h-[76px] items-center justify-between">
          <LogoLockup size="sm" />

          {!minimal && (
            <nav
              aria-label="Primary"
              className="hidden items-center gap-8 lg:flex"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group relative font-sans text-[13px] font-medium tracking-[0.04em] text-espresso/80 transition-colors hover:text-espresso"
                >
                  {l.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-espresso transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-3">
            {minimal ? (
              <Button variant="outline" size="sm" render={<Link href="/" />}>
                Visit the studio site
              </Button>
            ) : (
              <Button
                size="sm"
                className="hidden sm:inline-flex"
                render={<Link href="/book" />}
              >
                Book a Session
              </Button>
            )}
            {!minimal && (
              <button
                type="button"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
                className="relative flex size-11 items-center justify-center rounded-full border border-espresso/20 lg:hidden"
              >
                <span
                  className={cn(
                    "absolute h-px w-4 bg-espresso transition-transform duration-300",
                    open ? "translate-y-0 rotate-45" : "-translate-y-[3px]",
                  )}
                />
                <span
                  className={cn(
                    "absolute h-px w-4 bg-espresso transition-transform duration-300",
                    open ? "translate-y-0 -rotate-45" : "translate-y-[3px]",
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Rendered outside the header: its backdrop-filter would otherwise
          turn this fixed panel's containing block into the 76px bar. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[76px] bottom-0 z-30 flex flex-col overflow-y-auto bg-cream lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav
              aria-label="Mobile"
              className="container-x flex flex-1 flex-col justify-center gap-1 py-8"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={l.href}
                    onClick={close}
                    className="block border-b border-espresso/10 py-4 font-display text-3xl text-espresso"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                className="mt-8 flex flex-col gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                <Button
                  size="lg"
                  render={<Link href="/book" onClick={close} />}
                >
                  Book a Session
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  render={<Link href="/founding-members" onClick={close} />}
                >
                  Become a Founding Member
                </Button>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 self-center font-sans text-sm text-espresso/70"
                >
                  <Instagram className="size-4" /> @{site.instagram.handle}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
